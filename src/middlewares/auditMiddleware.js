const { Client } = require("pg");
const { sequelize } = require("../../dbconfig");
const Auditoria = require("../models/auditoria.model");
const Banco = require("../models/banco.model");
const Categoria = require("../models/categoria.model");
const Presentacion = require("../models/presentacion.model");
const Usuario = require("../models/usuario.model");
const Cliente = require("../models/cliente.model");
const Empresa = require("../models/empresa.model");
const CondicionPago = require("../models/condicionPago.model");
const Producto = require("../models/producto.model");
const Valoracion = require("../models/valoracion.model");
const Variante = require("../models/variante.model");
const Variedad = require("../models/variedad.model");
const ListaPrecio = require("../models/listaPrecio.model");
const MedioPago = require("../models/medioPago.model");
const Documento = require("../models/documento.model");
const Marca = require("../models/marca.model");
const SubCategoria = require("../models/subCategoria.model");
const Sucursal = require("../models/sucursal.model");
const Numeracion = require("../models/numeracion.model");
const Unidad = require("../models/unidad.model");
const routeToModelMap = {
  '/M2POS/auditorias': Auditoria,
  '/M2POS/auth': Usuario,
  '/M2POS/bancos': Banco,
  '/M2POS/usuarios': Usuario,
  '/M2POS/categorias': Categoria,
  '/M2POS/presentaciones': Presentacion,
  '/M2POS/clientes': Cliente, 
  '/M2POS/empresas': Empresa,
  '/M2POS/forma-documento': CondicionPago,
  '/M2POS/productos': Producto,
  '/M2POS/valoraciones': Valoracion,
  '/M2POS/variantes': Variante,
  '/M2POS/variedades': Variedad,
  '/M2POS/lista-precio': ListaPrecio,
  '/M2POS/medio-pago': MedioPago,
  '/M2POS/documentos': Documento,
  '/M2POS/marcas': Marca,
  '/M2POS/subcategorias': SubCategoria,
  '/M2POS/sucursales': Sucursal,
  '/M2POS/numeraciones': Numeracion,
  '/M2POS/unidades': Unidad, 
  '/M2POS/uploads/productos':Variante,
  '/M2POS/uploads/usuarios':Usuario,
  '/M2POS/uploads/empresas':Empresa,
};
const getModelFromRoute = (route) => {
  console.log(route)
  // Busca el modelo correspondiente a la ruta
  for (const [routePrefix, model] of Object.entries(routeToModelMap)) {
    if (route.startsWith(routePrefix)) {
      return model;
    }
  }
  return null; // Devuelve null si la ruta no está mapeada a ningún modelo
};
const auditMiddleware = async (req, res, next) => { 
  try {
    const { usuario } = req;
    const { method, originalUrl, body } = req;
    const ipCliente =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    let oldValue = null;
    let newValue = null; 

    const Model = getModelFromRoute(originalUrl);

    if (method === 'PUT' || method === 'DELETE') {
      oldValue = await getValue(req, Model);
    }

    if (method === 'POST' ) {
      newValue = body;
    }
 
    res.on("finish", async () => {
      const { statusCode, statusMessage } = res;
      if (  method === 'PUT') {
        newValue = await getValue(req, Model);
      }
      try {
        await Auditoria.create({
          empresaId: usuario.empresaId,
          sucursalId: usuario.sucursalId,
          usuarioId: usuario.id,
          metodo: method,
          path: originalUrl, 
          oldValue: oldValue,
          newValue: newValue,
          status: statusCode,
          mensaje: statusMessage,
          ipCliente
        });
      } catch (error) {
        console.error("Error al guardar en la tabla de auditoría:", error);
      }
    });

    next();
  } catch (error) {
    console.error("Error en el middleware de auditoría:", error);
    next(error);
  }
};

// Función para obtener el valor anterior para los métodos PUT y DELETE
async function getValue(req, Model) {
  const { method, params } = req;

  if (method === 'PUT') {
    const id = params.id;

    if (!id) {
      return null;
    }

    try {
      const oldRecord = await Model.findByPk(id);

      if (!oldRecord) {
        return null;
      }

      return oldRecord.toJSON();
    } catch (error) {
      console.error("Error al obtener el valor anterior:", error);
      return null;
    }
  } else {
    return null;
  }
}

module.exports = {
  auditMiddleware
};
