import { randomBytes } from "crypto";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { hasOneOfKeys } from "./util";

const tokensFilePath = path.join(__dirname, "../data/tokens.json");

/**
 * Stores both `<rut, token>` and `<token, rut>`
 */
type TokensFile = {
    user: Record<string, string>;
    admin: Record<string, string>;
};

const tokens: TokensFile = {
    user: {},
    admin: {},
};

export type TokenType = keyof TokensFile;

export function loadTokens(): void {
    try {
        const saved = JSON.parse(readFileSync(tokensFilePath, "utf8")) as TokensFile;
        if (!hasOneOfKeys(saved, ["admin", "user"]) || typeof saved.admin !== "object" || typeof saved.user !== "object") {
            throw new TypeError("tokens.json has the wrong structure.");
        }

        Object.assign(tokens, saved);
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
            mkdirSync(path.parse(tokensFilePath).dir, { recursive: true });
            saveTokens();
            return;
        }

        throw error;
    }
}

export function generateToken(type: TokenType, rut: string): string {
    const destination = tokens[type];
    if (rut in destination) {
        revokeToken(type, rut);
    }

    let token: string;
    do {
        token = randomBytes(64).toString("base64");
    } while (token in destination);

    destination[token] = rut;
    destination[rut] = token;
    saveTokens();

    return token;
}

export function getRutFromToken(type: TokenType, token: string): string | null {
    return tokens[type][token] ?? null;
}

export function revokeToken(type: TokenType, rut: string): boolean {
    const source = tokens[type];
    const token = source[rut] ?? null;
    if (!token) return false;

    delete source[token];
    delete source[rut];
    saveTokens();

    return true;
}

function saveTokens(): void {
    writeFileSync(tokensFilePath, JSON.stringify(tokens, null, 2), "utf-8");
}
