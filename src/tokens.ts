import { randomBytes } from "crypto";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { Util } from "./util";

export class TokenManager extends null {
    private static readonly tokensFilePath = path.join(__dirname, "../data/tokens.json");
    private static readonly tokens: TokensFile = {
        user: {},
        admin: {},
    };

    public static loadTokens(): void {
        try {
            const saved = JSON.parse(readFileSync(TokenManager.tokensFilePath, "utf8")) as TokensFile;
            if (
                !Util.hasOneOfKeys(saved, ["admin", "user"])
                || typeof saved.admin !== "object"
                || typeof saved.user !== "object"
            ) {
                throw new TypeError("tokens.json has the wrong structure.");
            }

            Object.assign(TokenManager.tokens, saved);
        } catch (error) {
            if (error instanceof Error && "code" in error && error.code === "ENOENT") {
                mkdirSync(path.parse(TokenManager.tokensFilePath).dir, { recursive: true });
                TokenManager.saveTokens();
                return;
            }

            throw error;
        }
    }

    public static generateToken(type: TokenManager.TokenType, rut: string): string {
        const destination = TokenManager.tokens[type];
        if (rut in destination) {
            TokenManager.revokeToken(type, rut);
        }

        let token: string;
        do {
            token = randomBytes(64).toString("base64");
        } while (token in destination);

        destination[token] = rut;
        destination[rut] = token;
        TokenManager.saveTokens();

        return token;
    }

    public static getRutFromToken(type: TokenManager.TokenType, token: string): string | null {
        return TokenManager.tokens[type][token] ?? null;
    }

    public static revokeToken(type: TokenManager.TokenType, rut: string): boolean {
        const source = TokenManager.tokens[type];
        const token = source[rut] ?? null;
        if (!token) return false;

        delete source[token];
        delete source[rut];
        TokenManager.saveTokens();

        return true;
    }

    private static saveTokens(): void {
        writeFileSync(TokenManager.tokensFilePath, JSON.stringify(TokenManager.tokens, null, 2), "utf-8");
    }
}

export namespace TokenManager {
    export type TokenType = keyof TokensFile;
}

/**
 * Stores both `<rut, token>` and `<token, rut>`
 */
type TokensFile = {
    user: Record<string, string>;
    admin: Record<string, string>;
};
