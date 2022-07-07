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
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.getItem = exports.getSingleStore = exports.getStores = void 0;
const const_1 = require("../util/const");
const response_1 = require("../util/response");
const shopHelper = __importStar(require("../helpers/shopHelper"));
const getStores = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield shopHelper.getStores();
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.StoresFetched, stores.Items);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.getStores = getStores;
const getSingleStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const storeId = req.params.storeId;
    try {
        const categories = yield shopHelper.getCategories(storeId);
        if (((_a = categories.Items) === null || _a === void 0 ? void 0 : _a.length) == 0) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusNotFound, "No Categories found!", null);
        }
        for (let i = 0; i < ((_b = categories.Items) === null || _b === void 0 ? void 0 : _b.length); i++) {
            const items = yield shopHelper.getItemsByCat(categories.Items[i].pk);
            if (((_c = items.Items) === null || _c === void 0 ? void 0 : _c.length) == 0) {
                categories.Items[i].items = null;
            }
            else {
                categories.Items[i].items = items.Items;
            }
        }
        const store = yield shopHelper.getSingleStore(storeId);
        const data = {};
        data.store = store.Items[0];
        data.categories = categories.Items;
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.SingleStoreFetched, data);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.getSingleStore = getSingleStore;
const getItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.itemId;
    try {
        const data = yield shopHelper.getItemById(itemId);
        if (data.Items.length == 0) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusNotFound, "Item not Found!", null);
        }
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.ItemsFetched, data.Items[0]);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.getItem = getItem;
const search = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    const term = req.query.term;
    try {
        const categories = yield shopHelper.searchCategories(term);
        if (((_d = categories.Items) === null || _d === void 0 ? void 0 : _d.length) == 0) {
            return (0, response_1.errorResponse)(res, const_1.globals.StatusNotFound, "No Categories found!", null);
        }
        for (let i = 0; i < ((_e = categories.Items) === null || _e === void 0 ? void 0 : _e.length); i++) {
            const items = yield shopHelper.getItemsByCat(categories.Items[i].pk);
            if (((_f = items.Items) === null || _f === void 0 ? void 0 : _f.length) == 0) {
                categories.Items[i].items = null;
            }
            else {
                categories.Items[i].items = items;
            }
        }
        const items = yield shopHelper.searchItems(term);
        const stores = yield shopHelper.searchStores(term);
        const data = {};
        data.totalResults =
            categories.Items.length + items.Items.length + stores.Items.length;
        data.categories = categories.Items;
        data.stores = stores.Items;
        data.items = items.Items;
        return (0, response_1.successResponse)(res, const_1.globals.StatusOK, const_1.globalResponse.SearchResponse, data);
    }
    catch (error) {
        console.log(error);
        return (0, response_1.errorResponse)(res, const_1.globals.StatusInternalServerError, const_1.globalResponse.ServerError, null);
    }
});
exports.search = search;
