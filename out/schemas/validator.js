"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructureValidator = void 0;
const mongoose_1 = require("mongoose");
const util_1 = require("../util");
class StructureValidator extends null {
    static async run(object, Model, options = {
        partial: false,
        exclude: [],
    }) {
        const { partial, exclude } = options;
        const schemaName = Model.collection.name;
        const structure = Model.schema.obj;
        const { all, optional } = Object.entries(structure).reduce((result, [k, v]) => {
            const key = v && typeof v === "object" && "alias" in v && typeof v.alias === "string" ? v.alias : k;
            if (v && typeof v === "object" && "required" in v && !v.required) {
                result.optional.add(key.toString());
            }
            result.all.add(key.toString());
            return result;
        }, {
            all: new Set(),
            optional: new Set(),
        });
        const temp = { ...object };
        for (const key of optional) {
            if (key in temp)
                continue;
            temp[key] = undefined;
        }
        const givenKeys = new Set(Object.keys(temp));
        const extraKeys = util_1.Util.subtractSets(givenKeys, util_1.Util.intersectSets(givenKeys, all));
        if (extraKeys.size > 0) {
            return {
                ok: false,
                message: `The following properties are not part of the ${schemaName} schema: ${[...extraKeys].join(", ")}.`,
            };
        }
        if (!partial) {
            const missingKeys = util_1.Util.subtractSets(util_1.Util.subtractSets(all, givenKeys), new Set(exclude ?? []));
            if (missingKeys.size > 0) {
                return {
                    ok: false,
                    message: `Missing the following properties from the ${schemaName} schema: `
                        + `${[...missingKeys].join(", ")}.`,
                };
            }
        }
        const validationError = await new Model(object).validate(partial ? [...givenKeys] : undefined)
            .then(() => null)
            .catch(e => e);
        if (!validationError)
            return { ok: true };
        const error = Object.entries(validationError.errors)
            .find(([path]) => !exclude?.includes(path.toString()));
        if (!error)
            return { ok: true };
        const [fullPath, firstError] = error;
        const errorLocation = structure[firstError.path];
        const key = typeof errorLocation === "object" && "alias" in errorLocation
            ? `${errorLocation.alias}`
            : firstError.path;
        const kind = firstError.kind.toLowerCase() === "embedded" ? "object" : firstError.kind.toLowerCase();
        const parsedPath = fullPath.toString().includes(".")
            ? fullPath.toString().split(".").slice(0, -1).join(".") + "." + key
            : key;
        return {
            ok: false,
            message: firstError instanceof mongoose_1.Error.CastError
                ? `'${parsedPath}' is of type ${kind} in the ${schemaName} schema.`
                : kind === "required"
                    ? `'${parsedPath}' is  is required in the ${schemaName} schema.`
                    : firstError.message,
        };
    }
}
exports.StructureValidator = StructureValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjaGVtYXMvdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUEwRDtBQUMxRCxrQ0FBK0I7QUFFL0IsTUFBYSxrQkFBbUIsU0FBUSxJQUFJO0lBQ2pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUluQixNQUFjLEVBQ2QsS0FBMEQsRUFDMUQsVUFBeUM7UUFDckMsT0FBTyxFQUFFLEtBQUs7UUFDZCxPQUFPLEVBQUUsRUFBRTtLQUNkO1FBRUQsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDckMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDekMsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDbkMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQzFFLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEcsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQy9ELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lB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