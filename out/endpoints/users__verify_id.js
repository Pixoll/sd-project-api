"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const jimp_1 = __importDefault(require("jimp"));
const jsqr_1 = __importDefault(require("jsqr"));
const base_1 = require("./base");
const db_1 = require("../db");
const idUrlRegex = /^https:\/\/portal\.sidiv\.registrocivil\.cl\/docstatus\?RUN=(\d{7,}-[\dkK])&type=CEDULA&serial=\d{9}&mrz=\d{24}$/;
exports.methods = {
    async post(request, response) {
        const authorizedUser = (0, base_1.getAuthorizedUser)(request);
        if (authorizedUser?.type !== "user") {
            (0, base_1.sendError)(response, base_1.HTTPCode.Unauthorized, "Not logged in.");
            return;
        }
        const user = await db_1.User.Model.findById(authorizedUser.rut);
        if (!user) {
            (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "User does not exist.");
            return;
        }
        if (user.verified) {
            (0, base_1.sendError)(response, base_1.HTTPCode.Conflict, "User has already verified their identity.");
            return;
        }
        const { data } = request.body;
        if (!data) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected data property in the request body.");
            return;
        }
        const kBs = data.length * 0.00075;
        if (kBs > 1000) {
            (0, base_1.sendError)(response, base_1.HTTPCode.ContentTooLarge, "Image is bigger than 1MB.");
            return;
        }
        const image = await jimp_1.default.read(Buffer.from(data, "base64")).catch(() => null);
        if (!image) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Could not resolve image from provided data.");
            return;
        }
        const raw = new Uint8ClampedArray(image.bitmap.data.toJSON().data);
        const idUrl = (0, jsqr_1.default)(raw, image.bitmap.width, image.bitmap.height)?.data ?? null;
        if (!idUrl) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Could not read contents from QR code, if there was any.");
            return;
        }
        const urlRut = idUrl.match(idUrlRegex)?.[1];
        if (urlRut !== authorizedUser.rut) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Invalid QR code contents.");
            return;
        }
        user.verified = true;
        await user.save();
        (0, base_1.sendOk)(response);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnNfX3ZlcmlmeV9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvdXNlcnNfX3ZlcmlmeV9pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsZ0RBQXdCO0FBQ3hCLGlDQUF5RjtBQUN6Riw4QkFBNkI7QUFHN0IsTUFBTSxVQUFVLEdBQUcsa0hBQWtILENBQUM7QUFFekgsUUFBQSxPQUFPLEdBQUc7SUFlbkIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUTtRQUN4QixNQUFNLGNBQWMsR0FBRyxJQUFBLHdCQUFpQixFQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELElBQUksY0FBYyxFQUFFLElBQUksS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUNsQyxJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUM3RCxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sU0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNSLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1lBQy9ELE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEIsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxFQUFFLDJDQUEyQyxDQUFDLENBQUM7WUFDcEYsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDUixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsNkNBQTZDLENBQUMsQ0FBQztZQUN4RixPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ2xDLElBQUksR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDO1lBQ2IsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsZUFBZSxFQUFFLDJCQUEyQixDQUFDLENBQUM7WUFDM0UsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEtBQUssR0FBRyxNQUFNLGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1QsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLDZDQUE2QyxDQUFDLENBQUM7WUFDeEYsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25FLE1BQU0sS0FBSyxHQUFHLElBQUEsY0FBSSxFQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksSUFBSSxJQUFJLENBQUM7UUFDL0UsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1QsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLHlEQUF5RCxDQUFDLENBQUM7WUFDcEcsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsSUFBSSxNQUFNLEtBQUssY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2hDLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1lBQ3RFLE9BQU87UUFDWCxDQUFDO1FBS0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFbEIsSUFBQSxhQUFNLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFDckIsQ0FBQztDQVFILENBQUMifQ==