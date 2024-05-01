import { createHash } from "crypto";
import { HTTPCode, Methods, sendOk, sendCreated, sendNoContent, sendError } from "./base";
import { User, validateStructure } from "../db";
import { omit, replaceKey } from "../util";

export const methods = {
    async get(request, response): Promise<void> {
        const { rut, email, phone } = request.query as Record<string, string | undefined>;
        if ((+!!rut) + (+!!email) + (+!!phone) !== 1) {
            sendError(response, HTTPCode.BadRequest, "Expected only one of either rut, email or phone in query.");
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
                sendError(response, HTTPCode.NotFound, "User does not exist.");
                return;
            }

            sendOk(response, omit(User.toJSON(user), ["password"]));
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to get user.");
        }
    },

    async post(request, response): Promise<void> {
        if (request.headers["content-type"] !== "application/json") {
            sendError(response, HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
            return;
        }

        const validationResult = validateStructure(request.body, User.Model);
        if (validationResult !== true) {
            sendError(response, HTTPCode.BadRequest, validationResult);
            return;
        }

        const userJson = request.body as User.JSON;
        const { rut, email, phone } = userJson;

        try {
            const existingRut = await User.Model.findOne({ _id: rut });
            if (existingRut) {
                sendError(response, HTTPCode.Conflict, "User with specified RUT already exists.");
                return;
            }

            const existingEmail = await User.Model.findOne({ email });
            if (existingEmail) {
                sendError(response, HTTPCode.Conflict, "User with specified email already exists.");
                return;
            }

            const existingPhone = await User.Model.findOne({ phone });
            if (existingPhone) {
                sendError(response, HTTPCode.Conflict, "User with specified phone number already exists.");
                return;
            }
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to find existing user.");
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
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to add new user.");
        }
    },

    async delete(request, response): Promise<void> {
        const { rut } = request.query as Record<string, string | undefined>;
        if (!rut) {
            sendError(response, HTTPCode.BadRequest, "Expected RUT query parameter.");
            return;
        }

        try {
            const user = await User.Model.findOne({ _id: parseInt(rut ?? "0") });
            if (!user) {
                sendError(response, HTTPCode.NotFound, "User does not exist.");
                return;
            }

            await user.deleteOne();
            sendNoContent(response);
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to delete the user.");
        }
    },
} satisfies Methods;

function hashPassword(string: string): string {
    return createHash("sha256").update(string).digest("hex");
}
