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
async function validateStructure(object, Model, partial = false) {
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
        const missingKeys = (0, util_1.subtractSets)(all, givenKeys);
        if (missingKeys.size > 0) {
            return `Missing the following properties from the ${schemaName} schema: ${[...missingKeys].join(", ")}.`;
        }
    }
    const validationError = new Model(object).validateSync(partial ? [...givenKeys] : undefined);
    if (!validationError)
        return true;
    const [fullPath, firstError] = Object.entries(validationError.errors)[0];
    const errorLocation = structure[firstError.path];
    const key = typeof errorLocation === "object" && "alias" in errorLocation ? `${errorLocation.alias}` : firstError.path;
    const kind = firstError.kind.toLowerCase() === "embedded" ? "object" : firstError.kind.toLowerCase();
    const parsedPath = fullPath.toString().split(".").slice(0, -1).join(".") + "." + key;
    return firstError instanceof mongoose_1.Error.CastError
        ? `'${parsedPath}' is of type ${kind} in the ${schemaName} schema.`
        : kind === "required"
            ? `'${parsedPath}' is  is required in the ${schemaName} schema.`
            : firstError.message;
}
exports.validateStructure = validateStructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvc2NoZW1hcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUEwRDtBQUMxRCxxQ0FBeUQ7QUFFekQsK0NBQStCO0FBRXhCLEtBQUssVUFBVSxpQkFBaUIsQ0FDbkMsTUFBYyxFQUNkLEtBQTBELEVBQzFELE9BQU8sR0FBRyxLQUFLO0lBRWYsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7SUFDekMsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDbkMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQzFFLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEcsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDL0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLE9BQU8sTUFBTSxD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