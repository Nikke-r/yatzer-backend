"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    type User {\n        id: ID!\n        username: String!\n        createdAt: Float!\n        games: [Game!]!\n        token: String\n        status: Status!\n    }\n\n    enum Status {\n        online\n        offline\n    }\n\n    extend type Query {\n        getAllUsers: [User!]!\n        currentUser: User\n        signIn(username: String!, password: String!): User\n    }\n\n    extend type Mutation {\n        signUp(username: String!, password: String!): User\n    }\n\n    extend type Subscription {\n        userDataChanged(username: String!): User\n    }\n"], ["\n    type User {\n        id: ID!\n        username: String!\n        createdAt: Float!\n        games: [Game!]!\n        token: String\n        status: Status!\n    }\n\n    enum Status {\n        online\n        offline\n    }\n\n    extend type Query {\n        getAllUsers: [User!]!\n        currentUser: User\n        signIn(username: String!, password: String!): User\n    }\n\n    extend type Mutation {\n        signUp(username: String!, password: String!): User\n    }\n\n    extend type Subscription {\n        userDataChanged(username: String!): User\n    }\n"])));
var templateObject_1;
