"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersVerifyId = void 0;
const jimp_1 = __importDefault(require("jimp"));
const jsqr_1 = __importDefault(require("jsqr"));
const base_1 = require("./base");
const db_1 = require("../db");
class UsersVerifyId extends base_1.Endpoint {
    static idUrlRegex = /^https:\/\/portal\.sidiv\.registrocivil\.cl\/docstatus\?RUN=(\d{7,}-[\dkK])&type=CEDULA&serial=\d{9}&mrz=\d{24}$/;
    constructor() {
        super("/users/verify_id");
    }
    async post(request, response) {
        const authorizedUser = base_1.Endpoint.getAuthorizedUser(request);
        if (authorizedUser?.type !== "user") {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Unauthorized, "Not logged in.");
            return;
        }
        const user = await db_1.User.Model.findById(authorizedUser.rut);
        if (!user) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "User does not exist.");
            return;
        }
        if (user.verified) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Conflict, "User has already verified their identity.");
            return;
        }
        const { data } = request.body;
        if (!data) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Expected data property in the request body.");
            return;
        }
        const kBs = data.length * 0.00075;
        if (kBs > 1000) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.ContentTooLarge, "Image is bigger than 1MB.");
            return;
        }
        const image = await jimp_1.default.read(Buffer.from(data, "base64")).catch(() => null);
        if (!image) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Could not resolve image from provided data.");
            return;
        }
        const raw = new Uint8ClampedArray(image.bitmap.data.toJSON().data);
        const idUrl = (0, jsqr_1.default)(raw, image.bitmap.width, image.bitmap.height)?.data ?? null;
        if (!idUrl) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Could not read contents from QR code, if there was any.");
            return;
        }
        const urlRut = idUrl.match(UsersVerifyId.idUrlRegex)?.[1];
        if (urlRut !== authorizedUser.rut) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Invalid QR code contents.");
            return;
        }
        user.verified = true;
        await user.save();
        base_1.Endpoint.sendOk(response);
    }
}
exports.UsersVerifyId = UsersVerifyId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnNfX3ZlcmlmeV9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvdXNlcnNfX3ZlcmlmeV9pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsZ0RBQXdCO0FBQ3hCLGlDQUFrQztBQUNsQyw4QkFBNkI7QUFFN0IsTUFBYSxhQUFjLFNBQVEsZUFBUTtJQUUvQixNQUFNLENBQVUsVUFBVSxHQUFHLGtIQUFrSCxDQUFDO0lBRXhKO1FBQ0ksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDOUIsQ0FBQztJQWdCTSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQW1ELEVBQUUsUUFBMkI7UUFDOUYsTUFBTSxjQUFjLEdBQUcsZUFBUSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNELElBQUksY0FBYyxFQUFFLElBQUksS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUNsQyxlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQy9FLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1IsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztZQUNqRixPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLDJDQUEyQyxDQUFDLENBQUM7WUFDdEcsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDUixlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSw2Q0FBNkMsQ0FBQyxDQUFDO1lBQzFHLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7UUFDbEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUM7WUFDYixlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1lBQzdGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNULGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLDZDQUE2QyxDQUFDLENBQUM7WUFDMUcsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25FLE1BQU0sS0FBSyxHQUFHLElBQUEsY0FBSSxFQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksSUFBSSxJQUFJLENBQUM7UUFDL0UsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1QsZUFBUSxDQUFDLFNBQVMsQ0FDZCxRQUFRLEVBQ1IsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQzVCLHlEQUF5RCxDQUM1RCxDQUFDO1lBQ0YsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksTUFBTSxLQUFLLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNoQyxlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1lBQ3hGLE9BQU87UUFDWCxDQUFDO1FBS0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFbEIsZUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixDQUFDOztBQWxGTCxzQ0FtRkMifQ==