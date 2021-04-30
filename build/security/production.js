"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = __importDefault(require("https"));
exports.default = (function (app, port, server) {
    app.enable('trust proxy');
    app.use(function (req, res, next) {
        if (req.secure) {
            next();
        }
        else {
            res.redirect("https://" + req.headers.host + req.url);
        }
    });
    var httpsServer = https_1.default.createServer(app);
    server.installSubscriptionHandlers(httpsServer);
    httpsServer.listen(port, function () { return console.log('Server running!'); });
});
