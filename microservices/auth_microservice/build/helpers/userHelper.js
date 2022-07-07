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
exports.getOrderitemsByOrder = exports.getOrderByUser = exports.deleteItemById = exports.getUserByAccessToken = exports.getUserByToken = exports.getUserById = exports.getUserByNumber = exports.getUserByEmail = exports.update = exports.create = void 0;
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
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#email = :emailValue",
        ExpressionAttributeNames: { "#email": "email" },
        ExpressionAttributeValues: { ":emailValue": email },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getUserByEmail = getUserByEmail;
const getUserByNumber = (country_code, phone_number) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#phone = :phoneValue ",
        ExpressionAttributeNames: { "#phone": "phone_number" },
        ExpressionAttributeValues: { ":phoneValue": country_code + phone_number },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getUserByNumber = getUserByNumber;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#id = :idValue",
        ExpressionAttributeNames: { "#id": "pk" },
        ExpressionAttributeValues: { ":idValue": id },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getUserById = getUserById;
const getUserByToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#token = :tokenvalue",
        ExpressionAttributeNames: {
            "#token": "resetToken",
        },
        ExpressionAttributeValues: { ":tokenvalue": token },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getUserByToken = getUserByToken;
const getUserByAccessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#token = :tokenvalue",
        ExpressionAttributeNames: {
            "#token": "accessToken",
        },
        ExpressionAttributeValues: { ":tokenvalue": token },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getUserByAccessToken = getUserByAccessToken;
const deleteItemById = (pk, sk) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        Key: {
            pk,
            sk,
        },
    };
    return yield database_1.dynamoClient.delete(params).promise();
});
exports.deleteItemById = deleteItemById;
const getOrderByUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#SK = :idValue AND begins_with(#PK, :addRelation)",
        ExpressionAttributeNames: { "#SK": "sk", "#PK": "pk" },
        ExpressionAttributeValues: { ":idValue": id, ":addRelation": "ORD#" },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getOrderByUser = getOrderByUser;
const getOrderitemsByOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: " begins_with(#PK, :addRelation) AND #SK = :ordId",
        ExpressionAttributeNames: { "#PK": "pk", "#SK": "sk" },
        ExpressionAttributeValues: { ":addRelation": "OITEM#", ":ordId": id },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getOrderitemsByOrder = getOrderitemsByOrder;
