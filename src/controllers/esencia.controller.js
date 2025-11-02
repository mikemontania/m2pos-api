// controllers/esencia.controller.js
const Esencia = require('../models/esencia.models')

/**
 * Crear una nueva esencia
 */
const crear = async (req, res) => {
  try {
    const { empresaId } = req.usuario

    const { nombre, requiereVencimiento } = req.body

    if (!empresaId || !nombre) {
      return res.status(400).json({
        error: 'Campos requeridos: nombre'
      })
    }

    const esencia = await Esencia.create({
      empresaId,
      nombre,
      requiereVencimiento: requiereVencimiento ?? true,
      activo: true
    })

    res.status(201).json(esencia)
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'Ya existe una esencia con ese nombre'
      })
    }
    res.status(500).json({ error: error.message })
  }
}

/**
 * Listar todas las esencias (con filtro opcional por activo)
 */
const listar = async (req, res) => {
  try {
    const { empresaId } = req.usuario

    const { activo } = req.query

    if (!empresaId) {
      return res.status(400).json({ error: 'Falta empresaId' })
    }

    const where = { empresaId }
    if (activo !== undefined) where.activo = activo === 'true'

    const esencias = await Esencia.findAll({
      where,
      order: [['nombre', 'ASC']]
    })

    res.json(esencias)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Obtener esencia por ID
 */
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params

    const esencia = await Esencia.findByPk(id)
    if (!esencia) {
      return res.status(404).json({ error: 'Esencia no encontrada' })
    }

    res.json(esencia)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Actualizar esencia
 */
const actualizar = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, requiereVencimiento, activo } = req.body

    const esencia = await Esencia.findByPk(id)
    if (!esencia) {
      return res.status(404).json({ error: 'Esencia no encontrada' })
    }

    await esencia.update({
      nombre,
      requiereVencimiento,
      activo
    })

    res.json(esencia)
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'Ya existe una esencia con ese nombre'
      })
    }
    res.status(500).json({ error: error.message })
  }
}

/**
 * Desactivar (eliminar lógicamente) una esencia
 */
const eliminar = async (req, res) => {
  try {
    const { id } = req.params

    const esencia = await Esencia.findByPk(id)
    if (!esencia) {
      return res.status(404).json({ error: 'Esencia no encontrada' })
    }

    await esencia.update({ activo: false })

    res.json({ mensaje: 'Esencia desactivada correctamente' })
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
