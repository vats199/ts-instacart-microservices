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
const authController = __importStar(require("../controllers/authController"));
const jwtAuth = __importStar(require("../middlewares/jwtAuth"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const check_1 = require("express-validator/check");
const router = express_1.default.Router();
router.use((0, cors_1.default)());
router.post("/register", (0, check_1.body)("email").isEmail().withMessage("Please enter a valid email address!"), (0, check_1.body)("password", "Please Enter a valid Password!")
    .isLength({ min: 5 })
    .trim(), authController.signup);
router.post("/login", (0, check_1.body)("email").isEmail().withMessage("Please enter a valid email address!"), (0, check_1.body)("password", "Please Enter a valid Password!")
    .isLength({ min: 5 })
    .trim(), authController.login);
router.post("/generateOTP", (0, check_1.body)("phone_number")
    .isMobilePhone("any")
    .withMessage("Please enter a valid phone number!"), authController.generateOTP);
router.post("/verifyOTP", (0, check_1.body)("phone_number")
    .isMobilePhone("any")
    .withMessage("Please enter a valid phone number!"), (0, check_1.body)("otpValue").isLength({ min: 4, max: 4 }).withMessage("Enter Valid OTP!"), jwtAuth.jwtAuth, authController.verifyOTP);
router.post("/refreshToken", authController.refreshToken);
router.post("/resetPasswordLink", (0, check_1.body)("email").isEmail().withMessage("Please enter a valid email address!"), authController.resetPasswordLink);
router.get("/resetPassword/:token", authController.getNewPassword);
router.post("/new-password", (0, check_1.body)("password", "Please Enter a valid Password!")
    .isLength({ min: 5 })
    .trim(), authController.postNewPassword);
router.post("/logout", jwtAuth.jwtAuth, authController.logout);
exports.default = router;
