// controllers/loteEsencia.controller.js
const LoteEsencia = require('../models/loteEsencia.model');
const Esencia = require('../models/esencia.models');

/**
 * Crear un nuevo lote de esencia
 */
const crear = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { esenciaId, numeroLote, fechaVencimiento } = req.body;

    if (!empresaId || !esenciaId) {
      return res.status(400).json({
        error: 'Campos requeridos: esenciaId'
      });
    }

    const lote = await LoteEsencia.create({
      empresaId,
      esenciaId,
      numeroLote,
      fechaVencimiento,
      activo: true
    });

    res.status(201).json(lote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Listar lotes de esencia (con filtros)
 */
const listar = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { activo, esenciaId } = req.query;

    if (!empresaId) {
      return res.status(400).json({ error: 'Falta empresaId' });
    }

    const where = { empresaId };
    if (activo !== undefined) where.activo = activo === 'true';
    if (esenciaId) where.esenciaId = esenciaId;

    const lotes = await LoteEsencia.findAll({
      where,
      include: [
        {
          model: Esencia,
          as: 'esencia',
          attributes: ['id', 'nombre', 'requiereVencimiento']
        }
      ],
      order: [['id', 'DESC']]
    });

    res.json(lotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener un lote de esencia por ID
 */
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const lote = await LoteEsencia.findByPk(id, {
      include: [
        {
          model: Esencia,
          as: 'esencia',
          attributes: ['id', 'nombre', 'requiereVencimiento']
        }
      ]
    });

    if (!lote) {
      return res.status(404).json({ error: 'Lote de esencia no encontrado' });
    }

    res.json(lote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualizar un lote de esencia
 */
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { esenciaId, numeroLote, fechaVencimiento, activo } = req.body;

    const lote = await LoteEsencia.findByPk(id);
    if (!lote) {
      return res.status(404).json({ error: 'Lote de esencia no encontrado' });
    }

    await lote.update({
      esenciaId,
      numeroLote,
      fechaVencimiento,
      activo
    });

    res.json(lote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Desactivar (eliminar lógicamente) un lote de esencia
 */
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const lote = await LoteEsencia.findByPk(id);
    if (!lote) {
      return res.status(404).json({ error: 'Lote de esencia no encontrado' });
    }

    await lote.update({ activo: false });

    res.json({ mensaje: 'Lote de esencia desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  eliminar
};
