const { Op } = require('sequelize');
const Producto = require('../models/producto.model'); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require('../../dbconfig');

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (producto) {
      res.status(200).json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar el producto por ID' });
  }
};

// Método para buscar todos los productos
const findAll = async (req, res) => {
  try {
    const { empresaId, marcaId, categoriaId, subCategoriaId } = req.query;
    const condiciones = {};
    if (empresaId) condiciones.empresaId = empresaId;
    if (marcaId) condiciones.marcaId = marcaId;
    if (categoriaId) condiciones.categoriaId = categoriaId;
    if (subCategoriaId) condiciones.subCategoriaId = subCategoriaId;

    const productos = await Producto.findAll({ where: condiciones });
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
};

// Método para crear un nuevo producto
const create = async (req, res) => {
  try {
    const { empresaId, marcaId, categoriaId, subCategoriaId, nombre, descripcion, activo } = req.body;
    const producto = await Producto.create({ empresaId, marcaId, categoriaId, subCategoriaId, nombre, descripcion, activo });
    res.status(201).json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Método para actualizar un producto por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId, marcaId, categoriaId, subCategoriaId, nombre, descripcion, activo } = req.body;
    const producto = await Producto.findByPk(id);
    if (producto) {
      await producto.update({ empresaId, marcaId, categoriaId, subCategoriaId, nombre, descripcion, activo });
      res.status(200).json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Método para desactivar un producto (marcar como inactivo)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (producto) {
      await producto.update({ activo: false });
      res.status(200).json({ message: 'Producto desactivado exitosamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al desactivar el producto' });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
};
