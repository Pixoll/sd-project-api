"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const util_1 = require("./util");
class TokenManager extends null {
    static tokensFilePath = path_1.default.join(__dirname, "../data/tokens.json");
    static tokens = {
        user: {},
        admin: {},
    };
    static loadTokens() {
        try {
            const saved = JSON.parse((0, fs_1.readFileSync)(TokenManager.tokensFilePath, "utf8"));
            if (!util_1.Util.hasOneOfKeys(saved, ["admin", "user"])
                || typeof saved.admin !== "object"
                || typeof saved.user !== "object") {
                throw new TypeError("tokens.json has the wrong structure.");
            }
            Object.assign(TokenManager.tokens, saved);
        }
        catch (error) {
            if (error instanceof Error && "code" in error && error.code === "ENOENT") {
                (0, fs_1.mkdirSync)(path_1.default.parse(TokenManager.tokensFilePath).dir, { recursive: true });
                TokenManager.saveTokens();
                return;
            }
            throw error;
        }
    }
    static generateToken(type, rut) {
        const destination = TokenManager.tokens[type];
        if (rut in destination) {
            TokenManager.revokeToken(type, rut);
        }
        let token;
        do {
            token = (0, crypto_1.randomBytes)(64).toString("base64");
        } while (token in destination);
        destination[token] = rut;
        destination[rut] = token;
        TokenManager.saveTokens();
        return token;
    }
    static getRutFromToken(type, token) {
        return TokenManager.tokens[type][token] ?? null;
    }
    static revokeToken(type, rut) {
        const source = TokenManager.tokens[type];
        const token = source[rut] ?? null;
        if (!token)
            return false;
        delete source[token];
        delete source[rut];
        TokenManager.saveTokens();
        return true;
    }
    static saveTokens() {
        (0, fs_1.writeFileSync)(TokenManager.tokensFilePath, JSON.stringify(TokenManager.tokens, null, 2), "utf-8");
    }
}
exports.TokenManager = TokenManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Rva2Vucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtQ0FBcUM7QUFDckMsMkJBQTREO0FBQzVELGdEQUF3QjtBQUN4QixpQ0FBOEI7QUFVOUIsTUFBYSxZQUFhLFNBQVEsSUFBSTtJQUMxQixNQUFNLENBQVUsY0FBYyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDN0UsTUFBTSxDQUFVLE1BQU0sR0FBZTtRQUN6QyxJQUFJLEVBQUUsRUFBRTtRQUNSLEtBQUssRUFBRSxFQUFFO0tBQ1osQ0FBQztJQUVLLE1BQU0sQ0FBQyxVQUFVO1FBQ3BCLElBQUksQ0FBQztZQUNELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBQSxpQkFBWSxFQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLENBQWUsQ0FBQztZQUMxRixJQUNJLENBQUMsV0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7bUJBQ3pDLE9BQU8sS0FBSyxDQUFDLEtBQUssS0FBSyxRQUFRO21CQUMvQixPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUNuQyxDQUFDO2dCQUNDLE1BQU0sSUFBSSxTQUFTLENBQUMsc0NBQXNDLENBQUMsQ0FBQztZQUNoRSxDQUFDO1lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxLQUFLLFlBQVksS0FBSyxJQUFJLE1BQU0sSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUUsQ0FBQztnQkFDdkUsSUFBQSxjQUFTLEVBQUMsY0FBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQzVFLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDMUIsT0FBTztZQUNYLENBQUM7WUFFRCxNQUFNLEtBQUssQ0FBQztRQUNoQixDQUFDO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBNEIsRUFBRSxHQUFXO1FBQ2pFLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUMsSUFBSSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDckIsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVELElBQUksS0FBYSxDQUFDO1FBQ2xCLEdBQUcsQ0FBQztZQUNBLEtBQUssR0FBRyxJQUFBLG9CQUFXLEVBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLENBQUMsUUFBUSxLQUFLLElBQUksV0FBVyxFQUFFO1FBRS9CLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDekIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN6QixZQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFMUIsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBNEIsRUFBRSxLQUFhO1FBQ3JFLE9BQU8sWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDcEQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBNEIsRUFBRSxHQUFXO1FBQy9ELE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUNsQyxJQUFJLENBQUMsS0FBSztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRXpCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUUxQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU8sTUFBTSxDQUFDLFVBQVU7UUFDckIsSUFBQSxrQkFBYSxFQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0RyxDQUFDOztBQWxFTCxvQ0FtRUMifQ==