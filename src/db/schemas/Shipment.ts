import mongoose from "mongoose";
import { DocumentFromModel, SchemaTypeOptions } from "./base";
import * as Address from "./Address";
import * as Package from "./Package";
import * as User from "./User";
import { ReplaceKey, replaceKey } from "../../util";
import { fees } from "../../endpoints/fees";

export type Document = DocumentFromModel<typeof Model>;
export type JSON = {
    id: string;
    rut_sender: string;
    rut_recipient: string;
    source_address: Address.JSON;
    destination_address: Address.JSON;
    dispatch_timestamp: number;
    delivery_timestamp: number;
    shipping_type: string;
    pending_payment: boolean;
    home_pickup: boolean;
    home_delivery: boolean;
    packages: Package.JSON[];
};

const shippingTypes = fees.shipping.map(p => p.id);
const shippingTypesList = shippingTypes.map(t => `\`${t}\``).join(", ").replace(/, ([^,]+)$/, " or $1");

/* eslint-disable camelcase */
export const Model = mongoose.model("shipment", new mongoose.Schema<ReplaceKey<JSON, "id", "_id">>({
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
                if (!User.validateRut(rut)) throw new Error("Invalid sender RUT.");
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
                if (!User.validateRut(rut)) throw new Error("Invalid recipient RUT.");
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
        required: true,
        cast: false,
        description: "When the shipment was picked up from the source address.",
    },
    delivery_timestamp: {
        type: Number,
        required: true,
        cast: false,
        description: "When the shipment arrived to the destination address.",
    },
    shipping_type: {
        type: String,
        enum: shippingTypes,
        required: true,
        cast: false,
        description: `Type of the shipment. One of: ${shippingTypesList}.`,
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
}));
/* eslint-enable camelcase */

export function toJSON(document: Document): JSON {
    return replaceKey(document.toJSON(), "_id", "id");
}
