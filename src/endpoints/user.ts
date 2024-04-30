import { createHash } from "crypto";
import {
    Methods,
    sendBadRequest,
    sendConflict,
    sendCreated,
    sendNoContent,
    sendNotFound,
    sendOk,
    sendServerError,
} from "./base";
import { omit, replaceKey } from "../util";
import { User, validateStructure } from "../db";

export const methods = {
    async get(request, response): Promise<void> {
        const { rut, email, phone } = request.query as Record<string, string | undefined>;
        if ((+!!rut) + (+!!email) + (+!!phone) !== 1) {
            sendBadRequest(response, "Expected only one of either rut, email or phone in query.");
            return;
        }

        try {
            const user = await User.Model.findOne({
                $or: [
                    { _id: parseInt(rut ?? "0") },
                    { email },
                    { phone: parseInt(phone ?? "0") },
                ],
            });
            if (!user) {
                sendNotFound(response, "User does not exist.");
                return;
            }

            sendOk(response, omit(User.toJSON(user), ["password"]));
        } catch (error) {
            console.error(error);
            sendServerError(response, "Unexpected error while trying to get user.");
            return;
        }
    },

    async post(request, response): Promise<void> {
        if (request.headers["content-type"] !== "application/json") {
            sendBadRequest(response, "Content-Type header must be 'application/json'.");
            return;
        }

        const validationResult = validateStructure(request.body, User.Model);
        if (validationResult !== true) {
            sendBadRequest(response, validationResult);
            return;
        }

        const userJson = /** @type {import("../db/schemas").UserJSON} */ (request.body);
        const { rut, email, phone } = userJson;

        try {
            const existingRut = await User.Model.findOne({ _id: rut });
            if (existingRut) {
                sendConflict(response, "Usuario con ese RUT ya existe.");
                return;
            }

            const existingEmail = await User.Model.findOne({ email });
            if (existingEmail) {
                sendConflict(response, "Usuario con ese email ya existe.");
                return;
            }

            const existingPhone = await User.Model.findOne({ phone });
            if (existingPhone) {
                sendConflict(response, "Usuario con ese número de teléfono ya existe.");
                return;
            }
        } catch (error) {
            console.error(error);
            sendServerError(response, "Unexpected error while trying to find existing user.");
            return;
        }

        try {
            await new User.Model({
                ...replaceKey(omit(userJson, ["password"]), "rut", "_id"),
                password: hashPassword(userJson.password),
            }).save();
        } catch (error) {
            console.error(error);
            sendServerError(response, "Unexpected error while trying to add new user.");
            return;
        }

        sendCreated(response);
    },

    async delete(request, response): Promise<void> {
        const { rut } = request.query as Record<string, string | undefined>;
        if (!rut) {
            sendBadRequest(response, "Expected RUT query parameter.");
            return;
        }

        try {
            const user = await User.Model.findOne({ _id: parseInt(rut ?? "0") });
            if (!user) {
                sendNotFound(response, "User does not exist.");
                return;
            }

            await user.deleteOne();
            sendNoContent(response);
        } catch (error) {
            console.error(error);
            sendServerError(response, "Unexpected error while trying to delete the user.");
            return;
        }
    },
} satisfies Methods;

function hashPassword(string: string): string {
    return createHash("sha256").update(string).digest("hex");
}
