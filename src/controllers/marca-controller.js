const { Op } = require('sequelize');
const Marca = require('../models/marca.model'); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require('../../dbconfig');

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const marca = await Marca.findByPk(id);
    if (marca) {
      res.status(200).json(marca);
    } else {
      res.status(404).json({ error: 'Marca no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar la marca por ID' });
  }
};

// Método para buscar todas las marcas
const findAll = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const condiciones = empresaId ? { empresaId } : {};
    const marcas = await Marca.findAll({ where: condiciones });
    res.status(200).json(marcas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar marcas' });
  }
};

// Método para crear una nueva marca
const create = async (req, res) => {
  try {
    const { empresaId, descripcion, activo } = req.body;
    const marca = await Marca.create({ empresaId, descripcion, activo });
    res.status(201).json(marca);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la marca' });
  }
};

// Método para actualizar una marca por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId, descripcion, activo } = req.body;
    const marca = await Marca.findByPk(id);
    if (marca) {
      await marca.update({ empresaId, descripcion, activo });
      res.status(200).json(marca);
    } else {
      res.status(404).json({ error: 'Marca no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la marca' });
  }
};

// Método para desactivar una marca (marcar como inactiva)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const marca = await Marca.findByPk(id);
    if (marca) {
      await marca.update({ activo: false });
      res.status(200).json({ message: 'Marca desactivada exitosamente' });
    } else {
      res.status(404).json({ error: 'Marca no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al desactivar la marca' });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
};
