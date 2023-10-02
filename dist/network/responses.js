"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.success = void 0;
class Responses {
    constructor() {
        this.success = (props) => {
            props.res.status(props.status || 200).send({
                error: false,
                status: props.status || 200,
                body: props.body || ""
            });
        };
        this.error = (props) => {
            props.res.status(props.status || 500).send({
                error: true,
                status: props.status || 500,
                body: props.body || ""
            });
        };
    }
}
_a = new Responses(), exports.success = _a.success, exports.error = _a.error;
