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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../models/server");
const database_1 = require("../config/database");
const server = new server_1.Server();
let token = "";
let lastUserId = 0;
let usersQ = 0;
let lastTasksInsertedId = 0;
let firstUserId = 0;
const firstUser = {
    name: "Javier Retondo",
    email: "jretondo@gmail.com",
    password: "12345678",
    role: "ADMIN_ROLE"
};
const secondUser = {
    name: "Javier Retondo",
    email: "jretondo@gmail.com",
    password: "12345678",
    role: "ADMIN_ROLE"
};
const newTask = {
    name: "nueva tarea",
    description: "Esta es una nueva description"
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.sequelize.sync({ force: true });
}));
describe('POST /user/first', function () {
    it('Crea el primer usuario. Si la base de datos está vacía. Deebería devolver status 200 y la insersión.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .post('/api/user/first')
                .send(firstUser);
            console.log('response :>> ', response.body);
            lastUserId = response.body.body.id;
            firstUserId = response.body.body.id;
            expect(response.status).toEqual(201);
            expect(response.body.body).toBeInstanceOf(Object);
        });
    });
    it('Como ya está creado el primer usuario. No debería permitir crear otro sin el correspondiente token.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .post('/api/user/first')
                .send(secondUser);
            lastUserId = response.body.body.id;
            expect(response.status).toEqual(401);
            expect(response.body.body.errors).toBeInstanceOf(Array);
        });
    });
});
describe('POST /auth/login', function () {
    it('Nos logueamos con el primer usuario para obtener el token. Tiene que devolver status 200 y el token', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .post('/api/auth/login')
                .send(firstUser);
            expect(response.status).toEqual(200);
            token = response.body.body.token;
            expect(response.body.body.token).not.toBeNull();
        });
    });
});
