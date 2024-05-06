import { Error, HydratedDocument, Model } from "mongoose";
import { intersectSets, subtractSets } from "../../util";

export * as User from "./User";

type StructureValidationOptions = {
    partial?: boolean;
    exclude?: string[];
};

export async function validateStructure<A, B, C, D, F>(
    object: object,
    Model: Model<A, B, C, D, HydratedDocument<A, D & C, B>, F>,
    { partial, exclude }: StructureValidationOptions = {
        partial: false,
        exclude: [],
    }
): Promise<true | string> {
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

    if (!partial) {
        const missingKeys = subtractSets(subtractSets(all, givenKeys), new Set(exclude ?? []));
        if (missingKeys.size > 0) {
            return `Missing the following properties from the ${schemaName} schema: ${[...missingKeys].join(", ")}.`;
        }
    }

    const validationError = await new Model(object).validate(partial ? [...givenKeys] : undefined)
        .then(() => null)
        .catch(e => e as Error.ValidationError);
    if (!validationError) return true;

    const error = Object.entries(validationError.errors)
        .find(([path]) => !exclude?.includes(path.toString()));
    if (!error) return true;

    const [fullPath, firstError] = error;
    const errorLocation = structure[firstError.path as keyof typeof structure];
    const key = typeof errorLocation === "object" && "alias" in errorLocation ? `${errorLocation.alias}` : firstError.path;
    const kind = firstError.kind.toLowerCase() === "embedded" ? "object" : firstError.kind.toLowerCase();
    const parsedPath = fullPath.toString().includes(".")
        ? fullPath.toString().split(".").slice(0, -1).join(".") + "." + key
        : key;

    return firstError instanceof Error.CastError
        ? `'${parsedPath}' is of type ${kind} in the ${schemaName} schema.`
        : kind === "required"
            ? `'${parsedPath}' is  is required in the ${schemaName} schema.`
            : firstError.message;
}
