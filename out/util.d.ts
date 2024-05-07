export type RecursiveReadonly<T> = T extends object ? {
    readonly [P in keyof T]: RecursiveReadonly<T[P]>;
} : T extends Array<infer U> ? ReadonlyArray<RecursiveReadonly<U>> : T;
export type ReplaceKey<T extends object, K1 extends keyof T, K2 extends string> = Omit<T, K1> & Record<K2, T[K1]>;
export declare function subtractSets<T>(lhs: Set<T>, rhs: Set<T>): Set<T>;
export declare function intersectSets<T>(set1: Set<T>, set2: Set<T>): Set<T>;
export declare function omit<T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K>;
export declare function replaceKey<T extends object, K1 extends keyof T, K2 extends string>(object: T, key1: K1, key2: K2): ReplaceKey<T, K1, K2>;
