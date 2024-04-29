const { Op } = require('sequelize');
const Variedad = require('../models/variedad.model'); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require('../../dbconfig');

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const variedad = await Variedad.findByPk(id);
    if (variedad) {
      res.status(200).json(variedad);
    } else {
      res.status(404).json({ error: 'Variedad no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al buscar la variedad por ID' });
  }
};

// Método para buscar todas las variedades
const findAll = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const condiciones = empresaId ? { empresaId } : {};
    const variedades = await Variedad.findAll({ where: condiciones });
    res.status(200).json(variedades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al buscar variedades' });
  }
};

// Método para crear una nueva variedad
const create = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const {   descripcion,color, activo } = req.body;
    const variedad = await Variedad.create({ empresaId, descripcion,color, activo });
    res.status(201).json(variedad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al crear la variedad' });
  }
};

// Método para actualizar una variedad por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId  } = req.usuario;
    const {  descripcion,color, activo } = req.body;
    const variedad = await Variedad.findByPk(id);
    if (variedad) {
      await variedad.update({ empresaId, descripcion,color, activo });
      res.status(200).json(variedad);
    } else {
      res.status(404).json({ error: 'Variedad no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al actualizar la variedad' });
  }
};

// Método para desactivar una variedad (variedadr como inactiva)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const variedad = await Variedad.findByPk(id);
    if (variedad) {
      await variedad.update({ activo: false });
      res.status(200).json({ message: 'Variedad desactivada exitosamente' });
    } else {
      res.status(404).json({ error: 'Variedad no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al desactivar la variedad' });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
};
