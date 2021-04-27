"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthentication = exports.login = void 0;
var strategies_1 = __importDefault(require("./strategies"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var login = function (req, res) {
    return new Promise(function (resolve, reject) {
        strategies_1.default.authenticate('local', { session: false }, function (error, user, info) {
            if (error || !user)
                reject(info.message);
            req.login(user, { session: false }, function (error) {
                if (error)
                    reject(error);
                if (process.env.JWT_SECRET) {
                    var token = jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET);
                    resolve({ user: user, token: token });
                }
            });
        })(req, res);
    });
};
exports.login = login;
var checkAuthentication = function (req, res) {
    return new Promise(function (resolve, _reject) {
        strategies_1.default.authenticate('jwt', function (error, user) {
            if (error)
                resolve(false);
            resolve(user);
        })(req, res);
    });
};
exports.checkAuthentication = checkAuthentication;
