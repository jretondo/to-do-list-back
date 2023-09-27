const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');
const { error } = require("../network/response")

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../api/document.json');
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            tareas: '/api/tareas',
            usuarios: '/api/usuarios',
            documentacion: '/api/documentacion'
        }

        this.handleConn();
        this.middlewares();
        this.routes();
    }

    handleConn = async () => {
        try {
            await dbConnection.authenticate();
            //dbConnection.sync({ alter: true })
            console.log('Base de datos conectada con éxito!');
        } catch (error) {
            console.error('No se ha podido conectar a la base de datos. Error:', error);
        }
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.usuarios, require('../api/components/usuarios/routes'));
        this.app.use(this.paths.auth, require('../api/components/auth/routes'));
        this.app.use(this.paths.tareas, require('../api/components/tareas/routes'));
        this.app.use(this.paths.documentacion, swaggerUi.serve);
        this.app.use(this.paths.documentacion, swaggerUi.setup(swaggerDocument));
        this.app.use((err, req, res, next) => error({ req, res, body: err.message }))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}

module.exports = Server;
