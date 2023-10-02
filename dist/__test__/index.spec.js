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
    it('Tiene que devolver status 401 y avisar que el email es obligatorio', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .post('/api/auth/login')
                .send({ password: "654321" });
            expect(response.status).toEqual(401);
            expect(response.body.body.errors).toBeInstanceOf(Array);
        });
    });
    it('Tiene que devolver status 400 y avisar que el usuario o contraseña no son correctos', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .post('/api/auth/login')
                .send({
                email: firstUser.email,
                password: "121231"
            });
            expect(response.status).toEqual(401);
        });
    });
});
describe('GET /users', function () {
    it('Tiene que devolver codigo de status 200 y una colección de array', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .get('/api/users');
            usersQ = response.body.body.length;
            expect(response.status).toEqual(200);
            expect(response.body.body).toBeInstanceOf(Array);
        });
    });
});
describe('POST /user', function () {
    it('Tiene que devolver codigo de status 201 y devolver la nueva insersión', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                name: usersQ + "nuevo_ususario",
                email: usersQ + firstUser.email,
                password: firstUser.password,
                role: "ADMIN_ROLE"
            };
            const response = yield (0, supertest_1.default)(server.app)
                .post('/api/user')
                .set('authorization', token)
                .send(data);
            lastUserId = response.body.body.id;
            expect(response.status).toEqual(201);
            expect(response.body.body).toBeInstanceOf(Object);
        });
    });
    it('Se repite un email. Tiene que devolver código de status 401 y devolver el error', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                name: usersQ + "nuevo_ususario",
                email: usersQ + firstUser.email,
                password: firstUser.password,
                role: "ADMIN_ROLE"
            };
            const response = yield (0, supertest_1.default)(server.app)
                .post('/api/user')
                .set('authorization', token)
                .send(data);
            expect(response.status).toEqual(401);
        });
    });
});
describe('PUT /user', function () {
    it('Tiene que devolver codigo de status 200', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                name: usersQ + "nuevo_ususario_2",
                password: firstUser.password,
                role: "USER_ROLE"
            };
            const response = yield (0, supertest_1.default)(server.app)
                .put('/api/user/' + lastUserId)
                .set('authorization', token)
                .send(data);
            expect(response.status).toEqual(200);
            expect(response.body.body).toMatch(/Modificado/);
        });
    });
    it('No se envía el token. Debería dar status 401 y el mensaje de error.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                name: usersQ + "nuevo_ususario_2",
                password: firstUser.password,
                role: "ADMIN_ROLE"
            };
            const response = yield (0, supertest_1.default)(server.app)
                .put('/api/user/' + lastUserId)
                .send(data);
            expect(response.status).toEqual(401);
            expect(response.body.body).toMatch(/No se envió ningún toke/);
        });
    });
});
describe('POST /auth/login', function () {
    it('Se loguea con el nuevo ususario que posee USER_ROL por la última modificación.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = {
                email: usersQ + firstUser.email,
                password: firstUser.password,
            };
            const response = yield (0, supertest_1.default)(server.app)
                .post('/api/auth/login')
                .send(newUser);
            expect(response.status).toEqual(200);
            token = response.body.body.token;
            expect(response.body.body.token).not.toBeNull();
        });
    });
});
describe('DELETE /user', function () {
    it('Ahora se usa un token de un usuario con permisos de "USER_ROL". Debería devolver status 401.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .delete('/api/user/' + lastUserId)
                .set('authorization', token)
                .send();
            expect(response.status).toEqual(401);
            expect(response.body.body).toMatch(/requiere uno de estos roles ADMIN_ROL/);
        });
    });
});
describe('POST /auth/login', function () {
    it('Se loguea nuevamente con el usuario de rol ADMIN_ROL. Debería poder eliminar el otro usuario y envíar codigo 200.', function () {
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
describe('DELETE /user', function () {
    it('Tiene que devolver codigo de status 200 y devolver mensaje de eliminación correcta', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .delete('/api/user/' + lastUserId)
                .set('authorization', token)
                .send();
            expect(response.status).toEqual(200);
            expect(response.body.body).toMatch(/Eliminado/);
        });
    });
});
describe('POST /task', function () {
    it('Tiene que devolver codigo de status 201 y el elemento insertado', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .post('/api/task')
                .set('authorization', token)
                .send(newTask);
            lastTasksInsertedId = response.body.body.id;
            expect(response.status).toEqual(201);
            expect(response.body.body).toBeInstanceOf(Object);
            expect(response.body.body.description).toMatch(/Esta es una nueva description/);
        });
    });
    it('Tiene que devolver codigo de status 401 y mensaje de error (falta de parametros)', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .post('/api/task')
                .set('authorization', token)
                .send({ description: newTask.description });
            expect(response.status).toEqual(401);
            expect(response.body.body.errors).toBeInstanceOf(Array);
        });
    });
});
describe('GET /tasks', function () {
    it('Tiene que devolver codigo de status 200 y una colección de tareas', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .get('/api/tasks')
                .set('authorization', token)
                .send();
            expect(response.status).toEqual(200);
            expect(response.body.body).toBeInstanceOf(Array);
        });
    });
    it('Tiene que devolver codigo de status 200 y una colección de tareas con datos para la paginación. Se debe envíar la página', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .get('/api/tasks/paginated/' + 1)
                .set('authorization', token)
                .send();
            expect(response.status).toEqual(200);
            expect(response.body.body).toBeInstanceOf(Object);
            expect(response.body.body.showedItems).toBeInstanceOf(Array);
            expect(response.body.body.totalItems).toBeGreaterThan(0);
            expect(response.body.body.itemsPerPage).toBeGreaterThan(0);
        });
    });
});
describe('PUT /task', function () {
    it('Tiene que devolver codigo de status 200 y mensaje de modificación correcta', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .put('/api/task/' + lastTasksInsertedId)
                .set('authorization', token)
                .send({ description: "nueva description " + lastTasksInsertedId });
            expect(response.status).toEqual(200);
            expect(response.body.body).toMatch(/Modificado/);
        });
    });
});
describe('GET /task', function () {
    it('Tiene que devolver codigo de status 200 y la ultima tarea modificada. Se controla que haya sido modificada correctamente.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .get('/api/task/' + lastTasksInsertedId)
                .set('authorization', token)
                .send();
            expect(response.status).toEqual(200);
            expect(response.body.body.description).toMatch("nueva description " + lastTasksInsertedId);
        });
    });
});
describe('DELETE /task', function () {
    it('Tiene que devolver codigo de status 200 y mensaje de eliminación correcta.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .delete('/api/task/' + lastTasksInsertedId)
                .set('authorization', token)
                .send();
            expect(response.status).toEqual(200);
            expect(response.body.body).toMatch(/Eliminado/);
        });
    });
});
describe('DELETE /user', function () {
    it('Eliminamos el primer usuario de la tabla usuarios. Tiene que devolver codigo de status 200 y devolver mensaje de eliminación correcta', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .delete('/api/user/' + firstUserId)
                .set('authorization', token)
                .send();
            expect(response.status).toEqual(200);
            expect(response.body.body).toMatch(/Eliminado/);
        });
    });
});
describe('GET /users', function () {
    it('Tiene que devolver codigo de status 200 y una colección de array vacio. La tabla debería estar vacía.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server.app)
                .get('/api/users');
            usersQ = response.body.body.length;
            expect(response.status).toEqual(200);
            expect(response.body.body).toBeInstanceOf(Array);
        });
    });
});
