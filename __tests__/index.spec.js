const request = require("supertest");
require('dotenv').config();
const Server = require("../src/api/app");

let token = ""
let idUltimoUsuario = 0
let cantidadUsuarios = 0
let lastTareaIdInserted = 0
let idPrimerUsuario = 0

const primerUsuario = {
    nombre: "Javier Retondo",
    correo: "jretondo@gmail.com",
    password: "123456",
    rol: "ADMIN_ROL"
}

const nuevaTarea = {
    nombre: "nueva tarea",
    descripcion: "Esta es una nueva descripcion"
}

describe('POST /usuarios/primer', function () {
    it('Crea el primer usuario. Si la base de datos está vacía. Deebería devolver status 200 y la insersión.', async function () {

        const response = await request(Server.app)
            .post('/api/usuarios/primer')
            .send(primerUsuario)
        idUltimoUsuario = response.body.body.id
        idPrimerUsuario = response.body.body.id
        expect(response.status).toEqual(201);
        expect(response.body.body).toBeInstanceOf(Object)
    });

    it('Como ya está creado el primer usuario. No debería permitir crear otro sin el correspondiente token.', async function () {

        const response = await request(Server.app)
            .post('/api/usuarios/primer')
            .send({ correo: "_" + primerUsuario.correo, ...primerUsuario })
        idUltimoUsuario = response.body.body.id
        expect(response.status).toEqual(401);
        expect(response.body.body.errors).toBeInstanceOf(Array);
    });
});

describe('POST /auth/login', function () {
    it('Nos logueamos con el primer usuario para obtener el token. Tiene que devolver status 200 y el token', async function () {

        const response = await request(Server.app)
            .post('/api/auth/login')
            .send(primerUsuario)
        expect(response.status).toEqual(200);
        token = response.body.body.token
        expect(response.body.body.token).not.toBeNull();
    });

    it('Tiene que devolver status 401 y avisar que el correo es obligatorio', async function () {

        const response = await request(Server.app)
            .post('/api/auth/login')
            .send({ password: "654321" })
        expect(response.status).toEqual(401);
        expect(response.body.body.errors).toBeInstanceOf(Array);
        expect(response.body.body.errors.filter(error => error.param === "correo").length).toBeGreaterThan(0);
    });

    it('Tiene que devolver status 400 y avisar que el usuario o contraseña no son correctos', async function () {

        const response = await request(Server.app)
            .post('/api/auth/login')
            .send({
                correo: primerUsuario.correo,
                password: "121231"
            })
        expect(response.status).toEqual(400);
        expect(response.body.body).toMatch(/no son correctos/);
    });
});

describe('GET /usuarios', function () {
    it('Tiene que devolver codigo de status 200 y una colección de array', async function () {
        const response = await request(Server.app)
            .get('/api/usuarios')
        cantidadUsuarios = response.body.body.length
        expect(response.status).toEqual(200);
        expect(response.body.body).toBeInstanceOf(Array)
    });
});

describe('POST /usuarios', function () {
    it('Tiene que devolver codigo de status 201 y devolver la nueva insersión', async function () {
        const data = {
            nombre: cantidadUsuarios + "nuevo_ususario",
            correo: cantidadUsuarios + primerUsuario.correo,
            password: primerUsuario.password,
            rol: "ADMIN_ROL"
        }
        const response = await request(Server.app)
            .post('/api/usuarios')
            .set('authorization', token)
            .send(data)
        idUltimoUsuario = response.body.body.id
        expect(response.status).toEqual(201);
        expect(response.body.body).toBeInstanceOf(Object)
    });

    it('Se repite un email. Tiene que devolver código de status 401 y devolver el error', async function () {
        const data = {
            nombre: cantidadUsuarios + "nuevo_ususario",
            correo: cantidadUsuarios + primerUsuario.correo,
            password: primerUsuario.password,
            rol: "ADMIN_ROL"
        }

        const response = await request(Server.app)
            .post('/api/usuarios')
            .set('authorization', token)
            .send(data)
        expect(response.status).toEqual(401);
        expect(response.body.body.errors.filter(error => error.param === "correo").length).toBeGreaterThan(0);
    });
});

describe('PUT /usuarios', function () {
    it('Tiene que devolver codigo de status 200', async function () {
        const data = {
            nombre: cantidadUsuarios + "nuevo_ususario_2",
            password: primerUsuario.password,
            rol: "USER_ROL"
        }
        const response = await request(Server.app)
            .put('/api/usuarios/' + idUltimoUsuario)
            .set('authorization', token)
            .send(data)
        expect(response.status).toEqual(200);
        expect(response.body.body).toMatch(/Modificado/);
    });

    it('No se envía el token. Debería dar status 401 y el mensaje de error.', async function () {
        const data = {
            nombre: cantidadUsuarios + "nuevo_ususario_2",
            password: primerUsuario.password,
            rol: "ADMIN_ROL"
        }
        const response = await request(Server.app)
            .put('/api/usuarios/' + idUltimoUsuario)
            .send(data)
        expect(response.status).toEqual(401);
        expect(response.body.body).toMatch(/Token no/);
    });
});

describe('POST /auth/login', function () {
    it('Se loguea con el nuevo ususario que posee USER_ROL por la última modificación.', async function () {
        const nuevoUsuario = {
            correo: cantidadUsuarios + primerUsuario.correo,
            password: primerUsuario.password,
        }
        const response = await request(Server.app)
            .post('/api/auth/login')
            .send(nuevoUsuario)
        expect(response.status).toEqual(200);
        token = response.body.body.token
        expect(response.body.body.token).not.toBeNull();
    });
});

