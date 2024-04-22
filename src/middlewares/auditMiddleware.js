const { sequelize } = require("../../dbconfig");
const Auditoria = require("../models/auditoria.model");
const auditMiddleware = async (req, res, next) => {
    try {
        // Acceder a la información de la solicitud
        const { usuario } = req;
        const { method, originalUrl, params, body,   headers } = req;

        // Capturar la IP del cliente
        const ipCliente = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        // Capturar el tiempo de inicio de la solicitud
        const inicioSolicitud = Date.now();

  
        // Listener para capturar el estado final de la respuesta y otros detalles
        res.on('finish', async () => {
            const finSolicitud = Date.now();
            const { statusCode ,statusMessage} = res;

            try {
                await Auditoria.create({
                    empresaId: usuario.empresaId,
                    usuarioId: usuario.id,
                    metodo: method,
                    path: originalUrl,
                    entidadId: params.id,
                    headers: { ...headers },
                    detalles: { ...body },
                     status: statusCode,
                     mensaje: statusMessage,
                     ipCliente,
                    inicioSolicitud,
                    finSolicitud
                });
            } catch (error) {
                console.error("Error al guardar en la tabla de auditoría:", error);
            }

            // Visualizar el objeto res en el log
            console.log("res: =>", res.locals.msg);
        });

        // Llamamos a next para continuar con el procesamiento de la solicitud
        next();
    } catch (error) {
        console.error("Error en el middleware de auditoría:", error);
        next(error);
    }
};

module.exports = {
    auditMiddleware
};
