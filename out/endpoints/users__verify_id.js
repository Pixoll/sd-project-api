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
        if (request.headers["content-type"] !== "application/json") {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
            return;
        }
        const { rut } = request.query;
        if (!rut) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected RUT query parameter.");
            return;
        }
        if (!db_1.User.isValidRut(rut)) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Invalid RUT.");
            return;
        }
        const existing = await db_1.User.Model.findById(rut);
        if (!existing) {
            (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "User does not exist.");
            return;
        }
        if (existing.verified) {
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
        const image = await jimp_1.default.read(Buffer.from(data, "base64"));
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
        existing.verified = true;
        await existing.save();
        (0, base_1.sendOk)(response);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnNfX3ZlcmlmeV9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvdXNlcnNfX3ZlcmlmeV9pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsZ0RBQXdCO0FBQ3hCLGlDQUE4RDtBQUM5RCw4QkFBNkI7QUFHN0IsTUFBTSxVQUFVLEdBQUcsa0hBQWtILENBQUM7QUFFekgsUUFBQSxPQUFPLEdBQUc7SUFZbkIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUTtRQUN4QixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssa0JBQWtCLEVBQUUsQ0FBQztZQUN6RCxJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsaURBQWlELENBQUMsQ0FBQztZQUM1RixPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBMkMsQ0FBQztRQUNwRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDUCxJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsK0JBQStCLENBQUMsQ0FBQztZQUMxRSxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQyxTQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDeEIsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3pELE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDWixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztZQUMvRCxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3BCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsRUFBRSwyQ0FBMkMsQ0FBQyxDQUFDO1lBQ3BGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUF1QyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNSLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSw2Q0FBNkMsQ0FBQyxDQUFDO1lBQ3hGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7UUFDbEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUM7WUFDYixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxlQUFlLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztZQUMzRSxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLE1BQU0sY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzNELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQWlCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkUsTUFBTSxLQUFLLEdBQUcsSUFBQSxjQUFJLEVBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxJQUFJLElBQUksQ0FBQztRQUMvRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDVCxJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUseURBQXlELENBQUMsQ0FBQztZQUNwRyxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztZQUN0RSxPQUFPO1FBQ1gsQ0FBQztRQUtELFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXRCLElBQUEsYUFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7Q0FDYyxDQUFDIn0=