interface ObjectConstructor {
    entries<T extends object>(o: T): Array<[keyof T, T[keyof T]]>;
}
