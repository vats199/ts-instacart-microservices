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
exports.postNewPassword = exports.getNewPassword = exports.resetPasswordLink = exports.refreshToken = exports.verifyOTP = exports.generateOTP = exports.logout = exports.login = exports.signup = void 0;
require("dotenv").config();
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const userHelper = __importStar(require("../helpers/userHelper"));
const userId_1 = require("../services/userId");
const const_1 = require("../util/const");
const response_1 = require("../util/response");
const stripe_1 = __importDefault(require("stripe"));
const twilio_1 = require("twilio");
const check_1 = require("express-validator/check");
const jwt = __importStar(require("jsonwebtoken"));
const mail = __importStar(require("node-mailjet"));
const mailjet = mail.connect(process.env.mjapi, process.env.mjsecret);
const stripe = new stripe_1.default(process.env.STRIPE_SK, {
    apiVersion: "2020-08-27",
});
const client = new twilio_1.Twilio(process.env.accountSID, process.env.authToken);
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, check_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, errors.array()[0].msg, null);
    }
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password,
            pk: "U#" + (0, userId_1.generateId)(6),
            sk: "-",
        };
        const user = yield userHelper.getUserByEmail(req.body.email);
        if (((_a = user.Items) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.UserExist, undefined);
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                    return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.Error, undefined);
                }
                userData.password = hash;
                const customer = yield stripe.customers.create({
                    email: req.body.email,
                    description: "Insta-Cart Customer!",
                });
                userData.stripe_id = customer.id;
                yield userHelper.create(userData);
                return (0, response_1.successResponse)(res, const_1.globals.StatusCreated, const_1.globalResponse.RegistrationSuccess, undefined);
                // const resp = {
                //   statusCode: 200,
                //   body: JSON.stringify('User Created!'),
                // }
                // return resp
            }));
        }
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, undefined);
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, check_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, errors.array()[0].msg, null);
    }
    try {
        const test = yield userHelper.getUserByEmail(req.body.email);
        if (!test || test == null || test == undefined) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusNotFound, const_1.globalResponse.UserNotFound, null);
        }
        const passCheck = yield bcrypt.compare(req.body.password, test.Items[0].password);
        if (!passCheck) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.InvalidCredentials, null);
        }
        const userForToken = Object.assign({}, test.Items[0]);
        delete userForToken.accessToken;
        delete userForToken.refreshToken;
        const accessToken = jwt.sign({ user: userForToken }, process.env.secret, {
            expiresIn: process.env.jwtExpiration,
        });
        const refreshToken = jwt.sign({ user: userForToken }, process.env.refSecret, { expiresIn: process.env.jwtRefExpiration });
        test.Items[0].accessToken = accessToken;
        test.Items[0].refreshToken = refreshToken;
        test.Items[0].is_active = true;
        if (!test.Items[0].loginCount) {
            test.Items[0].loginCount = 1;
        }
        else {
            test.Items[0].loginCount = test.Items[0].loginCount + 1;
        }
        yield userHelper.update(test.Items[0]);
        test.Items[0].password = undefined;
        const data = {};
        data.accessToken = accessToken;
        data.refreshToken = refreshToken;
        data.user = test.Items[0];
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.LoginSuccess, data);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.pk;
    try {
        const user = yield userHelper.getUserById(userId);
        if (user.Items.length == 0) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusNotFound, const_1.globalResponse.UserNotFound, null);
        }
        else if (user.Items[0].accessToken == null) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.AlreadyLoggedOut, null);
        }
        else {
            user.Items[0].accessToken = null;
            user.Items[0].refreshToken = null;
            user.Items[0].is_active = false;
            yield userHelper.update(user.Items[0]);
            return (0, response_1.errorResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.LogoutSuccess, null);
        }
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.logout = logout;
const generateOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const errors = (0, check_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, errors.array()[0].msg, null);
    }
    const country_code = req.body.country_code;
    const number = req.body.phone_number;
    try {
        const test = yield userHelper.getUserByNumber(country_code, number);
        if (((_b = test.Items) === null || _b === void 0 ? void 0 : _b.length) !== 0) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.UserExist, null);
        }
        const otp = yield client.verify
            .services(process.env.serviceID)
            .verifications.create({
            to: `${country_code}${number}`,
            channel: req.body.channel,
        });
        if (otp.status == "pending") {
            return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.OtpSent, null);
        }
        else {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.Error, null);
        }
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.generateOTP = generateOTP;
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, check_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, errors.array()[0].msg, null);
    }
    const country_code = req.body.country_code;
    const number = req.body.phone_number;
    const userId = req.user.pk;
    try {
        const otp = yield client.verify
            .services(process.env.serviceID)
            .verificationChecks.create({
            to: `${country_code}${number}`,
            code: req.body.otpValue,
        });
        if (otp.valid == true) {
            const user = yield userHelper.getUserById(userId);
            if (user.Items.length !== 0) {
                user.Items[0].phone_number =
                    country_code + number || user.Items[0].phone_number;
                yield userHelper.update(user.Items[0]);
            }
            else {
                return (0, response_1.errorResponse)(res, const_1.globals.StatusNotFound, const_1.globalResponse.UserNotFound, null);
            }
            return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.OtpVerified, null);
        }
        else {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.InvalidOTP, null);
        }
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.verifyOTP = verifyOTP;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.InvalidRefreshToken, null);
    }
    jwt.verify(refreshToken, process.env.refSecret, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!err) {
            const accessToken = jwt.sign({ user: user.user }, process.env.secret, { expiresIn: process.env.jwtExpiration });
            return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.RenewAccessToken, accessToken);
        }
        else {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusUnauthorized, const_1.globalResponse.Unauthorized, null);
        }
    }));
});
exports.refreshToken = refreshToken;
const resetPasswordLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, check_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, errors.array()[0].msg, null);
    }
    try {
        crypto_1.default.randomBytes(32, (err, buffer) => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            if (err) {
                return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.Error, null);
            }
            const token = buffer.toString("hex");
            const user = yield userHelper.getUserByEmail(req.body.email);
            if (((_c = user.Items) === null || _c === void 0 ? void 0 : _c.length) == 0) {
                return (0, response_1.errorResponse)(res, const_1.globals.StatusNotFound, const_1.globalResponse.UserNotFound, null);
            }
            user.Items[0].resetToken = token;
            user.Items[0].resetTokenExpiration = Date.now() + 3600000;
            yield userHelper.update(user.Items[0]);
            const link = yield mailjet.post("send", { version: "v3.1" }).request({
                Messages: [
                    {
                        From: {
                            Email: "vatsalp.tcs@gmail.com",
                            Name: "Vatsal",
                        },
                        To: [
                            {
                                Email: req.body.email,
                            },
                        ],
                        Subject: "Greetings from Insta-Cart.",
                        HTMLPart: `
                                                                        <p>You requested to reset your password for our website</p>
                                                                        <p>Click on this <a href="https://cdgx035uzb.execute-api.ap-south-1.amazonaws.com/dev/auth/resetPassword/${token}">link</a> to reset a new password
                                                                        `,
                        CustomID: "AppGettingStartedTest",
                    },
                ],
            });
            if (link) {
                return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.ResetPasswordLinkSent, null);
            }
            else {
                return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.Error, null);
            }
        }));
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.resetPasswordLink = resetPasswordLink;
const getNewPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const token = req.params.token;
    try {
        const user = yield userHelper.getUserByToken(token);
        if (((_d = user.Items) === null || _d === void 0 ? void 0 : _d.length) == 0) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusNotAcceptable, const_1.globalResponse.InvalidResetLink, null);
        }
        res.render("auth/new-password", {
            path: "/new-password",
            pageTitle: "New Password",
            userId: user.pk,
            passwordToken: token,
        });
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.getNewPassword = getNewPassword;
const postNewPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, check_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, errors.array()[0].msg, null);
    }
    const newPassword = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const userId = req.body.userId;
    const token = req.body.passwordToken;
    let resetUser;
    try {
        if (newPassword !== confirmPassword) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.DiffPasswords, null);
        }
        const user = yield userHelper.getUserByToken(token);
        if (user.Items.length == 0) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusBadRequest, const_1.globalResponse.InvalidResetLink, null);
        }
        // resetUser = user
        const hashedPassword = yield bcrypt.hash(newPassword, 10);
        user.Items[0].password = hashedPassword;
        user.Items[0].resetToken = null;
        user.Items[0].resetTokenExpiration = null;
        yield userHelper.update(user.Items[0]);
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.PasswordChanged, null);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.postNewPassword = postNewPassword;
