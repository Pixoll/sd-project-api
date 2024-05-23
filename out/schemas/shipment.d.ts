/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import mongoose from "mongoose";
import { DocumentFromModel, Timestamps } from "./base";
import { Address } from "./address";
import { Package } from "./package";
import { Util } from "../util";
export declare class Shipment extends null {
    static readonly packageStatuses: readonly ["pending", "pre-transit", "in_transit", "out_for_delivery", "delivered"];
    private static readonly shippingTypes;
    private static readonly shippingTypesList;
    private static readonly packageStatusesList;
    static readonly Model: mongoose.Model<Util.ReplaceKeys<Shipment.JSON, {
        id: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>, {}, {}, {}, mongoose.Document<unknown, {}, Util.ReplaceKeys<Shipment.JSON, {
        id: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>> & Omit<Shipment.JSON, "id" | "created_timestamp" | "updated_timestamp"> & {
        _id: string;
        createdAt: number;
        updatedAt: number;
    } & Required<{
        _id: string;
    }>, mongoose.Schema<Util.ReplaceKeys<Shipment.JSON, {
        id: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>, mongoose.Model<Util.ReplaceKeys<Shipment.JSON, {
        id: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>, any, any, any, mongoose.Document<unknown, any, Util.ReplaceKeys<Shipment.JSON, {
        id: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>> & Omit<Shipment.JSON, "id" | "created_timestamp" | "updated_timestamp"> & {
        _id: string;
        createdAt: number;
        updatedAt: number;
    } & Required<{
        _id: string;
    }>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Util.ReplaceKeys<Shipment.JSON, {
        id: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>, mongoose.Document<unknown, {}, mongoose.FlatRecord<Util.ReplaceKeys<Shipment.JSON, {
        id: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>>> & mongoose.FlatRecord<Util.ReplaceKeys<Shipment.JSON, {
        id: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>> & Required<{
        _id: string;
    }>>>;
    static toJSON(document: DocumentFromModel<typeof Shipment.Model>): Shipment.JSON;
}
export declare namespace Shipment {
    type JSON = {
        id: string;
        rut_sender: string;
        rut_recipient: string;
        source_address: Address.JSON;
        destination_address: Address.JSON;
        dispatch_timestamp: number | null;
        delivery_timestamp: number | null;
        status: PackageStatus;
        shipping_type: string;
        pending_payment: boolean;
        home_pickup: boolean;
        home_delivery: boolean;
        packages: Package.JSON[];
    } & Timestamps;
}
type PackageStatus = typeof Shipment.packageStatuses[number];
export {};
