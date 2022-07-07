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
exports.searchItems = exports.searchStores = exports.searchCategories = exports.getItemById = exports.getItemsByCat = exports.getCategories = exports.getSingleStore = exports.getStores = void 0;
require("dotenv").config();
const database_1 = require("../services/database");
const tableName = process.env.DynamoTableName;
const getStores = () => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: " begins_with(#PK, :addRelation) ",
        ExpressionAttributeNames: { "#PK": "pk" },
        ExpressionAttributeValues: { ":addRelation": "STORE#" },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getStores = getStores;
const getSingleStore = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#id = :idValue",
        ExpressionAttributeNames: { "#id": "pk" },
        ExpressionAttributeValues: { ":idValue": id },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getSingleStore = getSingleStore;
const getCategories = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#store = :storeId",
        ExpressionAttributeNames: { "#store": "sk" },
        ExpressionAttributeValues: { ":storeId": id },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getCategories = getCategories;
const getItemsByCat = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#cat = :catId",
        ExpressionAttributeNames: { "#cat": "sk" },
        ExpressionAttributeValues: { ":catId": id },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getItemsByCat = getItemsByCat;
const getItemById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "#item = :itemId",
        ExpressionAttributeNames: { "#item": "pk" },
        ExpressionAttributeValues: { ":itemId": id },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.getItemById = getItemById;
const searchCategories = (term) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "begins_with(#PK, :key) AND contains(#toSearch, :term)",
        ExpressionAttributeNames: { "#toSearch": "title", "#PK": "pk" },
        ExpressionAttributeValues: { ":term": term, ":key": "CATRY#" },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.searchCategories = searchCategories;
const searchStores = (term) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "begins_with(#PK, :key) AND contains(#toSearch, :term)",
        ExpressionAttributeNames: { "#toSearch": "name", "#PK": "pk" },
        ExpressionAttributeValues: { ":term": term, ":key": "STORE#" },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.searchStores = searchStores;
const searchItems = (term) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        TableName: tableName,
        FilterExpression: "begins_with(#PK, :key) AND contains(#toSearch, :term)",
        ExpressionAttributeNames: { "#toSearch": "title", "#PK": "pk" },
        ExpressionAttributeValues: { ":term": term, ":key": "ITEM#" },
    };
    return yield database_1.dynamoClient.scan(params).promise();
});
exports.searchItems = searchItems;
