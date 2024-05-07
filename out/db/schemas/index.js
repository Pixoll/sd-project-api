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
exports.validateStructure = exports.User = exports.Shipment = void 0;
const mongoose_1 = require("mongoose");
const util_1 = require("../../util");
exports.Shipment = __importStar(require("./Shipment"));
exports.User = __importStar(require("./User"));
async function validateStructure(object, Model, { partial, exclude } = {
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
    const validationError = await new Model(object).validate(partial ? [...givenKeys] : undefined)
        .then(() => null)
        .catch(e => e);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvc2NoZW1hcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUEwRDtBQUMxRCxxQ0FBeUQ7QUFFekQsdURBQXVDO0FBQ3ZDLCtDQUErQjtBQU94QixLQUFLLFVBQVUsaUJBQWlCLENBQ25DLE1BQWMsRUFDZCxLQUEwRCxFQUMxRCxFQUFFLE9BQU8sRUFBRSxPQUFPLEtBQWlDO0lBQy9DLE9BQU8sRUFBRSxLQUFLO0lBQ2QsT0FBTyxFQUFFLEVBQUU7Q0FDZDtJQUVELE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0lBQ3pDLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ25DLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUMxRSxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BHLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQy9ELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFDRCxNQUFNLENB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