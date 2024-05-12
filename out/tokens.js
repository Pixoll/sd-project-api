"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeToken = exports.getRutFromToken = exports.generateToken = exports.loadTokens = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const util_1 = require("./util");
const tokensFilePath = path_1.default.join(__dirname, "../data/tokens.json");
const tokens = {
    user: {},
    admin: {},
};
function loadTokens() {
    try {
        const saved = JSON.parse((0, fs_1.readFileSync)(tokensFilePath, "utf8"));
        if (!(0, util_1.hasOneOfKeys)(saved, ["admin", "user"]) || typeof saved.admin !== "object" || typeof saved.user !== "object") {
            throw new TypeError("tokens.json has the wrong structure.");
        }
        Object.assign(tokens, saved);
    }
    catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
            (0, fs_1.mkdirSync)(path_1.default.parse(tokensFilePath).dir, { recursive: true });
            saveTokens();
            return;
        }
        throw error;
    }
}
exports.loadTokens = loadTokens;
function generateToken(type, rut) {
    const destination = tokens[type];
    if (rut in destination) {
        revokeToken(type, rut);
    }
    let token;
    do {
        token = (0, crypto_1.randomBytes)(64).toString("base64");
    } while (token in destination);
    destination[token] = rut;
    destination[rut] = token;
    saveTokens();
    return token;
}
exports.generateToken = generateToken;
function getRutFromToken(type, token) {
    return tokens[type][token] ?? null;
}
exports.getRutFromToken = getRutFromToken;
function revokeToken(type, rut) {
    const source = tokens[type];
    const token = source[rut] ?? null;
    if (!token)
        return false;
    delete source[token];
    delete source[rut];
    saveTokens();
    return true;
}
exports.revokeToken = revokeToken;
function saveTokens() {
    (0, fs_1.writeFileSync)(tokensFilePath, JSON.stringify(tokens, null, 2), "utf-8");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Rva2Vucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtQ0FBcUM7QUFDckMsMkJBQTREO0FBQzVELGdEQUF3QjtBQUN4QixpQ0FBc0M7QUFFdEMsTUFBTSxjQUFjLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUJBQXFCLENBQUMsQ0FBQztBQVVuRSxNQUFNLE1BQU0sR0FBZTtJQUN2QixJQUFJLEVBQUUsRUFBRTtJQUNSLEtBQUssRUFBRSxFQUFFO0NBQ1osQ0FBQztBQUlGLFNBQWdCLFVBQVU7SUFDdEIsSUFBSSxDQUFDO1FBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFBLGlCQUFZLEVBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFlLENBQUM7UUFDN0UsSUFBSSxDQUFDLElBQUEsbUJBQVksRUFBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLEtBQUssUUFBUSxJQUFJLE9BQU8sS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUMvRyxNQUFNLElBQUksU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxLQUFLLFlBQVksS0FBSyxJQUFJLE1BQU0sSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUN2RSxJQUFBLGNBQVMsRUFBQyxjQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELFVBQVUsRUFBRSxDQUFDO1lBQ2IsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEtBQUssQ0FBQztJQUNoQixDQUFDO0FBQ0wsQ0FBQztBQWpCRCxnQ0FpQkM7QUFFRCxTQUFnQixhQUFhLENBQUMsSUFBZSxFQUFFLEdBQVc7SUFDdEQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLElBQUksR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3JCLFdBQVcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksS0FBYSxDQUFDO0lBQ2xCLEdBQUcsQ0FBQztRQUNBLEtBQUssR0FBRyxJQUFBLG9CQUFXLEVBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUMsUUFBUSxLQUFLLElBQUksV0FBVyxFQUFFO0lBRS9CLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDekIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUN6QixVQUFVLEVBQUUsQ0FBQztJQUViLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFoQkQsc0NBZ0JDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLElBQWUsRUFBRSxLQUFhO0lBQzFELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQztBQUN2QyxDQUFDO0FBRkQsMENBRUM7QUFFRCxTQUFnQixXQUFXLENBQUMsSUFBZSxFQUFFLEdBQVc7SUFDcEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDbEMsSUFBSSxDQUFDLEtBQUs7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUV6QixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQixVQUFVLEVBQUUsQ0FBQztJQUViLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFWRCxrQ0FVQztBQUVELFNBQVMsVUFBVTtJQUNmLElBQUEsa0JBQWEsRUFBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVFLENBQUMifQ==