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
    async get(request, response, next): Promise<void> {
        const { rut, email, phone } = request.query as Record<string, string | undefined>;
        if ((+!!rut) + (+!!email) + (+!!phone) !== 1) {
            sendBadRequest(response, "Expected only one of either rut, email or phone in query.");
            next();
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
                next();
                return;
            }

            sendOk(response, omit(User.toJSON(user), ["password"]));
        } catch (error) {
            console.error(error);
            sendServerError(response, "Unexpected error while trying to get user.");
        }

        next();
    },

    async post(request, response, next): Promise<void> {
        if (request.headers["content-type"] !== "application/json") {
            sendBadRequest(response, "Content-Type header must be 'application/json'.");
            next();
            return;
        }

        const validationResult = validateStructure(request.body, User.Model);
        if (validationResult !== true) {
            sendBadRequest(response, validationResult);
            next();
            return;
        }

        const userJson = request.body as User.JSON;
        const { rut, email, phone } = userJson;

        try {
            const existingRut = await User.Model.findOne({ _id: rut });
            if (existingRut) {
                sendConflict(response, "Usuario con ese RUT ya existe.");
                next();
                return;
            }

            const existingEmail = await User.Model.findOne({ email });
            if (existingEmail) {
                sendConflict(response, "Usuario con ese email ya existe.");
                next();
                return;
            }

            const existingPhone = await User.Model.findOne({ phone });
            if (existingPhone) {
                sendConflict(response, "Usuario con ese número de teléfono ya existe.");
                next();
                return;
            }
        } catch (error) {
            console.error(error);
            sendServerError(response, "Unexpected error while trying to find existing user.");
            next();
            return;
        }

        try {
            await new User.Model({
                ...replaceKey(omit(userJson, ["password"]), "rut", "_id"),
                password: hashPassword(userJson.password),
            }).save();

            sendCreated(response);
        } catch (error) {
            console.error(error);
            sendServerError(response, "Unexpected error while trying to add new user.");
        }

        next();
    },

    async delete(request, response, next): Promise<void> {
        const { rut } = request.query as Record<string, string | undefined>;
        if (!rut) {
            sendBadRequest(response, "Expected RUT query parameter.");
            next();
            return;
        }

        try {
            const user = await User.Model.findOne({ _id: parseInt(rut ?? "0") });
            if (!user) {
                sendNotFound(response, "User does not exist.");
                next();
                return;
            }

            await user.deleteOne();
            sendNoContent(response);
        } catch (error) {
            console.error(error);
            sendServerError(response, "Unexpected error while trying to delete the user.");
        }

        next();
    },
} satisfies Methods;

function hashPassword(string: string): string {
    return createHash("sha256").update(string).digest("hex");
}
