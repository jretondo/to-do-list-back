"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_RESTRICTION = exports.ROLES = void 0;
var ROLES;
(function (ROLES) {
    ROLES["ADMIN_ROLE"] = "ADMIN_ROLE";
    ROLES["USER_ROLE"] = "USER_ROLE";
})(ROLES = exports.ROLES || (exports.ROLES = {}));
var DB_RESTRICTION;
(function (DB_RESTRICTION) {
    DB_RESTRICTION["CASCADE"] = "CASCADE";
    DB_RESTRICTION["RESTRICT"] = "RESTRICT";
    DB_RESTRICTION["NO_ACTION"] = "NO ACTION";
    DB_RESTRICTION["SET_NULL"] = "SET NULL";
    DB_RESTRICTION["SET_DEFAULT"] = "SET DEFAULT";
})(DB_RESTRICTION = exports.DB_RESTRICTION || (exports.DB_RESTRICTION = {}));
