const { Op } = require('sequelize');
const Categoria = require('../models/categoria.model'); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require('../../dbconfig');

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    if (categoria) {
      res.status(200).json(categoria);
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al buscar la categoría por ID' });
  }
};

// Método para buscar todas las categorías
const findAll = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const condiciones = empresaId ? { empresaId } : {};
    const categorias = await Categoria.findAll({ where: condiciones });
    res.status(200).json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al buscar categorías' });
  }
};

// Método para crear una nueva categoría
const create = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const {   descripcion, activo } = req.body;
    const categoria = await Categoria.create({ empresaId, descripcion, activo });
    res.status(201).json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al crear la categoría' });
  }
};

// Método para actualizar una categoría por ID
const update = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const { id } = req.params;
    const {  descripcion, activo } = req.body;
    const categoria = await Categoria.findByPk(id);
    if (categoria) {
      await categoria.update({ empresaId, descripcion, activo });
      res.status(200).json(categoria);
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al actualizar la categoría' });
  }
};

// Método para desactivar una categoría (marcar como inactivo)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    if (categoria) {
      await categoria.update({ activo: false });
      res.status(200).json({ message: 'Categoría desactivada exitosamente' });
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al desactivar la categoría' });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
};
