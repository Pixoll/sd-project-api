import Jimp from "jimp";
import jsQR from "jsqr";
import { Endpoint } from "./base";
import { User } from "../schemas/user";

export class UsersVerifyId extends Endpoint implements Endpoint.PostMethod {
    // eslint-disable-next-line max-len
    private static readonly idUrlRegex = /^https:\/\/portal\.sidiv\.registrocivil\.cl\/docstatus\?RUN=(\d{7,}-[\dkK])&type=CEDULA&serial=\d{9}&mrz=\d{24}$/;

    public constructor() {
        super("/users/verify_id");
    }

    /**
     * @name Verify User Identity
     * @description **Only usable while logged in as a user.**
     * @description Verify a user's ID by reading the QR code at the back of it. Will not process images bigger than 1MB.
     * @header Authorization | string | Session token of the logged in user. See {endpoint:users/login}.
     * @query rut | string | RUT of the user to verify.
     * @body data | string | Image encoded in base64 format.
     * @code 200 Successfully verified the user's identity.
     * @code 400 Malformed request or QR content.
     * @code 401 Not logged in.
     * @code 404 User does not exist.
     * @code 409 User is already verified.
     * @code 413 Image is bigger than 1MB.
     */
    public async post(request: Endpoint.Request<{ data?: string }, "rut">, response: Endpoint.Response): Promise<void> {
        const authorizedUser = Endpoint.getAuthorizedUser(request);
        if (authorizedUser?.type !== "user") {
            Endpoint.sendError(response, Endpoint.HTTPCode.Unauthorized, "Not logged in.");
            return;
        }

        const user = await User.Model.findById(authorizedUser.rut);
        if (!user) {
            Endpoint.sendError(response, Endpoint.HTTPCode.NotFound, "User does not exist.");
            return;
        }

        if (user.verified) {
            Endpoint.sendError(response, Endpoint.HTTPCode.Conflict, "User has already verified their identity.");
            return;
        }

        const { data } = request.body;
        if (!data) {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, "Expected data property in the request body.");
            return;
        }

        const kBs = data.length * 0.00075;
        if (kBs > 1000) {
            Endpoint.sendError(response, Endpoint.HTTPCode.ContentTooLarge, "Image is bigger than 1MB.");
            return;
        }

        const image = await Jimp.read(Buffer.from(data, "base64")).catch(() => null);
        if (!image) {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, "Could not resolve image from provided data.");
            return;
        }

        const raw = new Uint8ClampedArray(image.bitmap.data.toJSON().data);
        const idUrl = jsQR(raw, image.bitmap.width, image.bitmap.height)?.data ?? null;
        if (!idUrl) {
            Endpoint.sendError(
                response,
                Endpoint.HTTPCode.BadRequest,
                "Could not read contents from QR code, if there was any."
            );
            return;
        }

        const urlRut = idUrl.match(UsersVerifyId.idUrlRegex)?.[1];
        if (urlRut !== authorizedUser.rut) {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, "Invalid QR code contents.");
            return;
        }

        // we'll just assume everything else is correct from here
        // there's no API to actually check this

        user.verified = true;
        await user.save();

        Endpoint.sendOk(response);
    }
}
