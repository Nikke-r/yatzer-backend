"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gameResolver_1 = __importDefault(require("./gameResolver"));
var userResolver_1 = __importDefault(require("./userResolver"));
exports.default = [
    userResolver_1.default,
    gameResolver_1.default,
];
