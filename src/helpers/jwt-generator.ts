import { DecodedToken } from "../common/interfaces";

class JWT_Generator {
    private static jwt = require('jsonwebtoken');
    private static secret = process.env.SECRET_KEY;

    static generate(payload: DecodedToken): string {
        return this.jwt.sign(payload, this.secret, { expiresIn: '4h' });
    }
}

export default JWT_Generator;