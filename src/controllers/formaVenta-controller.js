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
      res.status(404).json({ error: 'FormaVenta no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al buscar la FormaVenta por ID' });
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
      res.status(404).json({ error: "Lista Precio predeterminado no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  "Error al buscar cliente predeterminado" });
  }
};
// Método para buscar todas las FormaVenta
const findAll = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const condiciones =   { empresaId }  ;
    const formaVenta = await FormaVenta.findAll({ where: condiciones });
    res.status(200).json(formaVenta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al buscar FormaVenta' });
  }
};

// Método para crear una nueva FormaVenta
const create = async (req, res) => {
  try {
    const { empresaId, descripcion, activo } = req.body;
    const formaVenta = await FormaVenta.create({ empresaId, descripcion, activo });
    res.status(201).json(formaVenta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al crear la FormaVenta' });
  }
};

// Método para actualizar una FormaVenta por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId, descripcion, activo } = req.body;
    const formaVenta = await FormaVenta.findByPk(id);
    if (formaVenta) {
      await formaVenta.update({ empresaId, descripcion, activo });
      res.status(200).json(formaVenta);
    } else {
      res.status(404).json({ error: 'FormaVenta no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al actualizar la FormaVenta' });
  }
};

// Método para desactivar una FormaVenta (marcar como inactiva)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const formaVenta = await FormaVenta.findByPk(id);
    if (formaVenta) {
      await formaVenta.update({ activo: false });
      res.status(200).json({ message: 'FormaVenta desactivada exitosamente' });
    } else {
      res.status(404).json({ error: 'FormaVenta no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al desactivar la FormaVenta' });
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
