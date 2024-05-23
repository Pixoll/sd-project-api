export declare class Util extends null {
    static subtractSets<T>(lhs: Set<T>, rhs: Set<T>): Set<T>;
    static intersectSets<T>(set1: Set<T>, set2: Set<T>): Set<T>;
    static omit<T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K>;
    static pick<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K>;
    static replaceKeys<T extends object, KVs extends {
        [K in keyof T]?: string;
    }>(object: T, keys: KVs): Util.ReplaceKeys<T, KVs>;
    static hasOneOfKeys<T extends object>(object: T, keys: Array<keyof T>): boolean;
}
export declare namespace Util {
    type RecursiveReadonly<T> = T extends object ? {
        readonly [P in keyof T]: RecursiveReadonly<T[P]>;
    } : T extends Array<infer U> ? ReadonlyArray<RecursiveReadonly<U>> : T;
    type ReplaceKeys<T extends object, KVs extends {
        [K in keyof T]?: string;
    }> = Omit<T, keyof KVs> & {
        [K in keyof KVs as KVs[K] extends undefined ? K : NonNullable<KVs[K]>]: K extends keyof T ? T[K] : never;
    };
}
