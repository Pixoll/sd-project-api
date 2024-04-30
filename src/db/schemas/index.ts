import { AnyModel } from "./base";
import { intersectSets, subtractSets } from "../../util";

export * as User from "./User";

export function validateStructure(object: object, model: AnyModel): true | string {
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
        all: new Set<string>(),
        optional: new Set<string>(),
    });

    const temp: Record<string, unknown> = { ...object };
    for (const key of optional) {
        if (key in temp) continue;
        temp[key] = undefined;
    }

    const givenKeys = new Set(Object.keys(temp));
    const extraKeys = subtractSets(givenKeys, intersectSets(givenKeys, all));
    if (extraKeys.size > 0) {
        return `The following properties are not part of the ${schemaName} schema: ${[...extraKeys].join(", ")}.`;
    }

    const missingKeys = subtractSets(all, givenKeys);
    if (missingKeys.size > 0) {
        return `Missing the following properties from the ${schemaName} schema: ${[...missingKeys].join(", ")}.`;
    }

    for (const [key, value] of Object.entries(temp)) {
        const valueStructure = key in structure
            ? structure[key]
            : Object.entries(structure).filter(([, v]) =>
                v && typeof v === "object" && "alias" in v && v.alias === key
            )[0][1];

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
                if (typeof value !== "string") matchesExpected = false;
                break;
            case Number:
                if (typeof value !== "number") matchesExpected = false;
                break;
            case Date:
                if (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value)))) {
                    matchesExpected = false;
                }
                break;
            case Boolean:
                if (typeof value !== "boolean") matchesExpected = false;
                break;
            case Array:
                if (!Array.isArray(value)) matchesExpected = false;
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
