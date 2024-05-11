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
const Address = __importStar(require("./Address"));
const Package = __importStar(require("./Package"));
const User = __importStar(require("./User"));
const util_1 = require("../../util");
const fees_1 = require("../../endpoints/fees");
const shippingTypes = fees_1.fees.shipping.map(p => p.id);
const shippingTypesList = shippingTypes.map(t => `\`${t}\``).join(", ").replace(/, ([^,]+)$/, " or $1");
const packageStatuses = ["pending", "pre-transit", "in_transit", "out_for_delivery", "delivered"];
const packageStatusesList = packageStatuses.map(s => `\`${s}\``).join(", ").replace(/, ([^,]+)$/, " or $1");
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
                if (!User.isValidRut(rut))
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
                if (!User.isValidRut(rut))
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
        enum: packageStatuses,
        required: true,
        cast: false,
        description: `Status of the package. One of: ${packageStatusesList}.`,
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
}, {
    versionKey: false,
    timestamps: true,
}));
function toJSON(document) {
    return (0, util_1.replaceKeys)(document.toJSON(), {
        _id: "id",
        createdAt: "created_timestamp",
        updatedAt: "updated_timestamp",
    });
}
exports.toJSON = toJSON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hpcG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvc2NoZW1hcy9TaGlwbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdEQUFnQztBQUVoQyxtREFBcUM7QUFDckMsbURBQXFDO0FBQ3JDLDZDQUErQjtBQUMvQixxQ0FBc0Q7QUFDdEQsK0NBQTRDO0FBbUI1QyxNQUFNLGFBQWEsR0FBRyxXQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuRCxNQUFNLGlCQUFpQixHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDeEcsTUFBTSxlQUFlLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxXQUFXLENBQVUsQ0FBQztBQUMzRyxNQUFNLG1CQUFtQixHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFLL0YsUUFBQSxLQUFLLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksa0JBQVEsQ0FBQyxNQUFNLENBSS9EO0lBQ0EsR0FBRyxFQUFFO1FBQ0QsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsR0FBVyxFQUFFLENBQUMsSUFBSSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUU7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