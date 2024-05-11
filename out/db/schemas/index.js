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
exports.validateStructure = exports.User = exports.Shipment = exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const util_1 = require("../../util");
exports.Admin = __importStar(require("./Admin"));
exports.Shipment = __importStar(require("./Shipment"));
exports.User = __importStar(require("./User"));
async function validateStructure(object, Model, options = {
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
    const extraKeys = (0, util_1.subtractSets)(givenKeys, (0, util_1.intersectSets)(givenKeys, all));
    if (extraKeys.size > 0) {
        return {
            ok: false,
            message: `The following properties are not part of the ${schemaName} schema: ${[...extraKeys].join(", ")}.`,
        };
    }
    if (!partial) {
        const missingKeys = (0, util_1.subtractSets)((0, util_1.subtractSets)(all, givenKeys), new Set(exclude ?? []));
        if (missingKeys.size > 0) {
            return {
                ok: false,
                message: `Missing the following properties from the ${schemaName} schema: ${[...missingKeys].join(", ")}.`,
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
    const key = typeof errorLocation === "object" && "alias" in errorLocation ? `${errorLocation.alias}` : firstError.path;
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
exports.validateStructure = validateStructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvc2NoZW1hcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUEwRDtBQUMxRCxxQ0FBc0U7QUFFdEUsaURBQWlDO0FBQ2pDLHVEQUF1QztBQUN2QywrQ0FBK0I7QUFrQnhCLEtBQUssVUFBVSxpQkFBaUIsQ0FJbkMsTUFBYyxFQUNkLEtBQTBELEVBQzFELFVBQXlDO0lBQ3JDLE9BQU8sRUFBRSxLQUFLO0lBQ2QsT0FBTyxFQUFFLEVBQUU7Q0FDZDtJQUVELE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBQ3JDLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0lBQ3pDLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ25DLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUMxRSxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BHLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQy9ELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FB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