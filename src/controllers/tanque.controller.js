// controllers/tanque-fermentador.controller.js
const Tanque = require('../models/tanque.model');

class TanqueController {
  
  async crear(req, res) {
    try {
            const { empresaId } = req.usuario

      const { codigo, letraLote, descripcion, capacidadLitros } = req.body;

      // Validar campos requeridos
      if (!empresaId || !codigo || !letraLote || !descripcion) {
        return res.status(400).json({
          error: 'Campos requeridos: empresaId, codigo, letraLote, descripcion'
        });
      }

      const tanque = await Tanque.create({
        empresaId,
        codigo,
        letraLote: letraLote.toUpperCase(),
        descripcion,
        capacidadLitros,
        activo: true
      });

      res.status(201).json(tanque);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ 
          error: 'Ya existe un tanque con ese código o letra de lote' 
        });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async listar(req, res) {
    try {
           const { empresaId } = req.usuario

      const { activo } = req.query;

      const where = { empresaId };
      if (activo !== undefined) {
        where.activo = activo === 'true';
      }

      const tanques = await Tanque.findAll({
        where,
        order: [['codigo', 'ASC']]
      });

      res.json(tanques);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;

      const tanque = await Tanque.findByPk(id);
      if (!tanque) {
        return res.status(404).json({ error: 'Tanque no encontrado' });
      }

      res.json(tanque);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
            const { empresaId } = req.usuario

      const { codigo, letraLote, descripcion, capacidadLitros, activo } = req.body;

      const tanque = await Tanque.findByPk(id);
      if (!tanque) {
        return res.status(404).json({ error: 'Tanque no encontrado' });
      }

      await tanque.update({
        codigo,
        letraLote: letraLote ? letraLote.toUpperCase() : tanque.letraLote,
        descripcion,
        capacidadLitros,empresaId,
        activo
      });

      res.json(tanque);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ 
          error: 'Ya existe un tanque con ese código o letra de lote' 
        });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;

      const tanque = await Tanque.findByPk(id);
      if (!tanque) {
        return res.status(404).json({ error: 'Tanque no encontrado' });
      }

      // Soft delete
      await tanque.update({ activo: false });

      res.json({ mensaje: 'Tanque desactivado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TanqueController();