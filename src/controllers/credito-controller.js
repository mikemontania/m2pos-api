const { Op, fn, col, literal } = require("sequelize");
const Credito = require("../models/credito.model");
const Cliente = require("../models/cliente.model");
const Documento = require("../models/documento.model");
const CondicionPago = require("../models/condicionPago.model");
const Usuario = require("../models/usuario.model");
const { insertarHistorialCredito } = require("./historialCredito-controller");
const moment = require("moment");
const { sequelize } = require("../../dbconfig");

const obtenerWidget = async (req, res) => {
  try {
    const { empresaId } = req.usuario;

    const { fechaInicio, fechaFin } = req.params;

    const resultados = await Credito.findAll({
      attributes: [
        [fn("SUM", col("importe_total")), "totalMonto"],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN estado = 'PENDIENTE' AND CAST(fecha_vencimiento AS date) < CURRENT_DATE THEN importe_total ELSE 0 END`
            )
          ),
          "totalVencidos"
        ],
        [
          fn(
            "SUM",
            literal(`CASE WHEN estado = 'PAGADO' THEN importe_total ELSE 0 END`)
          ),
          "totalPagados"
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN estado = 'PENDIENTE' AND CAST(fecha_vencimiento AS date) >= CURRENT_DATE THEN importe_total ELSE 0 END`
            )
          ),
          "totalPendientesACobrar"
        ],
        [fn("COUNT", col("id")), "totalCreditos"],
        [
          fn("COUNT", literal(`CASE WHEN estado = 'PAGADO' THEN 1 END`)),
          "cantidadPagados"
        ],
        [
          fn(
            "COUNT",
            literal(
              `CASE WHEN estado = 'PENDIENTE' AND CAST(fecha_vencimiento AS date) >= CURRENT_DATE THEN 1 END`
            )
          ),
          "cantidadPendientes"
        ],
        [
          fn(
            "COUNT",
            literal(
              `CASE WHEN estado = 'PENDIENTE' AND CAST(fecha_vencimiento AS date) < CURRENT_DATE THEN 1 END`
            )
          ),
          "cantidadVencidos"
        ]
      ],
      where: {
        empresaId,
        fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        },
        anulado: false
      },
      raw: true
    });

    res.json(resultados[0]);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const buscarPaginado = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    let {
      page = 1,
      size = 10,
      fechaInicio,
      fechaFin,
      clienteId,
      nroComprobante,
      estado, // puede ser: 'PENDIENTE', 'PAGADO', 'VENCIDO', 'TODOS', 'null'
    } = req.params;

    const where = {
      anulado: false
    };

    if (empresaId) where.empresaId = empresaId;

    // Verificamos si el estado es VENCIDO
    if (estado === 'VENCIDO') {
      where[Op.and] = [
        literal('"Credito".fecha_vencimiento < CURRENT_DATE'),
        { estado: { [Op.ne]: "PAGADO" } }
      ];
    } else if (estado && estado !== 'TODOS' && estado !== 'null') {
      // Sólo incluimos estado si no es TODOS ni null
      where.estado = estado;
    }

    if (clienteId && clienteId !== 'null') where.clienteId = clienteId;
    if (nroComprobante && nroComprobante !== 'null')
      where.nroComprobante = { [Op.iLike]: `%${nroComprobante}%` };

    if (fechaInicio && fechaFin && fechaInicio !== 'null' && fechaFin !== 'null')
      where.fecha = { [Op.between]: [fechaInicio, fechaFin] };

    const creditos = await Credito.findAndCountAll({
      where,
      include: [
        { model: Cliente, as: "cliente" },
        { model: CondicionPago, as: "condicionPago" }
      ],
      limit: parseInt(size),
      offset: (parseInt(page) - 1) * parseInt(size),
      order: [
        ["id", "ASC"], // Ordenamos por id (de manera ascendente)
        
      ],
    });

    res.json({
      total: creditos.count,
      pages: Math.ceil(creditos.count / size),
      data: creditos.rows
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const buscarLista = async (req, res) => {
  try {
    const { empresaId } = req.usuario;

    const {
      fechaInicio,
      fechaFin,
      clienteId,
      nroComprobante,
      estado,
      diasMora
    } = req.params;

    const where = {
      anulado: false
    };

    if (empresaId) where.empresaId = empresaId;
    if (clienteId) where.clienteId = clienteId;
    if (nroComprobante)
      where.nroComprobante = { [Op.iLike]: `%${nroComprobante}%` };
    if (estado) where.estado = estado;
    if (fechaInicio && fechaFin)
      where.fecha = { [Op.between]: [fechaInicio, fechaFin] };

    if (diasMora !== undefined && diasMora !== null) {
      where[Op.and] = [
        literal('"Credito".fecha_vencimiento < CURRENT_DATE'),
        { estado: { [Op.ne]: "PAGADO" } }
      ];
    }

    const creditos = await Credito.findAll({
      where,
      include: [
        { model: Cliente, as: "cliente" },
        { model: Documento, as: "documento" },
        { model: CondicionPago, as: "condicionPago" }
      ],
      order: [["fecha", "DESC"]]
    });

    res.json(creditos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const pagarCredito = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { creditoId } = req.params;

    const credito = await Credito.findByPk(creditoId);
    if (!credito) {
      throw new Error("Crédito no encontrado");
    }

    if (credito.anulado) {
      throw new Error("El crédito está anulado");
    }
    const saldoAnterior = credito.saldoPendiente;
    const fecha = moment(new Date()).format("YYYY-MM-DD");

    credito.empresaId = empresaId;
    credito.saldoPendiente = 0;
    credito.estado = "PAGADO";
    credito.fechaPago = new Date();
    credito.fechaModificacion = new Date();

    await insertarHistorialCredito(
      credito.empresaId,
      credito.id,
      fecha,
      saldoAnterior && saldoAnterior > 0
        ? saldoAnterior - credito.saldoPendiente
        : credito.saldoPendiente,
      saldoAnterior,
      credito.saldoPendiente,
      "PAGADO",
      credito.usuarioCreacionId,
      credito.timbrado,
      credito.nroComprobante
    );

    await credito.save();
    res.json(credito);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};
const crearCreditoDesdeDocumento = async documento => {
  try {
    if (!documento) {
      throw new Error("Documento no encontrado");
    }
    const condicionPago = await CondicionPago.findByPk(
      documento.condicionPagoId
    );
    console.log("condicionPago", condicionPago);
    const fechaActual = moment().startOf("day");
    const fechaVencimiento = moment(fechaActual).add(
      condicionPago.dias,
      "days"
    );
    // Crear el crédito a partir del documento
    const nuevoCredito = await Credito.create({
      empresaId: documento.empresaId,
      condicionPagoId: documento.condicionPagoId,
      documentoId: documento.id,
      anulado: false,
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
      fecha: documento.fecha, // Fecha del documento
      usuarioCreacionId: documento.usuarioCreacionId,
      timbrado: documento.timbrado,
      nroComprobante: documento.nroComprobante,
      cantDias: condicionPago.dias,
      fechaVencimiento: fechaVencimiento.format("YYYY-MM-DD"),
      importeTotal: documento.importeTotal,
      saldoPendiente: documento.importeTotal,
      estado: "PENDIENTE",
      clienteId: documento.clienteId
    });
    //crear registro de historial
    await insertarHistorialCredito(
      documento.empresaId,
      nuevoCredito.id,
      documento.fecha,
      documento.importeTotal,
      0,
      documento.importeTotal,
      "CREACION",
      documento.usuarioCreacionId,
      documento.timbrado,
      documento.nroComprobante
    );
    return nuevoCredito;
  } catch (error) {
    console.error("Error al crear crédito:", error.message);
    throw error;
  }
};
const ajustarCreditoPorNC = async (
  documentoIdOriginal,
  timbrado,
  nroComprobante,
  saldoPendiente,
  documentoIdNuevo
) => {
  const t = await sequelize.transaction(); // Crear la transacción

  try {
    const credito = await Credito.findOne({
      where: {
        documentoId: documentoIdOriginal,
        anulado: false
      },
      include: [
        { model: Cliente, as: "cliente" },
        { model: CondicionPago, as: "condicionPago" },
        { model: Usuario, as: "usuarioCreacion" }
      ],
      transaction: t, // Usar la transacción
     });

    if (!credito) {
      await t.rollback(); // <- cerrar correctamente la transacción
      return null;
    }

    if (credito.estado === "PAGADO" || credito.saldoPendiente === 0) {
      await t.rollback(); // No hace falta guardar, revertimos
      return credito;
    }

    // Ajustar valores
    if (documentoIdNuevo != null) {
      credito.documentoId = documentoIdNuevo;
    }
    const saldoAnterior = credito.saldoPendiente;
    const fecha = moment(new Date()).format("YYYY-MM-DD");
    credito.timbrado = timbrado;
    credito.nroComprobante = nroComprobante;
    credito.saldoPendiente = saldoPendiente;
    credito.fechaModificacion = new Date();

    await insertarHistorialCredito(
      credito.empresaId,
      credito.id,
      fecha,
      saldoAnterior && saldoAnterior > 0
        ? saldoAnterior - saldoPendiente
        : saldoPendiente,
      saldoAnterior,
      saldoPendiente,
      "NOTA CREDITO",
      credito.usuarioCreacionId,
      credito.timbrado,
      credito.nroComprobante
    );

    if (credito.saldoPendiente === 0) {
      credito.estado = "PAGADO";
      credito.fechaPago = new Date();
    }

    await credito.save({ transaction: t });

    await t.commit(); // Confirmar la transacción
    return credito;
  } catch (error) {
    await t.rollback(); // Revertir si algo falla
    console.error("Error al ajustar crédito:", error.message);
    throw error;
  }
};

const anularCredito = async (creditoId, usuarioAnulacionId) => {
  const credito = await Credito.findByPk(creditoId);
  if (!credito) {
    throw new Error("Crédito no encontrado");
  }

  if (credito.anulado) {
    throw new Error("El crédito ya está anulado");
  }

  credito.anulado = true;
  credito.usuarioAnulacionId = usuarioAnulacionId;
  credito.fechaModificacion = new Date();

  const fecha = moment(new Date()).format("YYYY-MM-DD");
  await insertarHistorialCredito(
    credito.empresaId,
    credito.id,
    fecha,
    credito.saldoDisponible,
    credito.saldoDisponible,
    0,
    "ANULACION",
    credito.usuarioCreacionId,
    credito.timbrado,
    credito.nroComprobante
  );

  await credito.save();
  return credito;
};

module.exports = {
  ajustarCreditoPorNC,
  buscarPaginado,
  buscarLista,
  obtenerWidget,
  crearCreditoDesdeDocumento,
  anularCredito,
  pagarCredito
};
