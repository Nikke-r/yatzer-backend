"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (app, port) {
    app.enable('trust proxy');
    app.use(function (req, res, next) {
        if (req.secure) {
            next();
        }
        else {
            res.redirect("https://" + req.headers.host + req.url);
        }
    });
    app.listen(port, function () { return console.log('Server running!'); });
});
