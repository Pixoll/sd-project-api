import mongoose from "mongoose";
import { DocumentFromModel, SchemaTypeOptions, Timestamps } from "./base";
import { Address } from "./address";
import { Package } from "./package";
import { User } from "./user";
import { Util } from "../util";
import { FeesEndpoint } from "../endpoints/fees";

export class Shipment extends null {
    public static readonly packageStatuses = [
        "pending",
        "pre-transit",
        "in_transit",
        "out_for_delivery",
        "delivered",
    ] as const;

    private static readonly shippingTypes = FeesEndpoint.fees.shipping.map(p => p.id);
    private static readonly shippingTypesList = Shipment.shippingTypes
        .map(t => `\`${t}\``)
        .join(", ")
        .replace(/, ([^,]+)$/, " or $1");
    private static readonly packageStatusesList = Shipment.packageStatuses
        .map(s => `\`${s}\``)
        .join(", ")
        .replace(/, ([^,]+)$/, " or $1");

    public static readonly Model = mongoose.model("shipment", new mongoose.Schema<Util.ReplaceKeys<Shipment.JSON, {
        id: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>>({
        _id: {
            type: String,
            default: (): string => new mongoose.Types.ObjectId().toHexString(),
            alias: "id",
            description: "The shipment id. Used for tracking.",
        },
        rut_sender: {
            type: String,
            required: true,
            cast: false,
            validate: {
                async validator(this: { rut_recipient: string }, rut: string): Promise<boolean> {
                    if (!User.isValidRut(rut)) throw new Error("Invalid sender RUT.");
                    if (rut === this.rut_recipient) throw new Error("Sender's RUT can't be the same as the recipient's.");
                    const user = await User.Model.findOne({ _id: rut });
                    if (!user) throw new Error(`User with RUT ${rut} does not exist.`);
                    return true;
                },
            },
            description: "RUT of the sender. Must be of an existing {schema:User}.",
        },
        rut_recipient: {
            type: String,
            required: true,
            cast: false,
            validate: {
                async validator(this: { rut_sender: string }, rut: string): Promise<boolean> {
                    if (!User.isValidRut(rut)) throw new Error("Invalid recipient RUT.");
                    if (rut === this.rut_sender) throw new Error("Recipient's RUT can't be the same as the sender's.");
                    const user = await User.Model.findOne({ _id: rut });
                    if (!user) throw new Error(`User with RUT ${rut} does not exist.`);
                    return true;
                },
            },
            description: "RUT of the recipient. Must be of an existing {schema:User}.",
        },
        source_address: {
            type: Address.Schema,
            required: true,
            cast: false,
            description: "Address where the packages are being shipped from.",
        },
        destination_address: {
            type: Address.Schema,
            required: true,
            cast: false,
            description: "Address where the packages are being shipped to.",
        },
        dispatch_timestamp: {
            type: Number,
            required: false,
            cast: false,
            default: null,
            description: "When the shipment was picked up from the source address.",
        },
        delivery_timestamp: {
            type: Number,
            required: false,
            cast: false,
            default: null,
            description: "When the shipment arrived to the destination address.",
        },
        status: {
            type: String,
            enum: Shipment.packageStatuses,
            required: true,
            cast: false,
            description: `Status of the package. One of: ${Shipment.packageStatusesList}.`,
        },
        shipping_type: {
            type: String,
            enum: Shipment.shippingTypes,
            required: true,
            cast: false,
            description: `Type of the shipment. One of: ${Shipment.shippingTypesList}.`,
        },
        pending_payment: {
            type: Boolean,
            required: true,
            cast: false,
            description: "Whether the shipment is going to be paid by the recipient or not.",
        },
        home_pickup: {
            type: Boolean,
            required: true,
            cast: false,
            description: "Whether the packages are being picked up at the sender's address.",
        },
        home_delivery: {
            type: Boolean,
            required: true,
            cast: false,
            description: "Whether the packages are being shipped to the recipient's address.",
        },
        packages: {
            type: [Package.Schema],
            required: true,
            cast: false,
            description: "All the packages being shipped.",
        },
    } satisfies SchemaTypeOptions, {
        versionKey: false,
        timestamps: true,
    }));

    public static toJSON(document: DocumentFromModel<typeof Shipment.Model>): Shipment.JSON {
        return Util.replaceKeys(document.toJSON(), {
            _id: "id",
            createdAt: "created_timestamp",
            updatedAt: "updated_timestamp",
        } as const);
    }
}

export namespace Shipment {
    export type JSON = {
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
