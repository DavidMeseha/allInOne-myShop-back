"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProductToCart = addProductToCart;
exports.getCartProductsIds = getCartProductsIds;
exports.getCartProducts = getCartProducts;
exports.removeProductFromCart = removeProductFromCart;
exports.changeLanguage = changeLanguage;
exports.getCountries = getCountries;
exports.getCities = getCities;
const Products_1 = __importDefault(require("../models/Products"));
const utilities_1 = require("../utilities");
const mongoose_1 = __importDefault(require("mongoose"));
const Users_1 = __importDefault(require("../models/Users"));
const Countries_1 = __importDefault(require("../models/Countries"));
function addProductToCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const productId = req.params.id;
        const quantity = req.body.quantity;
        const attributes = req.body.attributes;
        if (!productId)
            res.status(400).json("missing product id");
        try {
            const product = yield Products_1.default.findByIdAndUpdate(productId, {
                $inc: { carts: 1 },
            })
                .select("productAttributes")
                .lean()
                .exec();
            if (!product)
                throw new Error("wrong product Id");
            (0, utilities_1.validateAttributes)(attributes !== null && attributes !== void 0 ? attributes : [], product.productAttributes);
            const updated = yield Users_1.default.updateOne({
                _id: user._id,
                cart: {
                    $not: {
                        $elemMatch: { product: new mongoose_1.default.Types.ObjectId(productId) },
                    },
                },
            }, {
                $push: {
                    cart: {
                        product: new mongoose_1.default.Types.ObjectId(productId),
                        quantity,
                        attributes,
                    },
                },
            });
            if (!updated.matchedCount)
                throw new Error("Could not add product to cart");
            res.status(200).json("Product added to cart");
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getCartProductsIds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const userCart = yield Users_1.default.findById(user._id)
                .select("cart.product cart.quantity")
                .lean()
                .exec();
            res.status(200).json(userCart === null || userCart === void 0 ? void 0 : userCart.cart);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getCartProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const userCart = yield Users_1.default.findById(user._id)
                .select("cart")
                .populate("cart.product")
                .lean()
                .exec();
            res.status(200).json(userCart === null || userCart === void 0 ? void 0 : userCart.cart);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function removeProductFromCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const productId = req.params.id;
        try {
            const updated = yield Users_1.default.updateOne({
                _id: user._id,
                cart: {
                    $elemMatch: { product: new mongoose_1.default.Types.ObjectId(productId) },
                },
            }, {
                $pull: { cart: { product: new mongoose_1.default.Types.ObjectId(productId) } },
            });
            if (!updated.modifiedCount)
                throw new Error("The product is not in user's cart");
            yield Products_1.default.updateOne({ _id: productId }, { $inc: { carts: -1 } }).exec();
            res.status(200).json("Item Removed from cart");
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function changeLanguage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const language = req.params.lang;
        try {
            if (language !== "en" && language !== "ar")
                throw new Error("language is not supported");
            yield Users_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(user._id) }, { language: language });
            res.status(200).json("language changed");
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getCountries(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const countries = yield Countries_1.default.find({}).lean().exec();
            res.status(200).json(countries);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getCities(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const countryId = req.params.id;
        try {
            const country = yield Countries_1.default.findById(countryId)
                .select("cities")
                .populate("cities")
                .lean()
                .exec();
            setTimeout(() => {
                res.status(200).json(country === null || country === void 0 ? void 0 : country.cities);
            }, 2000);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
