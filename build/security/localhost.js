"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = __importDefault(require("https"));
var http_1 = __importDefault(require("http"));
var fs_1 = __importDefault(require("fs"));
var sslKey = fs_1.default.readFileSync('../ssl-key.pem');
var sslCert = fs_1.default.readFileSync('../ssl-cert.pem');
var options = {
    key: sslKey,
    cert: sslCert,
};
var httpRedirect = function (req, res) {
    res.writeHead(301, { 'location': "https://localhost:8000" + req.url });
    res.end();
};
exports.default = (function (app, httpsPort, httpPort, server) {
    var httpsServer = https_1.default.createServer(options, app);
    var httpServer = http_1.default.createServer(httpRedirect);
    server.installSubscriptionHandlers(httpsServer);
    server.installSubscriptionHandlers(httpServer);
    httpsServer.listen(httpsPort);
    httpServer.listen(httpPort);
});
