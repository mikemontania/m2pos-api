const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const generarJWTInfinito = async (id) => {
    try {
        const user = await Usuario.findByPk(id, {
            attributes: {
                exclude: ['password', 'bloqueado', 'intentos', 'activo']
            }
        });

        const payload = { user };

        // 🔹 Sin "expiresIn" → el token nunca expira
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return token;
    } catch (error) {
        console.error(error);
        throw new Error('Error generating perpetual JWT');
    }
};

module.exports = {
    generarJWTInfinito,
};