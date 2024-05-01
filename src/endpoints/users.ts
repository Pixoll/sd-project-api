import { Methods, sendOk, sendServerError } from "./base";
import { User } from "../db";
import { omit } from "../util";

export const methods = {
    async get(_, response): Promise<void> {
        try {
            const users = await User.Model.find({}).then(users =>
                users.map(user =>
                    omit(User.toJSON(user), ["password"])
                )
            );

            sendOk(response, users);
        } catch (error) {
            console.error(error);
            sendServerError(response, "Unexpected error while trying to get users.");
        }
    },
} satisfies Methods;
