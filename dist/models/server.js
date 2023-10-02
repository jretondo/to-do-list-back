"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const user_router_1 = require("../api/components/users/user.router");
const config_1 = require("../config/config");
const tasks_router_1 = require("../api/components/tasks/tasks.router");
const auth_router_1 = require("../api/components/auth/auth.router");
const database_1 = require("../config/database");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const responses_1 = require("../network/responses");
class Server extends config_1.ConfigServer {
    constructor() {
        super();
        this.port = this.getNumberEnvironment('PORT');
        this.handleConn = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.sequelize.authenticate();
                yield database_1.sequelize.sync();
                console.log('Base de datos conectada con éxito!');
            }
            catch (error) {
                console.error('No se ha podido conectar a la base de datos. Error:', error);
            }
        });
        this.app = (0, express_1.default)();
        this.handleConn();
        this.config();
        this.routes();
    }
    config() {
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/api', this.routers());
        this.app.use('/api/documentation', swagger_ui_express_1.default.serve);
        this.app.use('/api/documentation', swagger_ui_express_1.default.setup(require("../../public/documentation/swagger.json")));
        this.app.use((err, req, res, next) => (0, responses_1.error)({ req, res, body: err.toString(), status: 500 }));
        this.app.use('*', (req, res) => {
            res.status(404).sendFile(path_1.default.join(__dirname, '..', '..', 'public', 'pages', 'error404.html'));
        });
    }
    routers() {
        return [
            new user_router_1.UserRouter().router,
            new tasks_router_1.TaskRouter().router,
            new auth_router_1.AuthRouter().router
        ];
    }
    start() {
        this.app.listen(this.port, () => {
            console.log('Server on port', this.port);
        });
    }
}
exports.Server = Server;
