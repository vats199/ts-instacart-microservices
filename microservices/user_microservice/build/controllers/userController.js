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
exports.getOrders = exports.postOrder = exports.activateAddress = exports.deleteAddress = exports.editAddress = exports.getAddresses = exports.postAddress = exports.editEmail = exports.editName = exports.getProfile = exports.checkout = exports.getCards = exports.addCard = void 0;
const check_1 = require("express-validator/check");
const const_1 = require("../util/const");
const response_1 = require("../util/response");
const userHelper = __importStar(require("../helpers/userHelper"));
const addressHelper = __importStar(require("../helpers/addressHelper"));
const shopHelper = __importStar(require("../helpers/shopHelper"));
const userId_1 = require("../services/userId");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const stripe_1 = __importDefault(require("stripe"));
const stripeHelper = __importStar(require("../helpers/stripeHelper"));
const stripe = new stripe_1.default(process.env.STRIPE_SK, {
    apiVersion: "2020-08-27",
});
const addCard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userHelper.getUserById(req.user.pk);
        const exp = req.body.expire.split("/");
        const exp_month = exp[0];
        const exp_year = exp[1];
        const cardInfo = yield stripe.customers.createSource(user.Items[0].stripe_id, {
            source: {
                object: "card",
                number: req.body.number,
                exp_month: exp_month,
                exp_year: exp_year,
                cvc: req.body.cvc,
                name: req.body.name,
            },
        });
        const payload = {
            pk: "CARD#" + (0, userId_1.generateId)(6),
            sk: req.user.pk,
            card_id: cardInfo.id,
        };
        const save = yield stripeHelper.create(payload);
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.CardSaved, save);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.addCard = addCard;
const getCards = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userHelper.getUserById(req.user.pk);
        const cards = yield stripe.customers.listSources(user.Items[0].stripe_id, {
            object: "card",
        });
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.CardsFetched, cards);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.getCards = getCards;
const checkout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userHelper.getUserById(req.user.pk);
        const amount = req.body.amount;
        if (!user.Items[0].stripe_id) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.StripeError, null);
        }
        const cardInfo = yield stripe.customers.retrieveSource(user.Items[0].stripe_id, req.body.card_id);
        const intent = yield stripe.paymentIntents.create({
            payment_method_types: ["card"],
            description: "Pay for Insta-Cart",
            receipt_email: user.Items[0].email,
            amount: parseFloat(amount) * 100,
            currency: "usd",
            customer: user.Items[0].stripe_id,
            payment_method: cardInfo.id,
        });
        const paym = yield userHelper.create({
            pk: "PAYM#" + (0, userId_1.generateId)(6),
            amount: parseFloat(amount),
            sk: req.user.pk,
            transaction_id: intent.client_secret,
            status: "PENDING",
        });
        const data = {};
        data.client_secret = intent.client_secret;
        data.customerId = intent.customer;
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.PaymentIntentCreated, data);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.checkout = checkout;
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.pk;
    try {
        const user = yield userHelper.getUserById(userId);
        if (user.Items.length == 0) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusNotFound, const_1.globalResponse.UserNotFound, null);
        }
        const data = {
            email: user.Items[0].email,
            firstName: user.Items[0].firstName,
            lastName: user.Items[0].lastName,
            phone: user.Items[0].phone_number,
        };
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.UserFound, data);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.getProfile = getProfile;
const editName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.pk;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    try {
        const user = yield userHelper.getUserById(userId);
        if (user.Items.length == 0) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusNotFound, const_1.globalResponse.UserNotFound, null);
        }
        user.Items[0].firstName = firstName || user.Items[0].firstName;
        user.Items[0].lastName = lastName || user.Items[0].lastName;
        yield userHelper.update(user.Items[0]);
        user.Items[0].password = undefined;
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.UserUpdated, user.Items[0]);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.editName = editName;
const editEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, check_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, errors.array()[0].msg, null);
    }
    const userId = req.user.pk;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const test = yield userHelper.getUserById(userId);
        const test1 = yield userHelper.getUserByEmail(email);
        if (test1.Items.length !== 0) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.EmailCheck, null);
        }
        const passCheck = yield bcryptjs_1.default.compare(password, test.Items[0].password);
        if (!passCheck) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.InvalidCredentials, null);
        }
        test.Items[0].email = email;
        yield userHelper.update(test.Items[0]);
        test.Items[0].password = undefined;
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.UserUpdated, test.Items[0]);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.editEmail = editEmail;
const postAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        pk: "ADDR#" + (0, userId_1.generateId)(6),
        address_info: req.body.address,
        address_type: req.body.address_type || 0,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        sk: req.user.pk,
        is_active: 1,
    };
    try {
        const address = yield addressHelper.create(payload);
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.AddressAdded, address);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.postAddress = postAddress;
const getAddresses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user.pk;
    try {
        const addresses = yield addressHelper.getAddressByUser(userId);
        const data = {};
        data.totalAddresses = (_a = addresses.Items) === null || _a === void 0 ? void 0 : _a.length;
        data.addresses = addresses.Items;
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.AddressesFetched, data);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.getAddresses = getAddresses;
const editAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = req.user.pk;
    const addressId = req.params.addressId;
    try {
        const address = yield addressHelper.getAddressByIdAndUser(addressId, userId);
        if (((_b = address.Items) === null || _b === void 0 ? void 0 : _b.length) != 0) {
            address.Items[0].address_info =
                req.body.address_info || address.Items[0].address_info;
            address.Items[0].icon = req.body.icon || address.Items[0].icon;
            address.Items[0].address_type =
                req.body.address_type || address.Items[0].address_type;
            address.Items[0].latitude =
                req.body.latitude || address.Items[0].latitude;
            address.Items[0].longitude =
                req.body.longitude || address.Items[0].longitude;
            try {
                yield addressHelper.update(address.Items[0]);
                return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.AddressUpdated, address.Items[0]);
            }
            catch (err) {
                console.log(err);
                return (0, response_1.errorResponse)(res, const_1.globals.StatusNotFound, const_1.globalResponse.Error, null);
            }
        }
        else {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.NoAddress, null);
        }
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.editAddress = editAddress;
const deleteAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const addressId = req.body.addressId;
    const userId = req.user.pk;
    try {
        yield userHelper.deleteItemById(addressId, userId);
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.AddressUpdated, null);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.deleteAddress = deleteAddress;
const activateAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = req.user.pk;
    const addressId = "ADDR#" + req.body.addressId;
    try {
        const address = yield addressHelper.getAddressByIdAndUser(addressId, userId);
        if (address.Items[0].is_active == true) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.AddressAlreadyActive, null);
        }
        else {
            address.Items[0].is_active = 1;
            const otherAddresses = yield addressHelper.getActiveAddresses(userId);
            if (((_c = otherAddresses.Items) === null || _c === void 0 ? void 0 : _c.length) !== 0) {
                for (let i = 0; i < otherAddresses.Items.length; i++) {
                    otherAddresses.Items[i].is_active = false;
                    yield addressHelper.update(otherAddresses.Items[i]);
                }
            }
            const result = yield addressHelper.update(address.Items[0]);
            return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.AddressActivated, result);
        }
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.activateAddress = activateAddress;
const postOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.pk, items = req.body.items, order_type = req.body.order_type, delivery_time = req.body.delivery_time, amount = req.body.amount, discount_amount = req.body.discount_amount, addressId = req.body.addressId, country_code = req.body.country_code, phone_number = req.body.phone_number, instructions = req.body.instructions, is_gift = req.body.is_gift;
    const net_amount = amount - discount_amount;
    try {
        const payload = {
            pk: "ORD#" + (0, userId_1.generateId)(6),
            sk: userId,
            order_type: order_type,
            delivery_time: delivery_time,
            country_code: country_code,
            phone_number: phone_number,
            instructions: instructions,
            is_gift: is_gift,
            addressId: addressId,
            amount: amount,
            discount_amount: discount_amount,
            net_amount: net_amount,
            status: 0,
        };
        const ord = yield userHelper.create(payload);
        for (let j = 0; j < items.length; j++) {
            if (items[j]) {
                yield userHelper.create({
                    pk: "OITEM#" + (0, userId_1.generateId)(6),
                    sk: payload.pk,
                    itemId: items[j].id,
                    quantity: items[j].qty,
                    itemTotal: items[j].qty * items[j].price,
                });
            }
        }
        // const resp = await order.findByPk(ord.id, {
        //   include: { model: orderItem, include: [item] },
        // });
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.OrderPlaced, null);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.postOrder = postOrder;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    const userId = req.user.pk;
    try {
        const orders = yield userHelper.getOrderByUser(userId);
        for (let i = 0; i < ((_d = orders.Items) === null || _d === void 0 ? void 0 : _d.length); i++) {
            let temp = [];
            const ordItems = yield userHelper.getOrderitemsByOrder(orders.Items[i].pk);
            for (let j = 0; j < ((_e = ordItems.Items) === null || _e === void 0 ? void 0 : _e.length); j++) {
                const orderItems = yield shopHelper.getItemById(ordItems.Items[j].itemId);
                if (((_f = orderItems.Items) === null || _f === void 0 ? void 0 : _f.length) == 0) {
                    temp.push(null);
                }
                else {
                    temp.push(orderItems.Items[0]);
                }
            }
            orders.Items[i].items = temp;
        }
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.OrdersFetched, orders.Items);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.getOrders = getOrders;
