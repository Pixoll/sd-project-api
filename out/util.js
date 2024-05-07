"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceKey = exports.omit = exports.intersectSets = exports.subtractSets = void 0;
function subtractSets(lhs, rhs) {
    return new Set([...lhs].filter(e => !rhs.has(e)));
}
exports.subtractSets = subtractSets;
function intersectSets(set1, set2) {
    return new Set([...set1].filter(e => set2.has(e)));
}
exports.intersectSets = intersectSets;
function omit(object, keys) {
    const finalObject = {};
    const keysSet = new Set(keys);
    const validEntires = Object.entries(object)
        .filter(([k]) => !keysSet.has(k));
    for (const [key, value] of validEntires) {
        finalObject[key] = value;
    }
    return finalObject;
}
exports.omit = omit;
function replaceKey(object, key1, key2) {
    return {
        ...omit(object, [key1]),
        [key2]: object[key1],
    };
}
exports.replaceKey = replaceKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLFNBQWdCLFlBQVksQ0FBSSxHQUFXLEVBQUUsR0FBVztJQUNwRCxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFGRCxvQ0FFQztBQUVELFNBQWdCLGFBQWEsQ0FBSSxJQUFZLEVBQUUsSUFBWTtJQUN2RCxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRkQsc0NBRUM7QUFFRCxTQUFnQixJQUFJLENBQXNDLE1BQVMsRUFBRSxJQUFTO0lBQzFFLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUN2QixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBVSxJQUFJLENBQUMsQ0FBQztJQUN2QyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztTQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBWSxDQUFDLENBQUMsQ0FBQztJQUNqRCxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksWUFBWSxFQUFFLENBQUM7UUFFdEMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBQ0QsT0FBTyxXQUF5QixDQUFDO0FBQ3JDLENBQUM7QUFWRCxvQkFVQztBQUVELFNBQWdCLFVBQVUsQ0FDdEIsTUFBUyxFQUFFLElBQVEsRUFBRSxJQUFRO0lBRzdCLE9BQU87UUFDSCxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDdkIsQ0FBQztBQUNOLENBQUM7QUFSRCxnQ0FRQyJ9