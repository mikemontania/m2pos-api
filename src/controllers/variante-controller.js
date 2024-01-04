const { Op } = require('sequelize');
const Variante = require('../models/variante.model'); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require('../../dbconfig');

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const variante = await Variante.findByPk(id);
    if (variante) {
      res.status(200).json(variante);
    } else {
      res.status  (404).json({ error: 'Variante no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar la Variante por ID' });
  }
};

// Método para buscar todas las Variantes
const findAll = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const condiciones = {};
    if (empresaId) condiciones.empresaId = empresaId;

    const variantes = await Variante.findAll({ where: condiciones });
    res.status(200).json(variantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar Variantes' });
  }
};

// Método para crear una nueva Variante
const create = async (req, res) => {
  try {
    const { porcIva, empresaId, presentacionId, variedadId, productoId, unidadId, activo } = req.body;
    const nuevaVariante = await Variante.create({ porcIva, empresaId, presentacionId, variedadId, productoId, unidadId, activo });
    res.status(201).json(nuevaVariante);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la Variante' });
  }
};

// Método para actualizar una Variante por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { porcIva, empresaId, presentacionId, variedadId, productoId, unidadId, activo } = req.body;
    const varianteActualizada = await Variante.findByPk(id);
    if (varianteActualizada) {
      await varianteActualizada.update({ porcIva, empresaId, presentacionId, variedadId, productoId, unidadId, activo });
      res.status(200).json(varianteActualizada);
    } else {
      res.status(404).json({ error: 'Variante no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la Variante' });
  }
};

// Método para desactivar una Variante (marcar como inactivo)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const variante = await Variante.findByPk(id);
    if (variante) {
      await variante.update({ activo: false });
      res.status(200).json({ message: 'Variante desactivada exitosamente' });
    } else {
      res.status(404).json({ error: 'Variante no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al desactivar la Variante' });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
};
