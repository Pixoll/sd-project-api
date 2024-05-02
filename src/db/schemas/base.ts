/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

// @ts-expect-error: simply extending Schema class
export interface Model<
    TRawDocType,
    TQueryHelpers = NonNullable<unknown>,
    TInstanceMethods = NonNullable<unknown>,
    TVirtuals = NonNullable<unknown>,
    THydratedDocumentType = mongoose.HydratedDocument<TRawDocType, TVirtuals & TInstanceMethods, TQueryHelpers>,
    TSchema = any
> extends mongoose.Model<TRawDocType, TQueryHelpers, TInstanceMethods, TVirtuals, THydratedDocumentType, TSchema> {
    schema: Schema<TRawDocType>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type JSONFromModel<M> = M extends Model<infer JSON, infer _2, infer _3, infer _4, infer _5, infer _6> ? JSON : never;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DocumentFromModel<M> = M extends Model<infer _1, infer _2, infer _3, infer _4, infer Doc, infer _6>
    ? Doc
    : never;

export class Schema<
    EnforcedDocType = any,
    TModelType = Model<EnforcedDocType, any, any, any>,
    TInstanceMethods = NonNullable<unknown>,
    TQueryHelpers = NonNullable<unknown>,
    TVirtuals = NonNullable<unknown>,
    TStaticMethods = NonNullable<unknown>,
    TSchemaOptions = mongoose.DefaultSchemaOptions,
    DocType extends mongoose.ApplySchemaOptions<
        mongoose.ObtainDocumentType<DocType, EnforcedDocType, mongoose.ResolveSchemaOptions<TSchemaOptions>>,
        mongoose.ResolveSchemaOptions<TSchemaOptions>
    > = mongoose.ApplySchemaOptions<
        mongoose.ObtainDocumentType<any, EnforcedDocType, mongoose.ResolveSchemaOptions<TSchemaOptions>>,
        mongoose.ResolveSchemaOptions<TSchemaOptions>
    >,
    THydratedDocumentType = mongoose.HydratedDocument<mongoose.FlatRecord<DocType>, TVirtuals & TInstanceMethods>
> extends mongoose.Schema<
    EnforcedDocType,
    TModelType,
    TInstanceMethods,
    TQueryHelpers,
    TVirtuals,
    TStaticMethods,
    TSchemaOptions,
    DocType,
    THydratedDocumentType
> {
    // @ts-expect-error: SchemaObject narrows mongoose.SchemaDefinition
    public readonly declare obj: Required<SchemaObject<mongoose.SchemaDefinitionType<EnforcedDocType>, EnforcedDocType>>;

    public constructor(
        definition: SchemaObject<mongoose.SchemaDefinitionType<EnforcedDocType>, EnforcedDocType> | DocType,
        options?: mongoose.SchemaOptions<
            mongoose.FlatRecord<DocType>,
            TInstanceMethods,
            TQueryHelpers,
            TStaticMethods,
            TVirtuals,
            THydratedDocumentType
        > | mongoose.ResolveSchemaOptions<TSchemaOptions>
    ) {
        // @ts-expect-error: SchemaObject narrows mongoose.SchemaDefinition
        super(definition, options);

        for (const [key, { description }] of Object.entries(definition as Record<string, { description: string }>)) {
            const def = this.obj[key];
            if (def) def.description = description;
        }
    }
}

export function model<TSchema extends Schema>(
    name: string,
    schema?: TSchema,
    collection?: string,
    options?: mongoose.CompileModelOptions
): Model<
    mongoose.InferSchemaType<TSchema>,
    mongoose.ObtainSchemaGeneric<TSchema, "TQueryHelpers">,
    mongoose.ObtainSchemaGeneric<TSchema, "TInstanceMethods">,
    mongoose.ObtainSchemaGeneric<TSchema, "TVirtuals">,
    mongoose.HydratedDocument<
        mongoose.InferSchemaType<TSchema>,
        mongoose.ObtainSchemaGeneric<TSchema, "TVirtuals"> & mongoose.ObtainSchemaGeneric<TSchema, "TInstanceMethods">,
        mongoose.ObtainSchemaGeneric<TSchema, "TQueryHelpers">
    >,
    TSchema
> & mongoose.ObtainSchemaGeneric<TSchema, "TStaticMethods"> {
    // @ts-expect-error: just extending Schema class
    return mongoose.model(name, schema, collection, options);
}

declare class SchemaTypeOptions<T, EnforcedDocType> extends mongoose.SchemaTypeOptions<T, EnforcedDocType> {
    public type: NonNullable<mongoose.SchemaTypeOptions<T, EnforcedDocType>["type"]>;
    public required: NonNullable<mongoose.SchemaTypeOptions<T, EnforcedDocType>["required"]>;
    /**
     * Description of this field.
     */
    public description: string;
}

type SchemaObject<T, EnforcedDocType> = {
    [path in keyof T]: SchemaTypeOptions<T[path], EnforcedDocType>;
} & {
    [k: string]: mongoose.SchemaTypeOptions<any> | undefined;
};
