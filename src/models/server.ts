import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { UserRouter } from '../api/components/users/user.router';
import { ConfigServer } from '../config/config';
import { TaskRouter } from '../api/components/tasks/tasks.router';
import { AuthRouter } from '../api/components/auth/auth.router';
import { sequelize } from '../config/database';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { error } from '../network/responses';

export class Server extends ConfigServer {
    public app: express.Application;
    public port: number = this.getNumberEnvironment('PORT');
    constructor() {
        super();
        this.app = express();
        this.handleConn();
        this.config();
        this.routes();
    }

    config() {
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/api', this.routers());
        this.app.use('/api/documentation', swaggerUi.serve);
        this.app.use('/api/documentation', swaggerUi.setup(require("../../public/documentation/swagger.json")));
        this.app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => error({ req, res, body: err.toString(), status: 500 }))
        this.app.use('*', (req, res) => {
            res.status(404).sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'error404.html'));
        })
    }

    routers(): Array<express.Router> {
        return [
            new UserRouter().router,
            new TaskRouter().router,
            new AuthRouter().router
        ]
    }

    handleConn = async () => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            console.log('Base de datos conectada con éxito!');
        } catch (error) {
            console.error('No se ha podido conectar a la base de datos. Error:', error);
        }
    }

    start() {
        this.app.listen(this.port, () => {
            console.log('Server on port', this.port);
        });
    }
}