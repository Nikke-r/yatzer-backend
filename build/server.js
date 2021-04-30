"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var apollo_server_express_1 = require("apollo-server-express");
var dbConnection_1 = __importDefault(require("./database/dbConnection"));
var typeDefs_1 = __importDefault(require("./graphql/typeDefs"));
var resolvers_1 = __importDefault(require("./graphql/resolvers"));
var authentication_1 = require("./passport/authentication");
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var helmet_1 = __importDefault(require("helmet"));
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, server, production, localhost, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, dbConnection_1.default()];
            case 1:
                _a.sent();
                app = express_1.default();
                app.use(cors_1.default());
                app.use(helmet_1.default({
                    ieNoOpen: false,
                    contentSecurityPolicy: false
                }));
                app.use("/public/avatars", express_1.default.static(path_1.default.join(__dirname, "public/avatars")));
                server = new apollo_server_express_1.ApolloServer({
                    typeDefs: typeDefs_1.default,
                    resolvers: resolvers_1.default,
                    context: function (_a) {
                        var req = _a.req, res = _a.res, connection = _a.connection;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var user, error_2;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 4, , 5]);
                                        if (!connection) return [3 /*break*/, 1];
                                        return [2 /*return*/, connection.context];
                                    case 1: return [4 /*yield*/, authentication_1.checkAuthentication(req, res)];
                                    case 2:
                                        user = _b.sent();
                                        return [2 /*return*/, {
                                                req: req,
                                                res: res,
                                                user: user
                                            }];
                                    case 3: return [3 /*break*/, 5];
                                    case 4:
                                        error_2 = _b.sent();
                                        return [2 /*return*/, null];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        });
                    },
                });
                return [4 /*yield*/, server.start()];
            case 2:
                _a.sent();
                server.applyMiddleware({ app: app, cors: false, path: '/graphql' });
                process.env.NODE_ENV = process.env.NODE_ENV || 'development';
                if (!(process.env.NODE_ENV === 'production')) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('./security/production')); })];
            case 3:
                production = (_a.sent()).default;
                production(app, (process.env.PORT || 3001), server);
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('./security/localhost')); })];
            case 5:
                localhost = (_a.sent()).default;
                localhost(app, 8000, 3001, server);
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_1 = _a.sent();
                console.log("Error while starting the server: " + error_1.message);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); })();
