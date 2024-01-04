const jsonwebtoken = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    let token = null;

    // Verificar si el encabezado tiene el formato "Bearer TOKEN"
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No token found in the request'
        });
    }

    try {
        // Verificar el token y extraer el usuario
        const {user} = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        // Asignar valores al objeto "req" para usar en rutas posteriores
        req.usuario = user;
        //req.empresaId = usuario.empresaId;   
         
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        });
    }
}

module.exports = {
    validarJWT
};
