const { Op } = require('sequelize');
const Credito = require('../models/credito.model');

const findCredits = async (req, res) => {
  try {
    const { sucursalId, condicionPagoId, clienteId, fecha, pagado, page, pageSize } = req.params;
    const { empresaId  } = req.usuario;
    const conditions = {empresaId};
    if (sucursalId) conditions.sucursalId = sucursalId;
    if (condicionPagoId) conditions.condicionPagoId = condicionPagoId;
    if (clienteId) conditions.clienteId = clienteId;
    if (fecha) conditions.fecha = { [Op.gte]: fecha };
    if (pagado !== undefined) conditions.pagado = pagado;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const result = await Credito.findAndCountAll({
      where: conditions,
      offset,
      limit,
    });

    res.status(200).json({
      total: result.count,
      totalPages: Math.ceil(result.count / pageSize),
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      credits: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar créditos paginados' });
  }
};





const create  = async (req, res) => {
    try {
        const { empresaId  } = req.usuario;
      const {   sucursalId, condicionPagoId, cobranzaId, pagado, usuarioCreacionId, fechaCreacion, fechaVencimiento, fecha, observacion, importeTotal, clienteId } = req.body;
  
      const nuevoCredito = await Credito.create({
        empresaId, sucursalId, condicionPagoId, cobranzaId, pagado, usuarioCreacionId, fechaCreacion, fechaVencimiento, fecha, observacion, importeTotal, clienteId
      });
  
      res.status(201).json(nuevoCredito);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error?.original?.detail ||   'Error al crear el crédito' });
    }
  };
  
  const update = async (req, res) => {
    const { empresaId  } = req.usuario;
    try {
      const { id } = req.params;
      const {  sucursalId, condicionPagoId, cobranzaId, pagado, usuarioCreacionId, fechaCreacion, fechaVencimiento, fecha, observacion, importeTotal, clienteId } = req.body;
  
      const creditoExistente = await Credito.findByPk(id);
  
      if (creditoExistente) {
        await creditoExistente.update({
          empresaId, sucursalId, condicionPagoId, cobranzaId, pagado, usuarioCreacionId, fechaCreacion, fechaVencimiento, fecha, observacion, importeTotal, clienteId
        });
  
        res.status(200).json(creditoExistente);
      } else {
        res.status(404).json({ error: 'Crédito no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error?.original?.detail ||   'Error al actualizar el crédito' });
    }
  };




module.exports = {
  findCredits,
  create,
  update
};