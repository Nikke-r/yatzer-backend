"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var gameModel = new mongoose_1.default.Schema({
    createdAt: Number,
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    inTurn: {
        player: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        },
        numberOfThrows: {
            type: Number,
            min: 0,
            max: 3,
        },
        rolling: Boolean,
    },
    scoreboard: [
        {
            player: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            rows: [
                {
                    name: {
                        type: String,
                        required: true,
                        enum: [
                            'Aces',
                            'Twos',
                            'Threes',
                            'Fours',
                            'Fives',
                            'Sixes',
                            'Sum',
                            'Bonus',
                            'Pair',
                            'TwoPairs',
                            'ThreeOfAKind',
                            'FourOfAKind',
                            'SmallStraight',
                            'LargeStraight',
                            'FullHouse',
                            'Chance',
                            'Yatzy',
                            'Total'
                        ]
                    },
                    score: Number,
                    filled: Boolean,
                }
            ]
        }
    ],
    dices: [
        {
            value: Number,
            selected: Boolean,
        }
    ],
    status: {
        type: String,
        enum: [
            'created',
            'started',
            'ended'
        ]
    },
    messages: [
        {
            message: {
                type: String,
                min: 2,
                max: 50,
                required: true,
            },
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User',
            },
            timestamp: Number,
        }
    ]
});
exports.default = mongoose_1.default.model('Game', gameModel);
