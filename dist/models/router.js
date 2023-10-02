"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouter = void 0;
const express_1 = require("express");
class BaseRouter {
    constructor(TController, UMiddleware, singularURL, pluralURL) {
        this.singularURL = singularURL;
        this.pluralURL = pluralURL;
        this.router = (0, express_1.Router)();
        this.controller = new TController();
        this.middleware = new UMiddleware();
        this.routes();
    }
    routes() { }
}
exports.BaseRouter = BaseRouter;
