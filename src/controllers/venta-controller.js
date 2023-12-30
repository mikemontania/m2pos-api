const { Op } = require('sequelize');
const Venta = require('../models/venta.model'); // Asegúrate de que la importación del modelo sea correcta
const VentaDetalle = require('../models/ventaDetalle.model');
const { sequelize } = require('../../dbconfig');

// Crear una venta con sus detalles
const createVenta = async (req, res) => {
  try {
    const { detalles, ...ventaData } = req.body;
    const nuevaVenta = await sequelize.transaction(async (t) => {
      const venta = await Venta.create(ventaData, { transaction: t });
      const detallesVenta = detalles.map((detalle) => ({
        ventaId: venta.id,
        ...detalle,
      }));
      await VentaDetalle.bulkCreate(detallesVenta, { transaction: t });
      return venta;
    });

    res.status(201).json(nuevaVenta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la venta' });
  }
};

// Anular una venta por ID
const anularVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id);
    if (venta) {
      await venta.update({
        anulado: true,
        fechaAnulacion: new Date(),
        usuarioAnulacionId: req.empresaId, // Asegúrate de tener el usuario actual disponible en req
      });
      res.status(200).json({ message: 'Venta anulada exitosamente' });
    } else {
      res.status(404).json({ error: 'Venta no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al anular la venta' });
  }
};

// Listar ventas paginadas y filtradas
const listarVentas = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, fecha, clienteId, sucursalId } = req.query;
    const condiciones = {
      empresaId: req.empresaId,
    };

    if (fecha) {
      condiciones.fechaVenta = { [Op.gte]: new Date(fecha) };
    }
    if (clienteId) {
      condiciones.clienteId = clienteId;
    }
    if (sucursalId) {
      condiciones.sucursalId = sucursalId;
    }

    const offset = (page - 1) * pageSize;
    const { rows: ventas, count } = await Venta.findAndCountAll({
      where: condiciones,
      include: [{ model: VentaDetalle, as: 'detalles' }],
      offset,
      limit: pageSize,
    });

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page: Number(page),
      pageSize: Number(pageSize),
      ventas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al listar las ventas' });
  }
};

module.exports = {
  createVenta,
  anularVenta,
  listarVentas,
};
