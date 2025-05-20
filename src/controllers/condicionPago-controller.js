const { Op } = require('sequelize');
const CondicionPago = require('../models/condicionPago.model'); // Asegúrate de que la importación del modelo sea correcta
 
// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const condicionPago = await CondicionPago.findByPk(id);
    if (condicionPago) {
      res.status(200).json(condicionPago);
    } else {
      res.status(404).json({ error: 'CondicionPago no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar la CondicionPago por ID' });
  }
};
const findPredeterminado = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones =  { empresaId, predeterminado: true }
     const predeterminado = await CondicionPago.findOne({ where: condiciones });

    if (predeterminado) {
      res.status(200).json(predeterminado);
    } else {
      res.status(404).json({ error: "Lista Precio predeterminado no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar cliente predeterminado" });
  }
};
// Método para buscar todas las CondicionPago
const findAll = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const condiciones =   { empresaId }  ;
    const condicionPago = await CondicionPago.findAll({ where: condiciones });
    res.status(200).json(condicionPago);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar CondicionPago' });
  }
};

// Método para crear una nueva CondicionPago
const create = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
     const {   color , dias , predeterminado, descripcion, activo } = req.body;
    const condicionPago = await CondicionPago.create({ empresaId, dias ,  descripcion,  color , predeterminado,activo });
    res.status(201).json(condicionPago);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al crear la CondicionPago' });
  }
};

// Método para actualizar una CondicionPago por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId  } = req.usuario;

    const {   descripcion, dias ,  activo,color , predeterminado } = req.body;
    const condicionPago = await CondicionPago.findByPk(id);
    if (condicionPago) {
      await condicionPago.update({ empresaId,  dias , descripcion, activo,color , predeterminado });
      res.status(200).json(condicionPago);
    } else {
      res.status(404).json({ error: 'CondicionPago no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al actualizar la CondicionPago' });
  }
};

// Método para desactivar una CondicionPago (marcar como inactiva)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const condicionPago = await CondicionPago.findByPk(id);
    if (condicionPago) {
      await condicionPago.update({ activo: false });
      res.status(200).json({ message: 'CondicionPago desactivada exitosamente' });
    } else {
      res.status(404).json({ error: 'CondicionPago no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al desactivar la CondicionPago' });
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
