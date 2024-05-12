type TokensFile = {
    user: Record<string, string>;
    admin: Record<string, string>;
};
export type TokenType = keyof TokensFile;
export declare function loadTokens(): void;
export declare function generateToken(type: TokenType, rut: string): string;
export declare function getRutFromToken(type: TokenType, token: string): string | null;
export declare function revokeToken(type: TokenType, rut: string): boolean;
export {};
