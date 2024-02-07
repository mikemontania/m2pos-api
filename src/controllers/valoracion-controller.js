const { Op } = require("sequelize");
const { sequelize } = require("../../dbconfig");
const moment = require("moment");
const Valoracion = require("../models/valoracion.model");
const Variante = require("../models/variante.model");
const ListaPrecio = require("../models/listaPrecio.model");
const Sucursal = require("../models/sucursal.model");
const Cliente = require("../models/cliente.model");
const Producto = require("../models/producto.model");
const Variedad = require("../models/variedad.model");
const Presentacion = require("../models/presentacion.model");

//version correcta
const obtenerValoracionVigente = async (req, res) => {
  try {
    const { id, sucursalId, listaPrecioId } = req.params;
    const fechaActual = moment().format("YYYY-MM-DD");

    const condicionesPrecio = {
      activo: true,
      varianteId: detalle.varianteId,
      fechaDesde: { [Op.lte]: fechaActual },
      fechaHasta: { [Op.gte]: fechaActual },
      cantDesde: { [Op.gte]: 1 },
      listaPrecioId: listaPrecioId,
      registro: "PRECIO",
      tipo: "IMPORTE",
      sucursalId: {
        [Op.or]: [{ [Op.eq]: sucursalId }, { [Op.eq]: null }]
      }
    };
    const condicionesDescuento = {
      activo: true,
      varianteId: detalle.varianteId,
      fechaDesde: { [Op.lte]: fechaActual },
      fechaHasta: { [Op.gte]: fechaActual },
      listaPrecioId: listaPrecioId,
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      sucursalId: {
        [Op.or]: [{ [Op.eq]: sucursalId }, { [Op.eq]: null }]
      }
    };
    const precio = await Valoracion.findOne({ where: condicionesPrecio });

    const descuento = await Valoracion.findOne({ where: condicionesDescuento });

    res.status(200).json({
      descuento,
      precio
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar cliente predeterminado" });
  }
};
const create = async (req, res) => {
  try {
    // Extraer
    const { empresaId } = req.usuario;
    const {
      sucursalId,
      listaPrecioId,
      varianteId,
      activo,
      cantDesde,
      cantHasta,
      fechaDesde,
      fechaHasta,
      valor,
      clienteId,
      registro,
      tipo,
      usuarioCreacion
    } = req.body;

    // Crear la nueva valoración en la base de datos
    const nuevaValoracion = await Valoracion.create({
      empresaId,
      sucursalId,
      listaPrecioId,
      varianteId,
      activo,
      cantDesde,
      cantHasta,
      fechaDesde: moment(fechaDesde).toDate(),
      fechaHasta: moment(fechaHasta).toDate(),
      valor,
      clienteId,
      registro,
      tipo,
      usuarioCreacion
    });

    // Enviar la nueva valoración como respuesta
    res.json(nuevaValoracion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la valoración." });
  }
};
const update = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    // Extraer datos de la solicitud
    const {
      sucursalId,
      listaPrecioId,
      varianteId,
      activo,
      cantDesde,
      cantHasta,
      fechaDesde,
      fechaHasta,
      valor,
      clienteId,
      registro,
      tipo,
      usuarioModificacion
    } = req.body;

    // Obtener el ID de la valoración desde los parámetros de la ruta
    const valoracionId = req.params.id;

    // Buscar la valoración en la base de datos
    const valoracionExistente = await Valoracion.findByPk(valoracionId);

    if (!valoracionExistente) {
      return res.status(404).json({ error: "Valoración no encontrada." });
    }

    // Actualizar la valoración con los nuevos datos
    await valoracionExistente.update({
      empresaId,
      sucursalId,
      listaPrecioId,
      varianteId,
      activo,
      cantDesde,
      cantHasta,
      fechaDesde: moment(fechaDesde).toDate(),
      fechaHasta: moment(fechaHasta).toDate(),
      valor,
      clienteId,
      registro,
      tipo,
      usuarioModificacion
    });

    // Enviar la valoración actualizada como respuesta
    res.json(valoracionExistente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la valoración." });
  }
};
const obtenerValoraciones = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    // Extraer parámetros de la solicitud
    const { fechaDesde,  registro, tipo } = req.params;
    const whereConditions = {
      fechaDesde: { [Op.lte]:  fechaDesde  },
      fechaHasta: { [Op.gte]:  fechaDesde }, 
      empresaId
    };
    if (registro != 'xxxxxx') {
      whereConditions.registro =registro;
    }
    
if (tipo != 'xxxxxx') {
  whereConditions.tipo =tipo;
}


    // Consultar la base de datos con las condiciones de filtro
    const valoraciones = await Valoracion.findAll({
      where: whereConditions,
      include: [
        {
          model: Variante,
          as: "variante",
          attributes: ["codErp"],
          include: [
            { model: Producto, as: "producto", attributes: ["nombre"] },
            { model: Variedad, as: "variedad", attributes: ["descripcion"] },
            { model: Presentacion,        as: "presentacion",        attributes: ["descripcion"]            }
          ]
        },
        {
          model: ListaPrecio,
          as: "listaPrecio",
          attributes: ["descripcion"]
        },
        { model: Sucursal, as: "sucursal", attributes: ["descripcion"] },
        {
          model: Cliente,
          as: "cliente",
          attributes: ["razonSocial", "nroDocumento"]
        }
      ]
    });

    res.json(valoraciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las valoraciones." });
  }
};
// Método para desactivar un Valoracion (marcar como inactivo)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const Valoracion = await Valoracion.findByPk(id);
    if (Valoracion) {
      await Valoracion.update({ activo: false });
      res.status(200).json({ message: "Valoracion desactivado exitosamente" });
    } else {
      res.status(404).json({ error: "Valoracion no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al desactivar el Valoracion" });
  }
};

module.exports = {
  disable,
  obtenerValoracionVigente,
  obtenerValoraciones,
  create,
  update
};
