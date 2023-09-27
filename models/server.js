const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            tareas: '/api/tareas',
            usuarios: '/api/usuarios',
        }

        this.handleConn();
        this.middlewares();
        this.routes();
    }

    handleConn = async () => {
        try {
            await dbConnection.authenticate();
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
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.auth, require('../routes/auth'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}

module.exports = Server;
