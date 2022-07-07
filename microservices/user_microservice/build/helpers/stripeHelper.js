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
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
require("dotenv").config();
const database_1 = require("../services/database");
const tableName = process.env.DynamoTableName;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: tableName,
        Item: data,
    };
    return yield database_1.dynamoClient.put(params).promise();
});
exports.create = create;
