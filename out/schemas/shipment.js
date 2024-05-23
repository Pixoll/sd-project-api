"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shipment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const address_1 = require("./address");
const package_1 = require("./package");
const user_1 = require("./user");
const util_1 = require("../util");
const fees_1 = require("../endpoints/fees");
class Shipment extends null {
    static packageStatuses = [
        "pending",
        "pre-transit",
        "in_transit",
        "out_for_delivery",
        "delivered",
    ];
    static shippingTypes = fees_1.FeesEndpoint.fees.shipping.map(p => p.id);
    static shippingTypesList = Shipment.shippingTypes
        .map(t => `\`${t}\``)
        .join(", ")
        .replace(/, ([^,]+)$/, " or $1");
    static packageStatusesList = Shipment.packageStatuses
        .map(s => `\`${s}\``)
        .join(", ")
        .replace(/, ([^,]+)$/, " or $1");
    static Model = mongoose_1.default.model("shipment", new mongoose_1.default.Schema({
        _id: {
            type: String,
            default: () => new mongoose_1.default.Types.ObjectId().toHexString(),
            alias: "id",
            description: "The shipment id. Used for tracking.",
        },
        rut_sender: {
            type: String,
            required: true,
            cast: false,
            validate: {
                async validator(rut) {
                    if (!user_1.User.isValidRut(rut))
                        throw new Error("Invalid sender RUT.");
                    if (rut === this.rut_recipient)
                        throw new Error("Sender's RUT can't be the same as the recipient's.");
                    const user = await user_1.User.Model.findOne({ _id: rut });
                    if (!user)
                        throw new Error(`User with RUT ${rut} does not exist.`);
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
                async validator(rut) {
                    if (!user_1.User.isValidRut(rut))
                        throw new Error("Invalid recipient RUT.");
                    if (rut === this.rut_sender)
                        throw new Error("Recipient's RUT can't be the same as the sender's.");
                    const user = await user_1.User.Model.findOne({ _id: rut });
                    if (!user)
                        throw new Error(`User with RUT ${rut} does not exist.`);
                    return true;
                },
            },
            description: "RUT of the recipient. Must be of an existing {schema:User}.",
        },
        source_address: {
            type: address_1.Address.Schema,
            required: true,
            cast: false,
            description: "Address where the packages are being shipped from.",
        },
        destination_address: {
            type: address_1.Address.Schema,
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
            type: [package_1.Package.Schema],
            required: true,
            cast: false,
            description: "All the packages being shipped.",
        },
    }, {
        versionKey: false,
        timestamps: true,
    }));
    static toJSON(document) {
        return util_1.Util.replaceKeys(document.toJSON(), {
            _id: "id",
            createdAt: "created_timestamp",
            updatedAt: "updated_timestamp",
        });
    }
}
exports.Shipment = Shipment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpcG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NoZW1hcy9zaGlwbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3REFBZ0M7QUFFaEMsdUNBQW9DO0FBQ3BDLHVDQUFvQztBQUNwQyxpQ0FBOEI7QUFDOUIsa0NBQStCO0FBQy9CLDRDQUFpRDtBQUVqRCxNQUFhLFFBQVMsU0FBUSxJQUFJO0lBQ3ZCLE1BQU0sQ0FBVSxlQUFlLEdBQUc7UUFDckMsU0FBUztRQUNULGFBQWE7UUFDYixZQUFZO1FBQ1osa0JBQWtCO1FBQ2xCLFdBQVc7S0FDTCxDQUFDO0lBRUgsTUFBTSxDQUFVLGFBQWEsR0FBRyxtQkFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFFLE1BQU0sQ0FBVSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsYUFBYTtTQUM3RCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1NBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDVixPQUFPLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLE1BQU0sQ0FBVSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsZUFBZTtTQUNqRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1NBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDVixPQUFPLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRTlCLE1BQU0sQ0FBVSxLQUFLLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksa0JBQVEsQ0FBQyxNQUFNLENBSXpFO1FBQ0EsR0FBRyxFQUFFO1lBQ0QsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsR0FBVyxFQUFF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