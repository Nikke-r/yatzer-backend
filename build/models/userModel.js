"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var userModel = new mongoose_1.default.Schema({
    username: {
        type: String,
        min: 3,
        max: 15,
        required: true,
        unique: true,
    },
    createdAt: Number,
    password: {
        type: String,
        min: 5,
        required: true,
    },
    games: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Game'
        }
    ],
    status: {
        type: String,
        default: 'online',
        enum: [
            "online",
            "offline"
        ]
    },
    admin: Boolean,
    socketId: String
});
exports.default = mongoose_1.default.model('User', userModel);
