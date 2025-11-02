// controllers/cultivo.controller.js
const Cultivo = require('../models/cultivo.model'); 
/**
 * Crea un nuevo registro de cultivo bacteriano
 */
const crear = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { codigo, descripcion, proveedor } = req.body;

    if (!empresaId || !codigo || !descripcion) {
      return res.status(400).json({
        error: 'Campos requeridos: codigo, descripcion'
      });
    }

    const cultivo = await Cultivo.create({
      empresaId,
      codigo,
      descripcion,
      proveedor,
      activo: true
    });

    res.status(201).json(cultivo);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        error: 'Ya existe un cultivo con ese código' 
      });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lista todos los cultivos según filtros
 */
const listar = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { activo } = req.query;

    const where = { empresaId };
    if (activo !== undefined) {
      where.activo = activo === 'true';
    }

    const cultivos = await Cultivo.findAll({
      where,
      order: [['codigo', 'ASC']]
    });

    res.json(cultivos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene un cultivo por su ID
 */
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const cultivo = await Cultivo.findByPk(id);
    if (!cultivo) {
      return res.status(404).json({ error: 'Cultivo no encontrado' });
    }

    res.json(cultivo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualiza los datos de un cultivo
 */
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.usuario;
    const { codigo, descripcion, proveedor, activo } = req.body;

    const cultivo = await Cultivo.findByPk(id);
    if (!cultivo) {
      return res.status(404).json({ error: 'Cultivo no encontrado' });
    }

    await cultivo.update({
      codigo,
      descripcion,
      proveedor,
      empresaId,
      activo
    });

    res.json(cultivo);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        error: 'Ya existe un cultivo con ese código' 
      });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * Desactiva (elimina lógicamente) un cultivo
 */
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const cultivo = await Cultivo.findByPk(id);
    if (!cultivo) {
      return res.status(404).json({ error: 'Cultivo no encontrado' });
    }

    await cultivo.update({ activo: false });

    res.json({ mensaje: 'Cultivo desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exportar todas las funciones como un objeto
module.exports = {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  eliminar
};
