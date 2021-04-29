"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    type Lobby {\n        users: [User!]!\n        messages: [ChatMessage!]!\n        name: String!\n    }\n\n    extend type Query {\n        getLobby: Lobby\n    }\n\n    extend type Mutation {\n        addUserToLobby(username: String!): Lobby\n        removeUserFromLobby(username: String!): Lobby\n        sendMessageToLobby(message: String!): Lobby\n    }\n\n    extend type Subscription {\n        lobbyDataChanged: Lobby\n    }\n"], ["\n    type Lobby {\n        users: [User!]!\n        messages: [ChatMessage!]!\n        name: String!\n    }\n\n    extend type Query {\n        getLobby: Lobby\n    }\n\n    extend type Mutation {\n        addUserToLobby(username: String!): Lobby\n        removeUserFromLobby(username: String!): Lobby\n        sendMessageToLobby(message: String!): Lobby\n    }\n\n    extend type Subscription {\n        lobbyDataChanged: Lobby\n    }\n"])));
var templateObject_1;
