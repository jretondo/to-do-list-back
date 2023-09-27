const jwt = require('jsonwebtoken');

const generarJWT = (userData = {}) => {

    return new Promise((resolve, reject) => {

        const payload = { userData };

        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '4h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el token')
            } else {
                resolve(token);
            }
        })
    })
}

module.exports = {
    generarJWT
}