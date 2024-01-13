const { Op } = require('sequelize');
const Venta = require('../models/venta.model'); // Asegúrate de que la importación del modelo sea correcta
const VentaDetalle = require('../models/ventaDetalle.model');
const { sequelize } = require('../../dbconfig');
 const moment = require('moment');
const Numeracion = require('../models/numeracion.model');
const getById = async (req, res) => {
  const { id } = req.params;

  const venta = await Venta.findByPk(id);

  const detallesVenta = await VentaDetalle.findAll({where: { ventaId: id }  });
  res.status(200).json({
    detallesVenta,
    venta,
  });
};
// Crear una venta con sus detalles
const createVenta = async (req, res) => {
  const fechaVenta = moment(new Date()).format("YYYY-MM-DD");
  const { id, empresaId } = req.usuario;
  const t = await sequelize.transaction(); // Inicia la transacción

  try {
    const {
      sucursalId,
      numeracionId,
      listaPrecioId,
      formaVentaId,
      porcDescuento,
      importeIva5,
      importeIva10,
      importeIvaExenta,
      importeDescuento,
      importeNeto,
      importeSubtotal,
      importeTotal,
      clienteId,
      detalles,
      totalKg
    } = req.body;

    // Validar datos
    if (!clienteId) {
      throw new Error("El campo clienteId es obligatorio");
    }
    if (!detalles.length) {
      throw new Error("Debe haber al menos un detalle");
    }

    // Generar número de factura
    const numeracion = await Numeracion.findByPk(numeracionId, { transaction: t });
    numeracion.ultimoNumero += 1;
    const nroComprobante = `${numeracion.serie}-${numeracion.ultimoNumero.toString().padStart(7, "0")}`;
console.log(importeIva10)
    // Guardar venta
    const venta = await Venta.create({
      empresaId,
      sucursalId,
      listaPrecioId,
      formaVentaId,
      clienteId,
      anulado: false,
      enviado: false,
      usuarioCreacionId: id,
      fechaVenta,
      fechaInicio: numeracion.inicioTimbrado,
      fechaFin: numeracion.finTimbrado,
      timbrado: numeracion.timbrado,
      modoEntrega: 'CONTRAENTREGA',
      nroComprobante,
      porcDescuento,
      importeIva5,
      importeIva10,
      importeIvaExenta,
      importeDescuento,
      importeNeto,
      importeSubtotal,
      importeTotal,
      totalKg
    }, { transaction: t });

    // Guardar detalles
    await VentaDetalle.bulkCreate(
      detalles.map(detalle => ({
        ventaId: venta.id,
        ...detalle,
      })),
      { transaction: t }
    );

    // Actualizar numeración
    await numeracion.save({ transaction: t });

    // Commit de la transacción si todo fue exitoso
    await t.commit();

    res.status(201).json(venta);
  } catch (error) {
    // Si hay algún error, realiza un rollback de la transacción
    console.error(error);
    await t.rollback();
    res.status(500).json({ error: "Error al crear la venta" });
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
    const { page = 1, pageSize = 10, fecha, clienteId, sucursalId } = req.params;
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
  getById,
  createVenta,
  anularVenta,
  listarVentas,
};
