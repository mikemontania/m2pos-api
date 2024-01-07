const { Op } = require('sequelize');
const FormaVenta = require('../models/formaVenta.model'); // Asegúrate de que la importación del modelo sea correcta
 
// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const formaVenta = await FormaVenta.findByPk(id);
    if (formaVenta) {
      res.status(200).json(formaVenta);
    } else {
      res.status(404).json({ error: 'Lista de precio no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar la lista de precio por ID' });
  }
};
const findPredeterminado = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones =  { empresaId, predeterminado: true }
     const predeterminado = await FormaVenta.findOne({ where: condiciones });

    if (predeterminado) {
      res.status(200).json(predeterminado);
    } else {
      res.status(404).json({ mensaje: "Lista Precio predeterminado no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar cliente predeterminado" });
  }
};
// Método para buscar todas las listas de precio
const findAll = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const condiciones = empresaId ? { empresaId } : {};
    const listasPrecio = await FormaVenta.findAll({ where: condiciones });
    res.status(200).json(listasPrecio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar listas de precio' });
  }
};

// Método para crear una nueva lista de precio
const create = async (req, res) => {
  try {
    const { empresaId, descripcion, activo } = req.body;
    const formaVenta = await FormaVenta.create({ empresaId, descripcion, activo });
    res.status(201).json(formaVenta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la lista de precio' });
  }
};

// Método para actualizar una lista de precio por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId, descripcion, activo } = req.body;
    const formaVenta = await FormaVenta.findByPk(id);
    if (formaVenta) {
      await formaVenta.update({ empresaId, descripcion, activo });
      res.status(200).json(formaVenta);
    } else {
      res.status(404).json({ error: 'Lista de precio no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la lista de precio' });
  }
};

// Método para desactivar una lista de precio (marcar como inactiva)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const formaVenta = await FormaVenta.findByPk(id);
    if (formaVenta) {
      await formaVenta.update({ activo: false });
      res.status(200).json({ message: 'Lista de precio desactivada exitosamente' });
    } else {
      res.status(404).json({ error: 'Lista de precio no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al desactivar la lista de precio' });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
  findPredeterminado
};
