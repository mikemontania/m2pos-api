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
const obtenerDescuentoImporte = async (req, res) => {
  try {
    const {  sucursalId, listaPrecioId } = req.params;
    const fechaActual = moment().format("YYYY-MM-DD"); 
    const { empresaId } = req.usuario;
    const condicionesDescuento = {
      empresaId,
      activo: true, 
      fechaDesde: { [Op.lte]: fechaActual },
      fechaHasta: { [Op.gte]: fechaActual },
      listaPrecioId: listaPrecioId,
      registro: "DESCUENTO",
      tipo: "IMPORTE",
      sucursalId: {
        [Op.or]: [{ [Op.eq]: sucursalId }, { [Op.eq]: null }]
      }
    };
     
    const descuentos = await Valoracion.findAll({ where: condicionesDescuento });

    res.status(200).json({
      descuentos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al  obtenerDescuentoImporte" });
  }
};
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
    res.status(500).json({ error: "Error al  obtenerValoracionVigente" });
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
      sucursalId:sucursalId == 0 ? null : sucursalId,
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
    if (nuevaValoracion.sucursalId == null) nuevaValoracion.sucursalId = 0;

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

    const sucursal_id = sucursalId == 0 ? null : sucursalId;

    // Actualizar la valoración con los nuevos datos
    await valoracionExistente.update({
      empresaId,
      sucursalId:sucursalId == 0 ? null : sucursalId,
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
    if (valoracionExistente.sucursalId == null)
      valoracionExistente.sucursalId = 0;

    // Enviar la valoración actualizada como respuesta
    res.json(valoracionExistente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la valoración." });
  }
};

const deletebyId = async (req, res) => {
  const { id } = req.params;
  try {
    const valoracion = await Valoracion.findByPk(id);

    if (!valoracion) {
      throw new Error("No se encontró la valoración con el ID proporcionado");
    }

    await valoracion.destroy();

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ ok: false, error: "Error al actualizar la valoración." });
  }
};

const obtenerValoraciones = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    // Extraer parámetros de la solicitud
    const {
      fechaDesde,
      registro,
      tipo,
      sucursalId,
      listaPrecioId
    } = req.params;
    const whereConditions = {
      fechaDesde: { [Op.lte]: fechaDesde },
      fechaHasta: { [Op.gte]: fechaDesde },
      empresaId
    };

    if (sucursalId != 0) {
      whereConditions.sucursalId = sucursalId;
    }

    if (listaPrecioId != 0) {
      whereConditions.listaPrecioId = listaPrecioId;
    }

    if (registro != "xxxxxx") {
      whereConditions.registro = registro;
    }

    if (tipo != "xxxxxx") {
      whereConditions.tipo = tipo;
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
            {
              model: Presentacion,
              as: "presentacion",
              attributes: ["descripcion"]
            }
          ]
        },
        { model: ListaPrecio, as: "listaPrecio", attributes: ["descripcion"] },
        { model: Sucursal, as: "sucursal", attributes: ["descripcion"] },
        {
          model: Cliente,
          as: "cliente",
          attributes: ["razonSocial", "nroDocumento"]
        }
      ]
    });
    // Ordenar las valoraciones por el campo 'id'
    valoraciones.sort((a, b) => a.id - b.id);

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
  update,
  deletebyId,
  obtenerDescuentoImporte
};
