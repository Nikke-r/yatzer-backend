"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var authentication_1 = require("../../passport/authentication");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var userModel_1 = __importDefault(require("../../models/userModel"));
var pubsub_1 = __importDefault(require("../pubsub"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
exports.default = {
    Query: {
        getUserCount: function () { return userModel_1.default.countDocuments({}); },
        mostPlayedGames: function () { return __awaiter(void 0, void 0, void 0, function () {
            var docs, sorted, topTen, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, userModel_1.default.find({}, 'username games')];
                    case 1:
                        docs = _a.sent();
                        sorted = docs.sort(function (a, b) {
                            if (a.games.length > b.games.length)
                                return -1;
                            if (a.games.length < b.games.length)
                                return 1;
                            return 0;
                        });
                        topTen = sorted.splice(0, 10).map(function (item) { return ({ name: item.username, amount: item.games.length }); });
                        return [2 /*return*/, topTen];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        highestScores: function () { return __awaiter(void 0, void 0, void 0, function () {
            var docs, sorted, topTen, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, userModel_1.default.find({}, 'username highestScore')];
                    case 1:
                        docs = _a.sent();
                        sorted = docs.sort(function (a, b) {
                            if (a.highestScore > b.highestScore)
                                return -1;
                            if (a.highestScore < b.highestScore)
                                return 1;
                            return 0;
                        });
                        topTen = sorted.splice(0, 10).map(function (item) { return ({ name: item.username, amount: item.highestScore }); });
                        return [2 /*return*/, topTen];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        mostWins: function () { return __awaiter(void 0, void 0, void 0, function () {
            var docs, sorted, topTen, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, userModel_1.default.find({}, 'username wins')];
                    case 1:
                        docs = _a.sent();
                        sorted = docs.sort(function (a, b) {
                            if (a.wins > b.wins)
                                return -1;
                            if (a.wins < b.wins)
                                return 1;
                            return 0;
                        });
                        topTen = sorted.splice(0, 10).map(function (item) { return ({ name: item.username, amount: item.wins }); });
                        return [2 /*return*/, topTen];
                    case 2:
                        error_3 = _a.sent();
                        throw new Error(error_3);
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        getUser: function (_parent, args) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, userModel_1.default.findByNameAndPopulate(args.username)];
        }); }); },
        getAllUsers: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var currentUser, users, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        currentUser = context.user;
                        if (!currentUser)
                            throw new Error('Not authenticated');
                        return [4 /*yield*/, userModel_1.default.find({})];
                    case 1:
                        users = _a.sent();
                        if (!users)
                            throw new Error('Did not find users');
                        return [2 /*return*/, users.filter(function (user) { return user.username.toLowerCase().includes(args.username.toLowerCase()); })];
                    case 2:
                        error_4 = _a.sent();
                        throw new Error(error_4.message);
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        currentUser: function (_parent, _args, context) { return userModel_1.default.findByNameAndPopulate(context.user.username); },
        signIn: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var req, res, loginResponse, responseUser, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        req = context.req, res = context.res;
                        req.body = args;
                        return [4 /*yield*/, authentication_1.login(req, res)];
                    case 1:
                        loginResponse = _a.sent();
                        return [4 /*yield*/, userModel_1.default.findByNameAndPopulate(loginResponse.user.username)];
                    case 2:
                        responseUser = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, loginResponse.user), { id: responseUser.id, notifications: responseUser.notifications, friends: responseUser.friends, games: responseUser.games, token: loginResponse.token })];
                    case 3:
                        error_5 = _a.sent();
                        throw new Error(error_5);
                    case 4: return [2 /*return*/];
                }
            });
        }); }
    },
    Mutation: {
        signUp: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var username, password, hashedPassword, createdAt, user, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        username = args.username, password = args.password;
                        return [4 /*yield*/, bcryptjs_1.default.hash(password, 12)];
                    case 1:
                        hashedPassword = _a.sent();
                        createdAt = Date.now();
                        user = new userModel_1.default({
                            username: username,
                            createdAt: createdAt,
                            password: hashedPassword,
                            games: [],
                            admin: false,
                            friends: [],
                            avatarUrl: '',
                            highestScore: 0,
                            wins: 0,
                        });
                        delete user.password;
                        return [2 /*return*/, user.save()];
                    case 2:
                        error_6 = _a.sent();
                        throw new Error(error_6);
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        addProfilePicture: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var currentUser, _a, createReadStream, filename, ext, stream, pathName, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, userModel_1.default.findByNameAndPopulate(context.user.username)];
                    case 1:
                        currentUser = _b.sent();
                        if (!currentUser)
                            throw new Error('Not authenticated');
                        return [4 /*yield*/, args.file];
                    case 2:
                        _a = _b.sent(), createReadStream = _a.createReadStream, filename = _a.filename;
                        ext = path_1.default.parse(filename).ext;
                        stream = createReadStream();
                        pathName = path_1.default.join(__dirname, "../../public/avatars/" + context.user.username + ext);
                        return [4 /*yield*/, stream.pipe(fs_1.default.createWriteStream(pathName))];
                    case 3:
                        _b.sent();
                        currentUser.avatarUrl = "http://localhost:3001/public/avatars/" + context.user.username + ext;
                        return [4 /*yield*/, currentUser.save()];
                    case 4:
                        _b.sent();
                        pubsub_1.default.publish(currentUser.username, { userDataChanged: currentUser });
                        return [2 /*return*/, {
                                url: "http://localhost:3001/public/avatars/" + context.user.username + ext
                            }];
                    case 5:
                        error_7 = _b.sent();
                        throw new Error(error_7.message);
                    case 6: return [2 /*return*/];
                }
            });
        }); },
        sendNotification: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (!context.user)
                        throw new Error('Not authenticated');
                    args.to.forEach(function (to) { return __awaiter(void 0, void 0, void 0, function () {
                        var toUser;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, userModel_1.default.findByNameAndPopulate(to)];
                                case 1:
                                    toUser = _a.sent();
                                    if (!toUser)
                                        throw new Error('User not found');
                                    if (!toUser.notifications)
                                        toUser.notifications = [];
                                    toUser.notifications = toUser.notifications.concat({ type: args.type, from: context.user, slug: args.slug });
                                    return [4 /*yield*/, toUser.save()];
                                case 2:
                                    _a.sent();
                                    pubsub_1.default.publish(toUser.username, { userDataChanged: toUser });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/, context.user];
                }
                catch (error) {
                    throw new Error(error);
                }
                return [2 /*return*/];
            });
        }); },
        dismissNotification: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var populatedUser, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!context.user)
                            throw new Error('Not authenticated');
                        return [4 /*yield*/, userModel_1.default.findByNameAndPopulate(context.user.username)];
                    case 1:
                        populatedUser = _a.sent();
                        if (!populatedUser)
                            throw new Error('Something went wrong');
                        populatedUser.notifications = populatedUser.notifications.filter(function (notification) { return notification.id !== args.id; });
                        return [4 /*yield*/, populatedUser.save()];
                    case 2:
                        _a.sent();
                        pubsub_1.default.publish(populatedUser.username, { userDataChanged: populatedUser });
                        return [2 /*return*/, populatedUser];
                    case 3:
                        error_8 = _a.sent();
                        throw new Error(error_8);
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        acceptFriendRequest: function (_parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var populatedUser, request, sender, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!context.user)
                            throw new Error('Not authenticated');
                        return [4 /*yield*/, userModel_1.default.findByNameAndPopulate(context.user.username)];
                    case 1:
                        populatedUser = _a.sent();
                        if (!populatedUser)
                            throw new Error('Something went wrong');
                        request = populatedUser.notifications.find(function (notification) { return notification.id === args.id; });
                        if (!request)
                            throw new Error('Request not found');
                        return [4 /*yield*/, userModel_1.default.findByNameAndPopulate(request.from.username)];
                    case 2:
                        sender = _a.sent();
                        if (!sender)
                            throw new Error('Sender not found');
                        if (!populatedUser.friends)
                            populatedUser.friends = [];
                        populatedUser.friends = populatedUser.friends.concat(sender);
                        if (!sender.friends)
                            sender.friends = [];
                        sender.friends = sender.friends.concat(populatedUser);
                        populatedUser.notifications = populatedUser.notifications.filter(function (notification) { return notification.id !== args.id; });
                        return [4 /*yield*/, populatedUser.save()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, sender.save()];
                    case 4:
                        _a.sent();
                        pubsub_1.default.publish(populatedUser.username, { userDataChanged: populatedUser });
                        pubsub_1.default.publish(sender.username, { userDataChanged: sender });
                        return [2 /*return*/, populatedUser];
                    case 5:
                        error_9 = _a.sent();
                        throw new Error(error_9);
                    case 6: return [2 /*return*/];
                }
            });
        }); }
    },
    ScoreboardColumn: {
        player: function (parent) { return userModel_1.default.findById(parent.player, '-password'); }
    },
    InTurnPlayer: {
        player: function (parent) { return userModel_1.default.findById(parent.player, '-password'); }
    },
    ChatMessage: {
        user: function (parent) { return userModel_1.default.findById(parent.user, '-password'); }
    },
    Subscription: {
        userDataChanged: {
            subscribe: function (_parent, args) { return pubsub_1.default.asyncIterator([args.username]); }
        }
    }
};
