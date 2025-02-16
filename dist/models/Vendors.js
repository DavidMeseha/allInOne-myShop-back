"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DEFAULT_PROFILE_IMAGE = process.env.DOMAIN + "/images/profile_placeholder.jpg";
const vendorFields = {
    name: {
        type: String,
        required: true,
    },
    seName: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: DEFAULT_PROFILE_IMAGE,
    },
    productCount: {
        type: Number,
        default: 0,
    },
    followersCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose_1.default.Schema.ObjectId,
        required: true,
        ref: "Users",
    },
};
exports.VendorSchema = new mongoose_1.default.Schema(vendorFields);
exports.VendorSchema.index({ name: "text" });
const Vendors = mongoose_1.default.models.Vendors ||
    mongoose_1.default.model("Vendors", exports.VendorSchema);
exports.default = Vendors;
