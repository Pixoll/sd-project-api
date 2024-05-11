import { Error, HydratedDocument, Model } from "mongoose";
import { ReplaceKeys, intersectSets, subtractSets } from "../../util";

export * as Admin from "./Admin";
export * as Shipment from "./Shipment";
export * as User from "./User";

type StructureValidationOptions<JSON> = {
    partial?: boolean;
    exclude?: Array<keyof JSON & string>;
};

type ValidationResult = ValidationSuccess | ValidationError;

type ValidationSuccess = {
    ok: true;
};

type ValidationError = {
    ok: false;
    message: string;
};

export async function validateStructure<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    A, B, C, D, F, J extends A extends ReplaceKeys<infer JSON, infer _1> ? JSON : A
>(
    object: object,
    Model: Model<A, B, C, D, HydratedDocument<A, D & C, B>, F>,
    options: StructureValidationOptions<J> = {
        partial: false,
        exclude: [],
    }
): Promise<ValidationResult> {
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
        return {
            ok: false,
            message: `The following properties are not part of the ${schemaName} schema: ${[...extraKeys].join(", ")}.`,
        };
    }

    if (!partial) {
        const missingKeys = subtractSets(subtractSets(all, givenKeys), new Set(exclude ?? []));
        if (missingKeys.size > 0) {
            return {
                ok: false,
                message: `Missing the following properties from the ${schemaName} schema: ${[...missingKeys].join(", ")}.`,
            };
        }
    }

    const validationError = await new Model(object).validate(partial ? [...givenKeys] : undefined)
        .then(() => null)
        .catch(e => e as Error.ValidationError);
    if (!validationError) return { ok: true };

    const error = Object.entries(validationError.errors)
        .find(([path]) => !exclude?.includes(path.toString() as keyof J & string));
    if (!error) return { ok: true };

    const [fullPath, firstError] = error;
    const errorLocation = structure[firstError.path as keyof typeof structure];
    const key = typeof errorLocation === "object" && "alias" in errorLocation ? `${errorLocation.alias}` : firstError.path;
    const kind = firstError.kind.toLowerCase() === "embedded" ? "object" : firstError.kind.toLowerCase();
    const parsedPath = fullPath.toString().includes(".")
        ? fullPath.toString().split(".").slice(0, -1).join(".") + "." + key
        : key;

    return {
        ok: false,
        message: firstError instanceof Error.CastError
            ? `'${parsedPath}' is of type ${kind} in the ${schemaName} schema.`
            : kind === "required"
                ? `'${parsedPath}' is  is required in the ${schemaName} schema.`
                : firstError.message,
    };
}
