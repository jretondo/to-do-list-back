import request from 'supertest';
import { Server } from '../models/server';
import { sequelize } from '../config/database';

const server = new Server();

let token = ""
let lastUserId = 0
let usersQ = 0
let lastTasksInsertedId = 0
let firstUserId = 0

const firstUser = {
    name: "Javier Retondo",
    email: "jretondo@gmail.com",
    password: "12345678",
    role: "ADMIN_ROLE"
}

const secondUser = {
    name: "Javier Retondo",
    email: "jretondo@gmail.com",
    password: "12345678",
    role: "ADMIN_ROLE"
}

const newTask = {
    name: "nueva tarea",
    description: "Esta es una nueva description"
}

beforeAll(async () => {
    await sequelize.sync({ force: true })
});

describe('POST /user/first', function () {
    it('Crea el primer usuario. Si la base de datos está vacía. Deebería devolver status 200 y la insersión.', async function () {

        const response = await request(server.app)
            .post('/api/user/first')
            .send(firstUser)
        console.log('response :>> ', response.body);
        lastUserId = response.body.body.id
        firstUserId = response.body.body.id
        expect(response.status).toEqual(201);
        expect(response.body.body).toBeInstanceOf(Object)
    });

    it('Como ya está creado el primer usuario. No debería permitir crear otro sin el correspondiente token.', async function () {

        const response = await request(server.app)
            .post('/api/user/first')
            .send(secondUser)
        lastUserId = response.body.body.id
        expect(response.status).toEqual(401);
        expect(response.body.body.errors).toBeInstanceOf(Array);
    });
});

describe('POST /auth/login', function () {
    it('Nos logueamos con el primer usuario para obtener el token. Tiene que devolver status 200 y el token', async function () {

        const response = await request(server.app)
            .post('/api/auth/login')
            .send(firstUser)
        expect(response.status).toEqual(200);
        token = response.body.body.token
        expect(response.body.body.token).not.toBeNull();
    });
});
