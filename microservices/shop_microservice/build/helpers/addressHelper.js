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
exports.getActiveAddresses = exports.getAddressByIdAndUser = exports.getAddressByUser = exports.getAddressById = exports.update = exports.create = void 0;
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
const update = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: tableName,
        Item: data,
    };
    return yield database_1.dynamoClient.put(params).promise();
});
exports.update = update;
const getAddressById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#id = :idValue",
        ExpressionAttributeNames: { "#id": "pk" },
        ExpressionAttributeValues: { ":idValue": id },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getAddressById = getAddressById;
const getAddressByUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#SK = :idValue AND begins_with(#PK, :addRelation)",
        ExpressionAttributeNames: { "#SK": "sk", "#PK": "pk" },
        ExpressionAttributeValues: { ":idValue": id, ":addRelation": "ADDR#" },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getAddressByUser = getAddressByUser;
const getAddressByIdAndUser = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#addressId = :addressVal AND #userId = :userValue",
        ExpressionAttributeNames: { "#addressId": "pk", "#userId": "sk" },
        ExpressionAttributeValues: { ":addressVal": id, ":userValue": userId },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getAddressByIdAndUser = getAddressByIdAndUser;
const getActiveAddresses = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#userId = :userValue AND #active = :val",
        ExpressionAttributeNames: { "#userId": "sk", "#active": "is_active" },
        ExpressionAttributeValues: { ":userValue": userId, ":val": 1 },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getActiveAddresses = getActiveAddresses;