describe('DELETE /usuarios', function () {
    it('Ahora se usa un token de un usuario con permisos de "USER_ROL". Debería devolver status 401.', async function () {

        const response = await request(Server.app)
            .delete('/api/usuarios/' + idUltimoUsuario)
            .set('authorization', token)
            .send()
        expect(response.status).toEqual(401);
        expect(response.body.body).toMatch(/requiere uno de estos roles ADMIN_ROL/);
    });
});

describe('POST /auth/login', function () {
    it('Se loguea nuevamente con el usuario de rol ADMIN_ROL. Debería poder eliminar el otro usuario y envíar codigo 200.', async function () {

        const response = await request(Server.app)
            .post('/api/auth/login')
            .send(primerUsuario)
        expect(response.status).toEqual(200);
        token = response.body.body.token
        expect(response.body.body.token).not.toBeNull();
    });
});

describe('DELETE /usuarios', function () {
    it('Tiene que devolver codigo de status 200 y devolver mensaje de eliminación correcta', async function () {

        const response = await request(Server.app)
            .delete('/api/usuarios/' + idUltimoUsuario)
            .set('authorization', token)
            .send()
        expect(response.status).toEqual(200);
        expect(response.body.body).toMatch(/Eliminado/);
    });
});

describe('POST /tareas', function () {
    it('Tiene que devolver codigo de status 201 y el elemento insertado', async function () {

        const response = await request(Server.app)
            .post('/api/tareas')
            .set('authorization', token)
            .send(nuevaTarea)
        lastTareaIdInserted = response.body.body.id
        expect(response.status).toEqual(201);
        expect(response.body.body).toBeInstanceOf(Object);
        expect(response.body.body.descripcion).toMatch(/Esta es una nueva descripcion/);
    });
    it('Tiene que devolver codigo de status 401 y mensaje de error (falta de parametros)', async function () {

        const response = await request(Server.app)
            .post('/api/tareas')
            .set('authorization', token)
            .send({ descripcion: nuevaTarea.descripcion })
        expect(response.status).toEqual(401);
        expect(response.body.body.errors).toBeInstanceOf(Array);
        expect(response.body.body.errors.filter(error => error.param === "nombre").length).toBeGreaterThan(0);
    });
});

describe('GET /tareas', function () {
    it('Tiene que devolver codigo de status 200 y una colección de tareas', async function () {
        const response = await request(Server.app)
            .get('/api/tareas')
            .set('authorization', token)
            .send()
        expect(response.status).toEqual(200);
        expect(response.body.body).toBeInstanceOf(Array);
    });
    it('Tiene que devolver codigo de status 200 y una colección de tareas con datos para la paginación. Se debe envíar la página', async function () {
        const response = await request(Server.app)
            .get('/api/tareas/paginacion/' + 1)
            .set('authorization', token)
            .send()
        expect(response.status).toEqual(200);
        expect(response.body.body).toBeInstanceOf(Object);
        expect(response.body.body.showedItems).toBeInstanceOf(Array);
        expect(response.body.body.totalItems).toBeGreaterThan(0);
        expect(response.body.body.itemsPerPage).toBeGreaterThan(0);
    });
});

describe('PUT /tareas', function () {
    it('Tiene que devolver codigo de status 200 y mensaje de modificación correcta', async function () {
        const response = await request(Server.app)
            .put('/api/tareas/' + lastTareaIdInserted)
            .set('authorization', token)
            .send({ descripcion: "nueva descripcion " + lastTareaIdInserted })
        expect(response.status).toEqual(200);
        expect(response.body.body).toMatch(/Modificado/);
    });
});

describe('GET /tareas', function () {
    it('Tiene que devolver codigo de status 200 y la ultima tarea modificada. Se controla que haya sido modificada correctamente.', async function () {
        const response = await request(Server.app)
            .get('/api/tareas/' + lastTareaIdInserted)
            .set('authorization', token)
            .send()
        expect(response.status).toEqual(200);
        expect(response.body.body.descripcion).toMatch("nueva descripcion " + lastTareaIdInserted);
    });
});

describe('DELETE /tareas', function () {
    it('Tiene que devolver codigo de status 200 y mensaje de eliminación correcta.', async function () {
        const response = await request(Server.app)
            .delete('/api/tareas/' + lastTareaIdInserted)
            .set('authorization', token)
            .send()
        expect(response.status).toEqual(200);
        expect(response.body.body).toMatch(/Eliminado/);
    });
});

describe('GET /tareas', function () {
    it('Tiene que devolver codigo de status 401 y mensaje de error diciendo que no éxiste ese id.', async function () {
        const response = await request(Server.app)
            .get('/api/tareas/' + lastTareaIdInserted)
            .set('authorization', token)
            .send()
        expect(response.status).toEqual(401);
        expect(response.body.body.errors).toBeInstanceOf(Array);
        expect(response.body.body.errors.filter(error => error.msg === `El id ${lastTareaIdInserted} no existe`).length).toBeGreaterThan(0);
    });
});

describe('DELETE /usuarios', function () {
    it('Eliminamos el primer usuario de la tabla usuarios. Tiene que devolver codigo de status 200 y devolver mensaje de eliminación correcta', async function () {

        const response = await request(Server.app)
            .delete('/api/usuarios/' + idPrimerUsuario)
            .set('authorization', token)
            .send()
        expect(response.status).toEqual(200);
        expect(response.body.body).toMatch(/Eliminado/);
    });
});

describe('GET /usuarios', function () {
    it('Tiene que devolver codigo de status 200 y una colección de array vacio. La tabla debería estar vacía.', async function () {
        const response = await request(Server.app)
            .get('/api/usuarios')
        cantidadUsuarios = response.body.body.length
        expect(response.status).toEqual(200);
        expect(response.body.body).toBeInstanceOf(Array)
        expect(response.body.body.length).toEqual(0)
    });
});