const { Op } = require("sequelize");
const Unidad = require("../models/unidad.model"); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require("../../dbconfig");

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const unidad = await Unidad.findByPk(id);
    if (unidad) {
      res.status(200).json(unidad);
    } else {
      res.status(404).json({ error: "Unidad no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar la Unidad por ID" });
  }
};

// Método para buscar todas las Unidades
const findAll = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones = {};
    if (empresaId) condiciones.empresaId = empresaId;

    const unidades = await Unidad.findAll({ where: condiciones });
    res.status(200).json(unidades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar Unidades" });
  }
};

// Método para crear una nueva Unidad
const create = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { descripcion, code,activo } = req.body;
    const nuevaUnidad = await Unidad.create({ empresaId, descripcion,code, activo });
    res.status(201).json(nuevaUnidad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al crear la Unidad" });
  }
};

// Método para actualizar una Unidad por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.usuario;
    const { descripcion, code,activo } = req.body;
    const unidadActualizada = await Unidad.findByPk(id);
    if (unidadActualizada) {
      await unidadActualizada.update({ empresaId, descripcion, code,activo });
      res.status(200).json(unidadActualizada);
    } else {
      res.status(404).json({ error: "Unidad no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al actualizar la Unidad" });
  }
};

// Método para desactivar una Unidad (marcar como inactiva)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const unidad = await Unidad.findByPk(id);
    if (unidad) {
      await unidad.update({ activo: false });
      res.status(200).json({ message: "Unidad desactivada exitosamente" });
    } else {
      res.status(404).json({ error: "Unidad no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al desactivar la Unidad" });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable
};
