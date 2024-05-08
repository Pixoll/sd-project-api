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
}, {
    versionKey: false,
}));
function toJSON(document) {
    return (0, util_1.replaceKey)(document.toJSON(), "_id", "id");
}
exports.toJSON = toJSON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hpcG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvc2NoZW1hcy9TaGlwbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdEQUFnQztBQUVoQyxtREFBcUM7QUFDckMsbURBQXFDO0FBQ3JDLDZDQUErQjtBQUMvQixxQ0FBb0Q7QUFDcEQsK0NBQTRDO0FBa0I1QyxNQUFNLGFBQWEsR0FBRyxXQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuRCxNQUFNLGlCQUFpQixHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFHM0YsUUFBQSxLQUFLLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksa0JBQVEsQ0FBQyxNQUFNLENBQWdDO0lBQy9GLEdBQUcsRUFBRTtRQUNELElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLEdBQVcsRUFBRSxDQUFDLElBQUksa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFO1FBQ2xFLEtBQUssRUFBRSxJQUFJO1FBQ1gsV0FBVyxFQUFFLHFDQUFxQztLQUNyRDtJQUNELFVBQVUsRUFBRTtRQUNSLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLFFBQVEsRUFBRTtZQUNOLEtBQUssQ0FBQyxTQUFTLENBQWtDLEdBQVc7Z0JBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQztvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQ25FLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxhQUFhO29CQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztnQkFDdEcsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsSUFBSTtvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixHQUFHLGtCQUFrQixDQUFDLENBQUM7Z0JBQ25FLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLENBQUM7U0FDSjtRQUNELFdBQVcsRUFBRSwwREFBMEQ7S0FDMUU7SUFDRCxhQUFhLEVBQUU7UUFDWCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxRQUFRLEVBQUU7WUFDTixLQUFLLENBQUMsU0FBUyxDQUErQixHQUFXO2dCQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7b0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2dCQUN0RSxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsVUFBVTtvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7Z0JBQ25HLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxDQUFDLElBQUk7b0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUNuRSxPQUFPLElBQUksQ0FBQztZQUNoQixDQUFDO1NBQ0o7UUFDRCxXQUFXLEVBQUUsNkRBQTZEO0tBQzdFO0lBQ0QsY0FBYyxFQUFFO1FBQ1osSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1FBQ3BCLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsb0RBQW9EO0tBQ3BFO0lBQ0QsbUJBQW1CLEVBQUU7UUFDakIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1FBQ3BCLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsa0RBQWtEO0tBQ2xFO0lBQ0Qsa0JBQWtCLEVBQUU7UUFDaEIsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLDBEQUEwRDtLQUMxRTtJQUNELGtCQUFrQixFQUFFO1FBQ2hCLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLFdBQVcsRUFBRSx1REFBdUQ7S0FDdkU7SUFDRCxhQUFhLEVBQUU7UUFDWCxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxhQUFhO1FBQ25CLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsaUNBQWlDLGlCQUFpQixHQUFHO0tBQ3JFO0lBQ0QsZUFBZSxFQUFFO1FBQ2IsSUFBSSxFQUFFLE9BQU87UUFDYixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLG1FQUFtRTtLQUNuRjtJQUNELFdBQVcsRUFBRTtRQUNULElBQUksRUFBRSxPQUFPO1FBQ2IsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLFdBQVcsRUFBRSxtRUFBbUU7S0FDbkY7SUFDRCxhQUFhLEVBQUU7UUFDWCxJQUFJLEVBQUUsT0FBTztRQUNiLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsb0VBQW9FO0tBQ3BGO0lBQ0QsUUFBUSxFQUFFO1FBQ04sSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUN0QixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLGlDQUFpQztLQUNqRDtDQUN3QixFQUFFO0lBQzNCLFVBQVUsRUFBRSxLQUFLO0NBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBR0osU0FBZ0IsTUFBTSxDQUFDLFFBQWtCO0lBQ3JDLE9BQU8sSUFBQSxpQkFBVSxFQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdEQsQ0FBQztBQUZELHdCQUVDIn0=