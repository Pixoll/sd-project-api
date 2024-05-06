"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStructure = exports.User = void 0;
const mongoose_1 = require("mongoose");
const util_1 = require("../../util");
exports.User = __importStar(require("./User"));
function validateStructure(object, Model, { partial, exclude } = {
    partial: false,
    exclude: [],
}) {
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
    const extraKeys = (0, util_1.subtractSets)(givenKeys, (0, util_1.intersectSets)(givenKeys, all));
    if (extraKeys.size > 0) {
        return `The following properties are not part of the ${schemaName} schema: ${[...extraKeys].join(", ")}.`;
    }
    if (!partial) {
        const missingKeys = (0, util_1.subtractSets)((0, util_1.subtractSets)(all, givenKeys), new Set(exclude ?? []));
        if (missingKeys.size > 0) {
            return `Missing the following properties from the ${schemaName} schema: ${[...missingKeys].join(", ")}.`;
        }
    }
    const validationError = new Model(object).validateSync(partial ? [...givenKeys] : undefined);
    if (!validationError)
        return true;
    const error = Object.entries(validationError.errors)
        .find(([path]) => !exclude?.includes(path.toString()));
    if (!error)
        return true;
    const [fullPath, firstError] = error;
    const errorLocation = structure[firstError.path];
    const key = typeof errorLocation === "object" && "alias" in errorLocation ? `${errorLocation.alias}` : firstError.path;
    const kind = firstError.kind.toLowerCase() === "embedded" ? "object" : firstError.kind.toLowerCase();
    const parsedPath = fullPath.toString().includes(".")
        ? fullPath.toString().split(".").slice(0, -1).join(".") + "." + key
        : key;
    return firstError instanceof mongoose_1.Error.CastError
        ? `'${parsedPath}' is of type ${kind} in the ${schemaName} schema.`
        : kind === "required"
            ? `'${parsedPath}' is  is required in the ${schemaName} schema.`
            : firstError.message;
}
exports.validateStructure = validateStructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvc2NoZW1hcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUEwRDtBQUMxRCxxQ0FBeUQ7QUFFekQsK0NBQStCO0FBTy9CLFNBQWdCLGlCQUFpQixDQUM3QixNQUFjLEVBQ2QsS0FBMEQsRUFDMUQsRUFBRSxPQUFPLEVBQUUsT0FBTyxLQUFpQztJQUMvQyxPQUFPLEVBQUUsS0FBSztJQUNkLE9BQU8sRUFBRSxFQUFFO0NBQ2Q7SUFFRCxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztJQUN6QyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNuQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDMUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMvRCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFH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