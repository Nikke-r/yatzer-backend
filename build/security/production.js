"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
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
    var httpServer = http_1.default.createServer(app);
    server.installSubscriptionHandlers(httpServer);
    httpServer.listen(port, function () { return console.log('Server running!'); });
});
