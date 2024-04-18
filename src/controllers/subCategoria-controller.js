const { Op } = require('sequelize');
const SubCategoria = require('../models/subCategoria.model'); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require('../../dbconfig');

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoria = await SubCategoria.findByPk(id);
    if (subCategoria) {
      res.status(200).json(subCategoria);
    } else {
      res.status(404).json({ error: 'SubCategoria no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar la SubCategoria por ID' });
  }
};

// Método para buscar todas las SubCategorias
const findAll = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const condiciones = {};
    if (empresaId) condiciones.empresaId = empresaId;

    const subCategorias = await SubCategoria.findAll({ where: condiciones });
    res.status(200).json(subCategorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar SubCategorias' });
  }
};

// Método para crear una nueva SubCategoria
const create = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const {  descripcion, activo } = req.body;
    const nuevaSubCategoria = await SubCategoria.create({ empresaId, descripcion, activo });
    res.status(201).json(nuevaSubCategoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la SubCategoria' });
  }
};

// Método para actualizar una SubCategoria por ID
const update = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const { id } = req.params;
    const {  descripcion, activo } = req.body;
    const subCategoriaActualizada = await SubCategoria.findByPk(id);
    if (subCategoriaActualizada) {
      await subCategoriaActualizada.update({ empresaId, descripcion, activo });
      res.status(200).json(subCategoriaActualizada);
    } else {
      res.status(404).json({ error: 'SubCategoria no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la SubCategoria' });
  }
};

// Método para desactivar una SubCategoria (marcar como inactiva)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoria = await SubCategoria.findByPk(id);
    if (subCategoria) {
      await subCategoria.update({ activo: false });
      res.status(200).json({ message: 'SubCategoria desactivada exitosamente' });
    } else {
      res.status(404).json({ error: 'SubCategoria no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al desactivar la SubCategoria' });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
};
