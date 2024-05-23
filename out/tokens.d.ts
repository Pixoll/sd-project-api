export declare class TokenManager extends null {
    private static readonly tokensFilePath;
    private static readonly tokens;
    static loadTokens(): void;
    static generateToken(type: TokenManager.TokenType, rut: string): string;
    static getRutFromToken(type: TokenManager.TokenType, token: string): string | null;
    static revokeToken(type: TokenManager.TokenType, rut: string): boolean;
    private static saveTokens;
}
export declare namespace TokenManager {
    type TokenType = keyof TokensFile;
}
type TokensFile = {
    user: Record<string, string>;
    admin: Record<string, string>;
};
export {};
