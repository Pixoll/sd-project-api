export type RecursiveReadonly<T> = T extends object ? {
    readonly [P in keyof T]: RecursiveReadonly<T[P]>;
} : T extends Array<infer U> ? ReadonlyArray<RecursiveReadonly<U>> : T;
export type ReplaceKeys<T extends object, KVs extends {
    [K in keyof T]?: string;
}> = Omit<T, keyof KVs> & {
    [K in keyof KVs as KVs[K] extends undefined ? K : NonNullable<KVs[K]>]: K extends keyof T ? T[K] : never;
};
export declare function subtractSets<T>(lhs: Set<T>, rhs: Set<T>): Set<T>;
export declare function intersectSets<T>(set1: Set<T>, set2: Set<T>): Set<T>;
export declare function omit<T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K>;
export declare function replaceKeys<T extends object, KVs extends {
    [K in keyof T]?: string;
}>(object: T, keys: KVs): ReplaceKeys<T, KVs>;
export declare function hasOneOfKeys<T extends object>(object: T, keys: Array<keyof T>): boolean;
