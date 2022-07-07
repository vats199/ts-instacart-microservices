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
const userController = __importStar(require("../controllers/userController"));
const jwtAuth = __importStar(require("../middlewares/jwtAuth"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const check_1 = require("express-validator/check");
const router = express_1.default.Router();
router.use((0, cors_1.default)());
router.get("/profile", jwtAuth.jwtAuth, userController.getProfile);
router.put("/edit-name", jwtAuth.jwtAuth, userController.editName);
router.put("/edit-email", (0, check_1.body)("email")
    .isEmail()
    .withMessage("Please enter a valid email address!")
    .normalizeEmail(), (0, check_1.body)("password", "Please Enter a valid Password!")
    .isLength({ min: 5 })
    .trim(), jwtAuth.jwtAuth, userController.editEmail);
router.get("/get-addresses", jwtAuth.jwtAuth, userController.getAddresses);
router.post("/add-address", jwtAuth.jwtAuth, userController.postAddress);
router.put("/edit-address/:addressId", jwtAuth.jwtAuth, userController.editAddress);
router.post("/activate-address", jwtAuth.jwtAuth, userController.activateAddress);
router.delete("/delete-address", jwtAuth.jwtAuth, userController.deleteAddress);
router.post("/add-card", jwtAuth.jwtAuth, userController.addCard);
router.get("/get-cards", jwtAuth.jwtAuth, userController.getCards);
router.post("/post-order", jwtAuth.jwtAuth, userController.postOrder);
router.get("/get-orders", jwtAuth.jwtAuth, userController.getOrders);
router.post("/checkout", jwtAuth.jwtAuth, userController.checkout);
exports.default = router;
