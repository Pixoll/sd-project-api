"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOneOfKeys = exports.replaceKeys = exports.omit = exports.intersectSets = exports.subtractSets = void 0;
function subtractSets(lhs, rhs) {
    return new Set([...lhs].filter(e => !rhs.has(e)));
}
exports.subtractSets = subtractSets;
function intersectSets(set1, set2) {
    return new Set([...set1].filter(e => set2.has(e)));
}
exports.intersectSets = intersectSets;
function omit(object, keys) {
    const keysSet = new Set(keys);
    return Object.fromEntries(Object.entries(object)
        .filter(([k]) => !keysSet.has(k)));
}
exports.omit = omit;
function replaceKeys(object, keys) {
    const finalObject = {};
    for (const [k, v] of Object.entries(object)) {
        const key = k in keys ? keys[k] : k;
        finalObject[key] = v;
    }
    return finalObject;
}
exports.replaceKeys = replaceKeys;
function hasOneOfKeys(object, keys) {
    for (const key of keys)
        if (key in object)
            return true;
    return false;
}
exports.hasOneOfKeys = hasOneOfKeys;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVFBLFNBQWdCLFlBQVksQ0FBSSxHQUFXLEVBQUUsR0FBVztJQUNwRCxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFGRCxvQ0FFQztBQUVELFNBQWdCLGFBQWEsQ0FBSSxJQUFZLEVBQUUsSUFBWTtJQUN2RCxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRkQsc0NBRUM7QUFFRCxTQUFnQixJQUFJLENBQXNDLE1BQVMsRUFBRSxJQUFTO0lBQzFFLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFVLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztTQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBWSxDQUFDLENBQUMsQ0FBZSxDQUFDO0FBQ3BFLENBQUM7QUFKRCxvQkFJQztBQUVELFNBQWdCLFdBQVcsQ0FDdkIsTUFBUyxFQUFFLElBQVM7SUFHcEIsTUFBTSxXQUFXLEdBQUcsRUFBTyxDQUFDO0lBQzVCLEtBQUssTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDMUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsV0FBVyxDQUFDLEdBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0QsT0FBTyxXQUFrQyxDQUFDO0FBQzlDLENBQUM7QUFWRCxrQ0FVQztBQUVELFNBQWdCLFlBQVksQ0FBbUIsTUFBUyxFQUFFLElBQW9CO0lBQzFFLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSTtRQUNsQixJQUFJLEdBQUcsSUFBSSxNQUFNO1lBQ2IsT0FBTyxJQUFJLENBQUM7SUFDcEIsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUxELG9DQUtDIn0=