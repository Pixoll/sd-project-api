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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = exports.Model = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Address_1 = require("./Address");
const Package_1 = require("./Package");
const User = __importStar(require("./User"));
const util_1 = require("../../util");
const fees_1 = require("../../endpoints/fees");
const shippingTypes = fees_1.fees.shipping.map(p => p.id);
const shippingTypesList = shippingTypes.map(t => `\`${t}\``).join(", ").replace(/, ([^,]+)$/, " or $1");
exports.Model = mongoose_1.default.model("shipment", new mongoose_1.default.Schema({
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
                if (!User.validateRut(rut))
                    throw new Error("Invalid sender RUT.");
                if (rut === this.rut_recipient)
                    throw new Error("Sender's RUT can't be the same as the recipient's.");
                const user = await User.Model.findOne({ _id: rut });
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
                if (!User.validateRut(rut))
                    throw new Error("Invalid recipient RUT.");
                if (rut === this.rut_sender)
                    throw new Error("Recipient's RUT can't be the same as the sender's.");
                const user = await User.Model.findOne({ _id: rut });
                if (!user)
                    throw new Error(`User with RUT ${rut} does not exist.`);
                return true;
            },
        },
        description: "RUT of the recipient. Must be of an existing {schema:User}.",
    },
    source_address: {
        type: Address_1.Schema,
        required: true,
        cast: false,
        description: "Address where the packages are being shipped from.",
    },
    destination_address: {
        type: Address_1.Schema,
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
        type: [Package_1.Schema],
        required: true,
        cast: false,
        description: "All the packages being shipped.",
    },
}));
function toJSON(document) {
    const json = (0, util_1.replaceKey)(document.toJSON(), "_id", "id");
    return {
        ...(0, util_1.omit)(json, ["packages"]),
        packages: [...json.packages.map(p => p.toJSON())],
    };
}
exports.toJSON = toJSON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hpcG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvc2NoZW1hcy9TaGlwbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdEQUFnQztBQUVoQyx1Q0FBOEM7QUFDOUMsdUNBQThDO0FBQzlDLDZDQUErQjtBQUMvQixxQ0FBOEM7QUFDOUMsK0NBQTRDO0FBTzVDLE1BQU0sYUFBYSxHQUFHLFdBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25ELE1BQU0saUJBQWlCLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUczRixRQUFBLEtBQUssR0FBRyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsSUFBSSxrQkFBUSxDQUFDLE1BQU0sQ0FBQztJQUNoRSxHQUFHLEVBQUU7UUFDRCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxHQUFXLEVBQUUsQ0FBQyxJQUFJLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRTtRQUNsRSxLQUFLLEVBQUUsSUFBSTtRQUNYLFdBQVcsRUFBRSxxQ0FBcUM7S0FDckQ7SUFDRCxVQUFVLEVBQUU7UUFDUixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxRQUFRLEVBQUU7WUFDTixLQUFLLENBQUMsU0FBUyxDQUFrQyxHQUFXO2dCQUN4RCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7b0JBQUUsTUFBTSxJQUFJ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