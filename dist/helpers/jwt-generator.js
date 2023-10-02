"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JWT_Generator {
    static generate(payload) {
        return this.jwt.sign(payload, this.secret, { expiresIn: '4h' });
    }
}
JWT_Generator.jwt = require('jsonwebtoken');
JWT_Generator.secret = process.env.SECRET_KEY;
exports.default = JWT_Generator;
