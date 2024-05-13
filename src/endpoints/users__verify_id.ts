import Jimp from "jimp";
import jsQR from "jsqr";
import { HTTPCode, EndpointHandler, sendError, sendOk } from "./base";
import { User } from "../db";

// eslint-disable-next-line max-len
const idUrlRegex = /^https:\/\/portal\.sidiv\.registrocivil\.cl\/docstatus\?RUN=(\d{7,}-[\dkK])&type=CEDULA&serial=\d{9}&mrz=\d{24}$/;

export const methods = {
    /**
     * @name Verify User Identity
     * @description Verify a user's ID by reading the QR code at the back of it. Will not process images bigger than 1MB.
     * @query rut | string | RUT of the user to verify.
     * @body data | string | Image encoded in base64 format.
     * @code 200 Successfully verified the user's identity.
     * @code 400 Malformed request or QR content.
     * @code 404 User with that `rut` does not exist.
     * @code 409 User is already verified.
     * @code 413 Image is bigger than 1MB.
     */
    async post(request, response): Promise<void> {
        const { rut } = request.query;
        if (!rut) {
            sendError(response, HTTPCode.BadRequest, "Expected RUT query parameter.");
            return;
        }

        if (!User.isValidRut(rut)) {
            sendError(response, HTTPCode.BadRequest, "Invalid RUT.");
            return;
        }

        const user = await User.Model.findById(rut);
        if (!user) {
            sendError(response, HTTPCode.NotFound, "User does not exist.");
            return;
        }

        if (user.verified) {
            sendError(response, HTTPCode.Conflict, "User has already verified their identity.");
            return;
        }

        const { data } = request.body;
        if (!data) {
            sendError(response, HTTPCode.BadRequest, "Expected data property in the request body.");
            return;
        }

        const kBs = data.length * 0.00075;
        if (kBs > 1000) {
            sendError(response, HTTPCode.ContentTooLarge, "Image is bigger than 1MB.");
            return;
        }

        const image = await Jimp.read(Buffer.from(data, "base64")).catch(() => null);
        if (!image) {
            sendError(response, HTTPCode.BadRequest, "Could not resolve image from provided data.");
            return;
        }

        const raw = new Uint8ClampedArray(image.bitmap.data.toJSON().data);
        const idUrl = jsQR(raw, image.bitmap.width, image.bitmap.height)?.data ?? null;
        if (!idUrl) {
            sendError(response, HTTPCode.BadRequest, "Could not read contents from QR code, if there was any.");
            return;
        }

        const urlRut = idUrl.match(idUrlRegex)?.[1];
        if (urlRut !== rut) {
            sendError(response, HTTPCode.BadRequest, "Invalid QR code contents.");
            return;
        }

        // we'll just assume everything else is correct from here
        // there's no API to actually check this

        user.verified = true;
        await user.save();

        sendOk(response);
    },
} satisfies EndpointHandler<{
    post: {
        body: {
            data?: string;
        };
        queryKeys: "rut";
    };
}>;
