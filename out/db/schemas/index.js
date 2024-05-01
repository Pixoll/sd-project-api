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
const util_1 = require("../../util");
exports.User = __importStar(require("./User"));
function validateStructure(object, model) {
    const schemaName = model.collection.name;
    const structure = model.schema.obj;
    const { all, optional } = Object.entries(structure).reduce((result, [k, v]) => {
        const key = v && typeof v === "object" && "alias" in v && typeof v.alias === "string" ? v.alias : k;
        if (!v || typeof v !== "object" || !("type" in v) || !v.required) {
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
    const missingKeys = (0, util_1.subtractSets)(all, givenKeys);
    if (missingKeys.size > 0) {
        return `Missing the following properties from the ${schemaName} schema: ${[...missingKeys].join(", ")}.`;
    }
    for (const [key, value] of Object.entries(temp)) {
        const valueStructure = key in structure
            ? structure[key]
            : Object.entries(structure).filter(([, v]) => v && typeof v === "object" && "alias" in v && v.alias === key)[0][1];
        const required = typeof valueStructure === "object" && "required" in valueStructure && valueStructure.required;
        if (required && (typeof value === "undefined" || value === null)) {
            return `'${key}' is required in the ${schemaName} schema.`;
        }
        const expectedType = typeof valueStructure === "object" && "type" in valueStructure
            ? valueStructure.type
            : valueStructure;
        let matchesExpected = true;
        switch (expectedType) {
            case String:
                if (typeof value !== "string")
                    matchesExpected = false;
                break;
            case Number:
                if (typeof value !== "number" || isNaN(value))
                    matchesExpected = false;
                break;
            case Date:
                if (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value)))) {
                    matchesExpected = false;
                }
                break;
            case Boolean:
                if (typeof value !== "boolean")
                    matchesExpected = false;
                break;
            case Array:
                if (!Array.isArray(value))
                    matchesExpected = false;
                break;
            default:
                throw new RangeError(`"${expectedType.name}" type not handled.`);
        }
        if (!matchesExpected) {
            return `'${key}' is of type ${expectedType.name} in the ${schemaName} schema.`;
        }
    }
    return true;
}
exports.validateStructure = validateStructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvc2NoZW1hcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHFDQUF5RDtBQUV6RCwrQ0FBK0I7QUFFL0IsU0FBZ0IsaUJBQWlCLENBQUMsTUFBYyxFQUFFLEtBQWU7SUFDN0QsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7SUFDekMsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDbkMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQzFFLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEcsSUFBSSxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMvRCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDL0IsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQyxFQUFF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