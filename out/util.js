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
        // @ts-expect-error: always matches property type
        finalObject[key] = value;
    }
    return finalObject;
}
exports.omit = omit;
function replaceKey(object, key1, key2) {
    // @ts-expect-error: matches return type
    return {
        ...omit(object, [key1]),
        [key2]: object[key1],
    };
}
exports.replaceKey = replaceKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLFNBQWdCLFlBQVksQ0FBSSxHQUFXLEVBQUUsR0FBVztJQUNwRCxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFGRCxvQ0FFQztBQUVELFNBQWdCLGFBQWEsQ0FBSSxJQUFZLEVBQUUsSUFBWTtJQUN2RCxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRkQsc0NBRUM7QUFFRCxTQUFnQixJQUFJLENBQXNDLE1BQVMsRUFBRSxJQUFTO0lBQzFFLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUN2QixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBVSxJQUFJLENBQUMsQ0FBQztJQUN2QyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztTQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBWSxDQUFDLENBQUMsQ0FBQztJQUNqRCxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEMsaURBQWlEO1FBQ2pELFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQUNELE9BQU8sV0FBeUIsQ0FBQztBQUNyQyxDQUFDO0FBVkQsb0JBVUM7QUFFRCxTQUFnQixVQUFVLENBQ3RCLE1BQVMsRUFBRSxJQUFRLEVBQUUsSUFBUTtJQUU3Qix3Q0FBd0M7SUFDeEMsT0FBTztRQUNILEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQztLQUN2QixDQUFDO0FBQ04sQ0FBQztBQVJELGdDQVFDIn0=