const { Op } = require('sequelize');
const Presentacion = require('../models/presentacion.model'); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require('../../dbconfig');

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const presentacion = await Presentacion.findByPk(id);
    if (presentacion) {
      res.status(200).json(presentacion);
    } else {
      res.status(404).json({ error: 'Presentación no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar la presentación por ID' });
  }
};

// Método para buscar todas las presentaciones
const findAll = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const condiciones = empresaId ? { empresaId } : {};
    const presentaciones = await Presentacion.findAll({ where: condiciones });
    res.status(200).json(presentaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar presentaciones' });
  }
};

// Método para crear una nueva presentación
const create = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const {   descripcion, size,activo } = req.body;
    const presentacion = await Presentacion.create({ empresaId, descripcion,size, activo });
    res.status(201).json(presentacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al crear la presentación' });
  }
};

// Método para actualizar una presentación por ID
const update = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const { id } = req.params;
    const {   descripcion,size, activo } = req.body;
    const presentacion = await Presentacion.findByPk(id);
    if (presentacion) {
      await presentacion.update({ empresaId, descripcion,size, activo });
      res.status(200).json(presentacion);
    } else {
      res.status(404).json({ error: 'Presentación no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al actualizar la presentación' });
  }
};

// Método para desactivar una presentación (marcar como inactiva)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const presentacion = await Presentacion.findByPk(id);
    if (presentacion) {
      await presentacion.update({ activo: false });
      res.status(200).json({ message: 'Presentación desactivada exitosamente' });
    } else {
      res.status(404).json({ error: 'Presentación no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al desactivar la presentación' });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
};
