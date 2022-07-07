"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
const uuid_1 = require("uuid");
const characters = (0, uuid_1.v4)().split("-").join("").toUpperCase();
const generateId = (length) => {
    let id = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
};
exports.generateId = generateId;
