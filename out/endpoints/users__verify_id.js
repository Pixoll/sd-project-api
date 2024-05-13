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
        const { rut } = request.query;
        if (!rut) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected RUT query parameter.");
            return;
        }
        if (!db_1.User.isValidRut(rut)) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Invalid RUT.");
            return;
        }
        const user = await db_1.User.Model.findById(rut);
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
        if (urlRut !== rut) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Invalid QR code contents.");
            return;
        }
        user.verified = true;
        await user.save();
        (0, base_1.sendOk)(response);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnNfX3ZlcmlmeV9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvdXNlcnNfX3ZlcmlmeV9pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsZ0RBQXdCO0FBQ3hCLGlDQUFzRTtBQUN0RSw4QkFBNkI7QUFHN0IsTUFBTSxVQUFVLEdBQUcsa0hBQWtILENBQUM7QUFFekgsUUFBQSxPQUFPLEdBQUc7SUFZbkIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUTtRQUN4QixNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUM5QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDUCxJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsK0JBQStCLENBQUMsQ0FBQztZQUMxRSxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQyxTQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDeEIsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3pELE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDUixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztZQUMvRCxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsRUFBRSwyQ0FBMkMsQ0FBQyxDQUFDO1lBQ3BGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDOUIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1IsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLDZDQUE2QyxDQUFDLENBQUM7WUFDeEYsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUNsQyxJQUFJLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUNiLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLGVBQWUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1lBQzNFLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNULElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSw2Q0FBNkMsQ0FBQyxDQUFDO1lBQ3hGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRSxNQUFNLEtBQUssR0FBRyxJQUFBLGNBQUksRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLElBQUksSUFBSSxDQUFDO1FBQy9FLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNULElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSx5REFBeUQsQ0FBQyxDQUFDO1lBQ3BHLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1lBQ3RFLE9BQU87UUFDWCxDQUFDO1FBS0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFbEIsSUFBQSxhQUFNLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFDckIsQ0FBQztDQVFILENBQUMifQ==