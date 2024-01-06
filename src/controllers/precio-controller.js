const { Op } = require("sequelize");
const Precio = require("../models/precio.model"); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require("../../dbconfig");
const moment = require("moment");

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const precio = await Precio.findByPk(id);
    if (precio) {
      res.status(200).json(precio);
    } else {
      res.status(404).json({ error: "Precio no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar el precio por ID" });
  }
};

//version correcta
const obtenerPrecioVigente = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { id, listaPrecioId } = req.params;
    const fechaActual = moment().format("YYYY-MM-DD");
    console.log(id);
    const condiciones = {
      activo: true,
      varianteId: id,
      fechaDesde: { [Op.lte]: fechaActual },
      fechaHasta: { [Op.gte]: fechaActual }
    };

    const precio = await Precio.findOne({ where: condiciones });
    console.log(precio);
    res.status(200).json(precio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar cliente predeterminado" });
  }
};
//version incorrecta
/* const obtenerPrecioVigente = async (req, res) => {
  const { id, listaPrecioId } = req.params;
  const { empresaId } = req.usuario;
  const fechaActual = moment().format('YYYY-MM-DD');

  const condPrecio = {
    $and: [
      {
        varianteId: { [Op.eq]: id }
      },
    {
        empresaId: empresaId
      },
      {
        activo: true
      },
      {
        fechaDesde: { [Op.lte]: fechaActual }
      },
      {
        fechaHasta: { [Op.gte]: fechaActual }
      },
      {
        listaPrecioId: listaPrecioId
      } 
    ]
  };

  try {
    console.log('Condiciones de la consulta:', condPrecio);
    const precio = await Precio.findOne(condPrecio);
    console.log('Resultado de la consulta:', precio);
    
    if (!precio) {
      return res.status(404).json({ mensaje: "No se encontró precio para el producto y lista de precios especificados." });
    }

    res.status(200).json(precio);
  } catch (error) {
    console.error(`Error al buscar precio para producto ${id} y lista de precios ${listaPrecioId}:`, error);
    res.status(500).json({ error: "Error al buscar el precio" });
  } 
};*/

// Método para buscar todos los precios
const findAll = async (req, res) => {
  try {
    const { empresaId, listaPrecioId, varianteId } = req.params;
    const condiciones = {};
    if (empresaId) condiciones.empresaId = empresaId;
    if (listaPrecioId) condiciones.listaPrecioId = listaPrecioId;
    if (varianteId) condiciones.varianteId = varianteId;

    const precios = await Precio.findAll({ where: condiciones });
    res.status(200).json(precios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar precios" });
  }
};

// Método para crear un nuevo precio
const create = async (req, res) => {
  try {
    const {
      empresaId,
      listaPrecioId,
      varianteId,
      activo,
      cantDesde,
      cantHasta,
      fechaDesde,
      fechaHasta,
      precio,
      codCliente,
      usuarioCreacion,
      usuarioModificacion,
      fechaCreacion,
      fechaModificacion
    } = req.body;
    const nuevoPrecio = await Precio.create({
      empresaId,
      listaPrecioId,
      varianteId,
      activo,
      cantDesde,
      cantHasta,
      fechaDesde,
      fechaHasta,
      precio,
      codCliente,
      usuarioCreacion,
      usuarioModificacion,
      fechaCreacion,
      fechaModificacion
    });
    res.status(201).json(nuevoPrecio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el precio" });
  }
};

// Método para actualizar un precio por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      empresaId,
      listaPrecioId,
      varianteId,
      activo,
      cantDesde,
      cantHasta,
      fechaDesde,
      fechaHasta,
      precio,
      codCliente,
      usuarioCreacion,
      usuarioModificacion,
      fechaCreacion,
      fechaModificacion
    } = req.body;
    const precioActualizado = await Precio.findByPk(id);
    if (precioActualizado) {
      await precioActualizado.update({
        empresaId,
        listaPrecioId,
        varianteId,
        activo,
        cantDesde,
        cantHasta,
        fechaDesde,
        fechaHasta,
        precio,
        codCliente,
        usuarioCreacion,
        usuarioModificacion,
        fechaCreacion,
        fechaModificacion
      });
      res.status(200).json(precioActualizado);
    } else {
      res.status(404).json({ error: "Precio no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el precio" });
  }
};

// Método para desactivar un precio (marcar como inactivo)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const precio = await Precio.findByPk(id);
    if (precio) {
      await precio.update({ activo: false });
      res.status(200).json({ message: "Precio desactivado exitosamente" });
    } else {
      res.status(404).json({ error: "Precio no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al desactivar el precio" });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
  obtenerPrecioVigente
};
