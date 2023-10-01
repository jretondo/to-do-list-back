class DBValidator {
    private static User = require("../api/components/users/user.model");

    static emailIsInDB = async (email = '') => {
        const userByEmail = await this.User.findOne({ where: { email } });
        if (userByEmail) {
            throw new Error(`El correo: ${email}, ya está registrado`);
        }
    }

    static emailIsNotInDB = async (email = '') => {
        const userByEmail = await this.User.findOne({ where: { email } });
        if (!userByEmail) {
            throw new Error(`El correo: ${email}, no está registrado`);
        }
    }

    static thereAreUsers = async () => {
        const users = await this.User.findAll();
        if (users.length > 0) {
            throw new Error(`Ya existen usuarios registrado!`);
        }
    }

    static usersById = async (id: number) => {
        const user = await this.User.findByPk(id);
        if (!user) {
            throw new Error(`El id ${id} no existe`);
        }
    }

    static taskById = async (id: number) => {

    }
}

export default DBValidator;