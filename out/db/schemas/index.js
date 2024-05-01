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
function validateStructure(object, model, partial = false) {
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
    if (!partial) {
        const missingKeys = (0, util_1.subtractSets)(all, givenKeys);
        if (missingKeys.size > 0) {
            return `Missing the following properties from the ${schemaName} schema: ${[...missingKeys].join(", ")}.`;
        }
    }
    for (const [key, value] of Object.entries(temp)) {
        const valueStructure = key in structure
            ? structure[key]
            : Object.entries(structure).filter(([, v]) => v && typeof v === "object" && "alias" in v && v.alias === key)[0][1];
        if (!partial) {
            const required = typeof valueStructure === "object" && "required" in valueStructure && valueStructure.required;
            if (required && (typeof value === "undefined" || value === null)) {
                return `'${key}' is required in the ${schemaName} schema.`;
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvc2NoZW1hcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHFDQUF5RDtBQUV6RCwrQ0FBK0I7QUFFL0IsU0FBZ0IsaUJBQWlCLENBQUMsTUFBYyxFQUFFLEtBQWUsRUFBRSxPQUFPLEdBQUcsS0FBSztJQUM5RSxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztJQUN6QyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNuQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDMUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRyxJQUFJLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQy9ELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUMvQixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDLEVBQUU7UUFDQyxHQUFHLEVBQUUsSUFBSSxHQUFHLEVBQVU7UUFDdEIsUUFBUSxFQUFFLElBQUksR0FBRyxFQUFVO0tBQzlCLENBQUMsQ0FBQztJQUVILE1BQU0sSUFBSSxHQUE0QixFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUM7SUFDcEQsS0FBSyxNQUFNLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUN6QixJQUFJLEdBQUcsSUFBSSxJQUFJO1lBQUUsU0FBUztRQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0MsTUFBTSxTQUFTLEdBQUcsSUFBQSxtQkFBWSxFQUFDLFNBQVMsRUFBRSxJQUFBLG9CQUFhLEVBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDekUsSUFBSSxTQUFTLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3JCLE9BQU8sZ0RBQWdELFVBQVUsWUFBWSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDOUcsQ0FBQztJQUVELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNYLE1BQU0sV0FBVyxHQUFHLElBQUEsbUJBQVksRUFBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDakQsSUFBSSxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sNkNBQTZDLFVBQVUsWUFBWSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDN0csQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQzlDLE1BQU0sY0FBYyxHQUFHLEdBQUcsSUFBSSxTQUFTO1lBQ25DLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQ3pDLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FDaEUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVaLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNYLE1BQU0sUUFBUSxHQUFHLE9BQU8sY0FBYyxLQUFLLFFBQVEsSUFBSSxVQUFVLElBQUksY0FBYyxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUM7WUFDL0csSUFBSSxRQUFRLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQy9ELE9BQU8sSUFBSSxHQUFHLHdCQUF3QixVQUFVLFVBQVUsQ0FBQztZQUMvRCxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sWUFBWSxHQUFHLE9BQU8sY0FBYyxLQUFLLFFBQVEsSUFBSSxNQUFNLElBQUksY0FBYztZQUMvRSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUk7WUFDckIsQ0FBQyxDQUFDLGNBQWMsQ0FBQztRQUVyQixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDM0IsUUFBUSxZQUFZLEVBQUUsQ0FBQztZQUNuQixLQUFLLE1BQU07Z0JBQ1AsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRO29CQUFFLGVBQWUsR0FBRyxLQUFLLENBQUM7Z0JBQ3ZELE1BQU07WUFDVixLQUFLLE1BQU07Z0JBQ1AsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQztvQkFBRSxlQUFlLEdBQUcsS0FBSyxDQUFDO2dCQUN2RSxNQUFNO1lBQ1YsS0FBSyxJQUFJO2dCQUNMLElBQUksQ0FBQyxDQUFDLEtBQUssWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDdEYsZUFBZSxHQUFHLEtBQUssQ0FBQztnQkFDNUIsQ0FBQztnQkFDRCxNQUFNO1lBQ1YsS0FBSyxPQUFPO2dCQUNSLElBQUksT0FBTyxLQUFLLEtBQUssU0FBUztvQkFBRSxlQUFlLEdBQUcsS0FBSyxDQUFDO2dCQUN4RCxNQUFNO1lBQ1YsS0FBSyxLQUFLO2dCQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztvQkFBRSxlQUFlLEdBQUcsS0FBSyxDQUFDO2dCQUNuRCxNQUFNO1lBQ1Y7Z0JBQ0ksTUFBTSxJQUFJLFVBQVUsQ0FBQyxJQUFJLFlBQVksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUM7UUFDekUsQ0FBQztRQUVELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUNuQixPQUFPLElBQUksR0FBRyxnQkFBZ0IsWUFBWSxDQUFDLElBQUksV0FBVyxVQUFVLFVBQVUsQ0FBQztRQUNuRixDQUFDO0lBQ0wsQ0FBQztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFqRkQsOENBaUZDIn0=