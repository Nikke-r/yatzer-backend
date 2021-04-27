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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
var types_1 = require("../../types");
var gameModel_1 = __importDefault(require("../../models/gameModel"));
var helpers_1 = require("../../utils/helpers");
var userModel_1 = __importDefault(require("../../models/userModel"));
var pubsub_1 = __importDefault(require("../pubsub"));
exports.default = {
    Query: {
        getGame: function (_parent, args) { return gameModel_1.default.findOne({ slug: args.slug }); },
    },
    Mutation: {
        createGame: function (_parent, _args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var populatedUser, slug, dices, gameColumn, createdAt, newGame, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!context.user)
                            throw new apollo_server_express_1.AuthenticationError('Not authenticated!');
                        return [4 /*yield*/, userModel_1.default.findByNameAndPopulate(context.user.username)];
                    case 1:
                        populatedUser = _a.sent();
                        if (!populatedUser)
                            throw new Error('Something went wrong');
                        slug = helpers_1.createSlug();
                        dices = helpers_1.createGameDices(5);
                        gameColumn = helpers_1.createScoreboardColumn(context.user);
                        createdAt = Date.now();
                        newGame = new gameModel_1.default({
                            slug: slug,
                            dices: dices,
                            scoreboard: [gameColumn],
                            inTurn: {
                                player: context.user._id,
                                numberOfThrows: 0,
                                rolling: false,
                            },
                            status: 'created',
                            messages: [],
                            createdAt: createdAt,
                        });
                        if (!populatedUser.games)
                            populatedUser.games = [];
                        populatedUser.games = populatedUser === null || populatedUser === void 0 ? void 0 : populatedUser.games.concat(newGame);
                        return [4 /*yield*/, populatedUser.save()];
                    case 2:
                        _a.sent();
                        pubsub_1.default.publish(populatedUser.username, { userDataChanged: populatedUser });
                        return [2 /*return*/, newGame.save()];
                    case 3:
                        error_1 = _a.sent();
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        joinGame: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var populatedUser, game, gameColumn, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!context.user)
                            throw new apollo_server_express_1.AuthenticationError('Not authenticated!');
                        return [4 /*yield*/, userModel_1.default.findByNameAndPopulate(context.user.username)];
                    case 1:
                        populatedUser = _a.sent();
                        if (!populatedUser)
                            throw new Error('Something went wrong');
                        return [4 /*yield*/, gameModel_1.default.findOne({ slug: args.slug }).populate('scoreboard.player')];
                    case 2:
                        game = _a.sent();
                        if (!game)
                            throw new Error("Game with slug: " + args.slug + " not found!");
                        if (game.scoreboard.length >= 5)
                            throw new Error('Game is already full');
                        if (game.status === types_1.GameStatus.Started)
                            throw new Error('Game is already running');
                        if (game.scoreboard.find(function (player) { return player.player.username === context.user.username; }))
                            return [2 /*return*/];
                        gameColumn = helpers_1.createScoreboardColumn(context.user);
                        game.scoreboard = game.scoreboard.concat(gameColumn);
                        if (!populatedUser.games)
                            populatedUser.games = [];
                        populatedUser.games = populatedUser.games.concat(game);
                        return [4 /*yield*/, populatedUser.save()];
                    case 3:
                        _a.sent();
                        pubsub_1.default.publish(populatedUser.username, { userDataChanged: populatedUser });
                        pubsub_1.default.publish(args.slug, { gameDataChanged: game });
                        return [2 /*return*/, game.save()];
                    case 4:
                        error_2 = _a.sent();
                        throw new Error(error_2);
                    case 5: return [2 /*return*/];
                }
            });
        }); },
        rollDices: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var game, newDices, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!context.user)
                            throw new apollo_server_express_1.AuthenticationError('Not authenticated!');
                        return [4 /*yield*/, gameModel_1.default.findOne({ slug: args.slug }).populate('inTurn.player').populate('scorecard.player').populate('messages.user')];
                    case 1:
                        game = _a.sent();
                        if (!game)
                            throw new Error("Game with slug: " + args.slug + " not found!");
                        if (game.inTurn.player.id !== context.user.id)
                            throw new Error('Not in turn!');
                        if (game.inTurn.numberOfThrows >= 3)
                            throw new Error('All three throws have been used!');
                        if (game.status === 'created')
                            game.status = types_1.GameStatus.Started;
                        game.inTurn.rolling = true;
                        pubsub_1.default.publish(args.slug, { gameDataChanged: game });
                        newDices = helpers_1.rollDices(game.dices);
                        game.dices = newDices;
                        game.inTurn.numberOfThrows = game.inTurn.numberOfThrows + 1;
                        game.inTurn.rolling = false;
                        return [4 /*yield*/, game.save()];
                    case 2:
                        _a.sent();
                        pubsub_1.default.publish(args.slug, { gameDataChanged: game });
                        return [2 /*return*/, game];
                    case 3:
                        error_3 = _a.sent();
                        throw new Error(error_3);
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        toggleDiceSelection: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var game, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!context.user)
                            throw new apollo_server_express_1.AuthenticationError('Not authenticated!');
                        return [4 /*yield*/, gameModel_1.default.findOne({ slug: args.slug }).populate('inTurn.player').populate('scorecard.player').populate('messages.user')];
                    case 1:
                        game = _a.sent();
                        if (!game)
                            throw new Error("Game with slug: " + args.slug + " not found!");
                        if (game.inTurn.player.id !== context.user.id)
                            throw new Error('Not in turn!');
                        if (game.inTurn.numberOfThrows === 0)
                            throw new Error('You need to roll dices before you can select them');
                        game.dices[args.diceIndex].selected = !game.dices[args.diceIndex].selected;
                        return [4 /*yield*/, game.save()];
                    case 2:
                        _a.sent();
                        pubsub_1.default.publish(args.slug, { gameDataChanged: game });
                        return [2 /*return*/, game];
                    case 3:
                        error_4 = _a.sent();
                        throw new Error(error_4);
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        postScore: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var game_1, score, scoreboardColumn, scoreboardRow, currentPlayerIndex, scoreCopy, upperSection, sum, lowerSection, total, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!context.user)
                            throw new apollo_server_express_1.AuthenticationError('Not authenticated!');
                        return [4 /*yield*/, gameModel_1.default.findOne({ slug: args.slug }).populate('inTurn.player').populate('scoreboard.player').populate('messages.user')];
                    case 1:
                        game_1 = _a.sent();
                        if (!game_1)
                            throw new Error("Game with slug: " + args.slug + " not found!");
                        if (game_1.inTurn.player.id !== context.user.id)
                            throw new Error('Not in turn!');
                        if (game_1.inTurn.numberOfThrows === 0)
                            throw new Error('You need to roll dices first!');
                        if (args.rowName === types_1.ScoreboardRowName.Sum || args.rowName === types_1.ScoreboardRowName.Bonus || args.rowName === types_1.ScoreboardRowName.Total)
                            throw new Error('Cannot post score to this row');
                        score = helpers_1.validateScore(game_1.dices, args.rowName);
                        scoreboardColumn = game_1.scoreboard.find(function (column) { return column.player.id === context.user.id; });
                        if (scoreboardColumn) {
                            scoreboardRow = scoreboardColumn.rows.find(function (row) { return row.name === args.rowName; });
                            if (scoreboardRow) {
                                if (scoreboardRow.filled) {
                                    throw new Error('Field already filled!');
                                }
                                scoreboardRow.score = score;
                                scoreboardRow.filled = true;
                                currentPlayerIndex = game_1.scoreboard.findIndex(function (column) { return column.player.id === game_1.inTurn.player.id; });
                                game_1.inTurn.player = currentPlayerIndex === game_1.scoreboard.length - 1 ? game_1.scoreboard[0].player : game_1.scoreboard[currentPlayerIndex + 1].player;
                                game_1.inTurn.numberOfThrows = 0;
                                scoreCopy = __spreadArray([], scoreboardColumn.rows);
                                upperSection = scoreCopy.splice(0, 6);
                                sum = helpers_1.calculateSum(upperSection);
                                if (sum) {
                                    scoreboardColumn.rows[6].score = sum;
                                    scoreboardColumn.rows[6].filled = true;
                                    if (sum >= 63) {
                                        scoreboardColumn.rows[7].score = 50;
                                        scoreboardColumn.rows[7].filled = true;
                                    }
                                    else {
                                        scoreboardColumn.rows[7].score = 0;
                                        scoreboardColumn.rows[7].filled = true;
                                    }
                                }
                                lowerSection = scoreCopy.splice(0, 11);
                                total = helpers_1.calculateTotal(lowerSection);
                                if (total) {
                                    scoreboardColumn.rows[17].score = total;
                                    scoreboardColumn.rows[17].filled = true;
                                    if (currentPlayerIndex === game_1.scoreboard.length - 1) {
                                        game_1.status = types_1.GameStatus.Ended;
                                    }
                                }
                            }
                        }
                        game_1.dices = game_1.dices.map(function (dice) {
                            dice.selected = false;
                            return dice;
                        });
                        pubsub_1.default.publish(args.slug, { gameDataChanged: game_1 });
                        return [2 /*return*/, game_1.save()];
                    case 2:
                        error_5 = _a.sent();
                        throw new Error(error_5);
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        newMessage: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var game, newMessage, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!context.user)
                            throw new apollo_server_express_1.AuthenticationError('Not authenticated!');
                        return [4 /*yield*/, gameModel_1.default.findOne({ slug: args.slug }).populate('scoreboard.player').populate('inTurn.player').populate('messages.user')];
                    case 1:
                        game = _a.sent();
                        if (!game)
                            throw new Error("Game with slug: " + args.slug + " not found!");
                        if (!game.scoreboard.find(function (column) { return column.player.id === context.user.id; }))
                            throw new Error("Not in the game!");
                        if (!args.message || args.message.length < 2 || args.message.length > 20)
                            throw new Error('Message must be at least three characters and maximun of 20 characters');
                        newMessage = {
                            timestamp: Date.now(),
                            user: context.user,
                            message: args.message
                        };
                        game.messages = game.messages.concat(newMessage);
                        pubsub_1.default.publish(args.slug, { gameDataChanged: game });
                        return [2 /*return*/, game.save()];
                    case 2:
                        error_6 = _a.sent();
                        throw new Error(error_6);
                    case 3: return [2 /*return*/];
                }
            });
        }); },
    },
    Subscription: {
        gameDataChanged: {
            subscribe: function (_parent, args) { return pubsub_1.default.asyncIterator([args.slug]); },
        }
    }
};
