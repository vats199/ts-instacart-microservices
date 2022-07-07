"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const const_1 = require("./const");
const successResponse = (res, status_code, message, data) => {
    res
        .status(status_code)
        .json({ message: message, data: data, status: const_1.globals.Success });
};
exports.successResponse = successResponse;
const errorResponse = (res, status_code, message, data) => {
    res
        .status(status_code)
        .json({ message: message, data: data, status: const_1.globals.Failed });
};
exports.errorResponse = errorResponse;
