export type RecursiveReadonly<T> = T extends object ? { readonly [P in keyof T]: RecursiveReadonly<T[P]> }
    : T extends Array<infer U> ? ReadonlyArray<RecursiveReadonly<U>>
    : T;

export type ReplaceKeys<T extends object, KVs extends { [K in keyof T]?: string }> = Omit<T, keyof KVs> & {
    [K in keyof KVs as KVs[K] extends undefined ? K : NonNullable<KVs[K]>]: K extends keyof T ? T[K] : never;
};

export function subtractSets<T>(lhs: Set<T>, rhs: Set<T>): Set<T> {
    return new Set([...lhs].filter(e => !rhs.has(e)));
}

export function intersectSets<T>(set1: Set<T>, set2: Set<T>): Set<T> {
    return new Set([...set1].filter(e => set2.has(e)));
}

export function omit<T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K> {
    const keysSet = new Set<keyof T>(keys);
    return Object.fromEntries(Object.entries(object)
        .filter(([k]) => !keysSet.has(k as keyof T))) as Omit<T, K>;
}

export function replaceKeys<T extends object, KVs extends { [K in keyof T]?: string }>(
    object: T, keys: KVs
): ReplaceKeys<T, KVs> {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const finalObject = {} as T;
    for (const [k, v] of Object.entries(object)) {
        const key = k in keys ? keys[k] : k;
        finalObject[key as keyof T] = v;
    }
    return finalObject as ReplaceKeys<T, KVs>;
}

export function hasKeys<T extends object>(object: T, keys: Array<keyof T>): boolean {
    for (const key of keys)
        if (key in object)
            return true;
    return false;
}
