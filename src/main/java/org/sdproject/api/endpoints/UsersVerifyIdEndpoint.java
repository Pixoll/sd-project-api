package org.sdproject.api.endpoints;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.NotFoundException;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.json.JSONObject;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.SessionTokenManager;
import org.sdproject.api.documentation.*;
import org.sdproject.api.structures.User;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;

public class UsersVerifyIdEndpoint extends Endpoint implements Endpoint.PostMethod {
    private static final String ID_URL_REGEX = "^https://portal\\.sidiv\\.registrocivil\\.cl/docstatus\\?RUN=(\\d{7,}-["
            + "\\dkK])&type=CEDULA&serial=\\d{9}&mrz=\\d{24}$";

    public UsersVerifyIdEndpoint() {
        super("/users/verify_id");
    }

    @MethodDoc(
            name = "Verify User Identity",
            description = "Verify a user's ID by reading the QR code at the back of it. Will not process images bigger than 1MB."
    )
    @HeaderUserAuthDoc
    @QueryDoc(key = "rut", type = String.class, description = "RUT of the user to verify.")
    @BodyDoc(name = "data", type = String.class, description = "Image encoded in base64 format.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully verified the user's identity.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Malformed request or QR content.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "User does not exist.")
    @CodeDoc(code = HttpStatus.CONFLICT, reason = "User is already verified.")
    @CodeDoc(code = HttpStatus.CONTENT_TOO_LARGE, reason = "Image is bigger than 1MB.")
    @Override
    public void post(Context ctx) throws EndpointException {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isUser()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in.");
        }

        final MongoCollection<User> usersCollection = DatabaseConnection.getUsersCollection();
        final User user = usersCollection.find(Filters.eq(User.Field.RUT.raw, authData.rut())).first();
        if (user == null) {
            SessionTokenManager.revokeToken(authData.type(), authData.rut());
            throw new EndpointException(HttpStatus.NOT_FOUND, "User does not exist.");
        }

        if (user.verified) {
            throw new EndpointException(HttpStatus.CONFLICT, "User has already verified their identity.");
        }

        final JSONObject body = ctx.bodyAsClass(JSONObject.class);
        final String data = body.optString("data");
        if (data.isEmpty()) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Expected data property in the request body.");
        }

        final float kBs = data.length() * 0.00075f;
        if (kBs > 1000) {
            throw new EndpointException(HttpStatus.CONTENT_TOO_LARGE, "Image is bigger than 1MB.");
        }

        final String qrContent;
        try {
            final BufferedImage image = ImageIO.read(new ByteArrayInputStream(Base64.getDecoder().decode(data)));
            qrContent = new MultiFormatReader().decode(new BinaryBitmap(new HybridBinarizer(
                    new BufferedImageLuminanceSource(image)
            ))).getText();
        } catch (IOException e) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Could not resolve image from provided data.");
        } catch (NotFoundException e) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Could not read contents from QR code, if there were any.");
        }

        if (!qrContent.matches(ID_URL_REGEX)) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Invalid QR code contents.");
        }

        final String rut = qrContent.replaceFirst(ID_URL_REGEX, "$1");
        if (!rut.equals(authData.rut())) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Invalid QR code contents.");
        }

        // we'll just assume everything else is correct from here
        // there's no API to actually check this

        usersCollection.updateOne(
                Filters.eq(User.Field.RUT.raw, user.rut),
                Updates.set(User.Field.VERIFIED.raw, true)
        );

        ctx.status(HttpStatus.OK);
    }
}
