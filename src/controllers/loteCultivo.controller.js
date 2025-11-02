// controllers/loteCultivo.controller.js
const LoteCultivo = require('../models/loteCultivo.model')
const Cultivo = require('../models/cultivo.model')

/**
 * Crear un nuevo lote de cultivo
 */
const crear = async (req, res) => {
  try {
    const { empresaId } = req.usuario

    const { cultivoId, numeroLote, fechaVencimiento } = req.body

    if (!empresaId || !cultivoId || !numeroLote || !fechaVencimiento) {
      return res.status(400).json({
        error: 'Campos requeridos: cultivoId, numeroLote, fechaVencimiento'
      })
    }

    const lote = await LoteCultivo.create({
      empresaId,
      cultivoId,
      numeroLote,
      fechaVencimiento,
      activo: true
    })

    res.status(201).json(lote)
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'Ya existe un lote con ese número'
      })
    }
    res.status(500).json({ error: error.message })
  }
}

/**
 * Listar lotes de cultivo (con filtros)
 */
const listar = async (req, res) => {
  try {
    const { empresaId } = req.usuario
    const { activo, cultivoId } = req.query

    if (!empresaId) {
      return res.status(400).json({ error: 'Falta empresaId' })
    }

    const where = { empresaId }
    if (activo !== undefined) where.activo = activo === 'true'
    if (cultivoId) where.cultivoId = cultivoId

    const lotes = await LoteCultivo.findAll({
      where,
      include: [
        {
          model: Cultivo,
          as: 'cultivo',
          attributes: ['id', 'codigo', 'nombre']
        }
      ],
      order: [['numeroLote', 'ASC']]
    })

    res.json(lotes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Obtener un lote por su ID
 */
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params

    const lote = await LoteCultivo.findByPk(id, {
      include: [
        {
          model: Cultivo,
          as: 'cultivo',
          attributes: ['id', 'codigo', 'nombre']
        }
      ]
    })
    if (!lote) {
      return res.status(404).json({ error: 'Lote de cultivo no encontrado' })
    }

    res.json(lote)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Actualizar lote de cultivo
 */
const actualizar = async (req, res) => {
  try {
    const { id } = req.params
    const { cultivoId, numeroLote, fechaVencimiento, activo } = req.body

    const lote = await LoteCultivo.findByPk(id)
    if (!lote) {
      return res.status(404).json({ error: 'Lote de cultivo no encontrado' })
    }

    await lote.update({
      cultivoId,
      numeroLote,
      fechaVencimiento,
      activo
    })

    res.json(lote)
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'Ya existe un lote con ese número'
      })
    }
    res.status(500).json({ error: error.message })
  }
}

/**
 * Desactivar (eliminar lógicamente) un lote
 */
const eliminar = async (req, res) => {
  try {
    const { id } = req.params

    const lote = await LoteCultivo.findByPk(id)
    if (!lote) {
      return res.status(404).json({ error: 'Lote de cultivo no encontrado' })
    }

    await lote.update({ activo: false })

    res.json({ mensaje: 'Lote de cultivo desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  eliminar
}
