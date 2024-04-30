export function subtractSets<T>(lhs: Set<T>, rhs: Set<T>): Set<T> {
    return new Set([...lhs].filter(e => !rhs.has(e)));
}

export function intersectSets<T>(set1: Set<T>, set2: Set<T>): Set<T> {
    return new Set([...set1].filter(e => set2.has(e)));
}

export function omit<T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K> {
    const finalObject = {};
    const keysSet = new Set<keyof T>(keys);
    const validEntires = Object.entries(object)
        .filter(([k]) => !keysSet.has(k as keyof T));
    for (const [key, value] of validEntires) {
        // @ts-expect-error: always matches property type
        finalObject[key] = value;
    }
    return finalObject as Omit<T, K>;
}

export function replaceKey<T extends object, K1 extends keyof T, K2 extends string>(
    object: T, key1: K1, key2: K2
): Omit<T, K1> & Record<K2, T[K1]> {
    // @ts-expect-error: matches return type
    return {
        ...omit(object, [key1]),
        [key2]: object[key1],
    };
}
