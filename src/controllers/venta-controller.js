const { Op } = require("sequelize");
const Venta = require("../models/venta.model");
const Cobranza = require("../models/cobranza.model");
const VentaDetalle = require("../models/ventaDetalle.model");
const CobranzaDetalle = require("../models/cobranzaDetalle.model");
const { sequelize } = require("../../dbconfig");
const moment = require("moment");
const Numeracion = require("../models/numeracion.model");
const Cliente = require("../models/cliente.model");
const Sucursal = require("../models/sucursal.model");
const FormaVenta = require("../models/formaVenta.model");
const Usuario = require("../models/usuario.model");
const ListaPrecio = require("../models/listaPrecio.model");
const Variante = require("../models/variante.model");
const Presentacion = require("../models/presentacion.model");
const Variedad = require("../models/variedad.model");
const Producto = require("../models/producto.model");
const Unidad = require("../models/unidad.model"); 
const Credito = require("../models/credito.model"); 
const  {generarCDC,generarCodigoSeguridad } = require('../helpers/cdc-helper');
const Empresa = require("../models/empresa.model"); 
// Comprimir XML
//const compressedXml = zlib.gzipSync(xml);
// Descomprimir XML
//const decompressedXml = zlib.gunzipSync(compressedXml).toString();

const {   tipoContribuyente,tiposEmisiones
} = require('../constantes/Constante.constant'); 
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const venta = await Venta.findByPk(id, {
      include: [
        { model: Usuario, as: "vendedorCreacion", attributes: ["usuario"] },
        { model: Usuario, as: "vendedorAnulacion", attributes: ["usuario"] },
        { model: ListaPrecio, as: "listaPrecio", attributes: ["descripcion"] },
        {
          model: Cliente,
          as: "cliente",
          attributes: [
            "nroDocumento",
            "razonSocial",
            "direccion",
            "telefono",
            "cel",
            "latitud",
            "longitud"
          ]
        },
        { model: FormaVenta, as: "formaVenta", attributes: ["descripcion"] },
        {
          model: Sucursal,
          as: "sucursal",
          attributes: ["descripcion", "direccion", "telefono", "cel"]
        }
      ]
    });
    if (!venta) {
      return res.status(404).json({ error: "Venta not found" });
    }
    const detallesVenta = await VentaDetalle.findAll({
      where: { ventaId: id },
      include: [
        {
          model: Variante,
          as: "variante", // Asegúrate de usar el alias correcto aquí
          include: [
            {
              model: Presentacion,
              as: "presentacion", // Asegúrate de usar el alias correcto aquí
              attributes: ["id", "descripcion", "size"]
            },
            {
              model: Variedad,
              as: "variedad", // Asegúrate de usar el alias correcto aquí
              attributes: ["id", "descripcion", "color"]
            },
            {
              model: Producto,
              as: "producto", // Asegúrate de usar el alias correcto aquí
              attributes: ["nombre"]
            },
            {
              model: Unidad,
              as: "unidad", // Asegúrate de usar el alias correcto aquí
              attributes: ["code"]
            }
          ]
        }
      ]
    });
    if (detallesVenta.length === 0) {
      return res.status(404).json({ error: "No details found for this venta" });
    }

    res.status(200).json({
      detalles: detallesVenta,
      venta: venta
    });
  } catch (error) {
    console.error("Error in getPdf:", error);
    res.status(500).json({ error: error?.original?.detail ||   "Internal Server Error!!!" });
  }
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
      cobranza,
      totalKg
    } = req.body;
    let cobranzaId = null;
    // Validar datos
    if (!clienteId) {
      throw new Error("El campo clienteId es obligatorio");
    }
    if (!detalles.length) {
      throw new Error("Debe haber al menos un detalle");
    }
    const formaVenta = await FormaVenta.findByPk(formaVentaId, {
      transaction: t
    });
    const cliente  = await Cliente.findByPk(clienteId, {      transaction: t    });
     if (cobranza && formaVenta.dias == 0) {
      const {
        importeAbonado,
        fechaCobranza,
        importeCobrado,
        saldo,
        tipo
      } = cobranza;
      const cobranzaNew = await Cobranza.create(
        {
          id: null,
          empresaId,
          sucursalId,
          usuarioCreacionId: id,
          fechaCobranza,
          importeAbonado,
          importeCobrado,
          saldo,
          tipo
        },
        { transaction: t }
      );

      if (!cobranza.detalle || cobranza.detalle.length < 1) {
        throw new Error("detalle de cobranza es obligatorio");
      }
      await CobranzaDetalle.bulkCreate(
        cobranza.detalle.map(d => ({
          ...d,
          cobranzaId: cobranzaNew.id,
          id: null
        })),
        { transaction: t }
      );
      cobranzaId = cobranzaNew.id;
    }
    // Generar número de factura
    const numeracion = await Numeracion.findByPk(numeracionId, {
      transaction: t
    });
    const codigoSeguridad =generarCodigoSeguridad();
    const empresa = await Empresa.findByPk(empresaId)
    const tipoComprobante =tipoContribuyente.find(t=>t.id == empresa.tipoContId)
    const tipoEmision = tiposEmisiones.find(t=>t.codigo == 1)
    const fecha = moment(new Date()).format("YYYY-MM-DD");
    numeracion.ultimoNumero += 1;
    const nroComprobante = `${numeracion.serie}-${numeracion.ultimoNumero
    .toString()
    .padStart(7, "0")}`;
    console.log(importeIva10);
    console.log(numeracion)
    const cdc = generarCDC(numeracion.itide,empresa.ruc ,nroComprobante,tipoComprobante.id,fecha,tipoEmision.codigo,codigoSeguridad);
    if (formaVenta && formaVenta.dias > 0) {
      const nuevoCredito = await Credito.create({
        empresaId,
        sucursalId,
        formaVentaId,
        cobranzaId: null,
        pagado: false,
        usuarioCreacionId: id,
        fechaVencimiento: moment(fechaVenta)
          .add(formaVenta.dias, "days")
          .format("YYYY-MM-DD"), // Calcula fecha de vencimiento
        fecha: fechaVenta,
        observacion: nroComprobante,
        importeTotal,
        clienteId
      });
    }
    // Guardar venta
    const venta = await Venta.create(
      {
        codigoSeguridad,
        cdc,
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
        modoEntrega: "CONTRAENTREGA",
        nroComprobante,
        cobranzaId: cobranzaId,
        itide: numeracion.itide,
        porcDescuento,
        importeIva5,
        importeIva10,
        importeIvaExenta,
        importeDescuento,
        importeNeto,
        importeSubtotal,
        importeTotal,
        estado:'Pendiente', 
        totalKg: totalKg ? Number((totalKg / 1000).toFixed(2)) : 0
      },
      { transaction: t }
    );
 
    // Guardar detalles
    await VentaDetalle.bulkCreate(
      detalles.map(detalle => ({
        ventaId: venta.id,
        ...detalle,
        totalKg: detalle.totalKg
          ? Number((detalle.totalKg / 1000).toFixed(2))
          : 0
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
    res.status(500).json({ error: error?.original?.detail ||   "Error al crear la venta" });
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
        estado:'Pendiente',
        fechaAnulacion: new Date(),
        usuarioAnulacionId: req.usuario.id
      });

      //si el tipo de venta es  credito  debo eliminar el item del listado
      const formaVenta = await FormaVenta.findByPk(venta.formaVentaId);
      if (formaVenta && formaVenta.dias > 0) {
        const creditoAgregado = await Credito.findOne({ ventaId: venta.id });
        await creditoAgregado.destroy();
      }

      if (venta.cobranzaId) {
        const cobranza = await Cobranza.findByPk(venta.cobranzaId);
        await cobranza.update({
          anulado: true,
          fechaAnulacion: new Date(),
          usuarioAnulacionId: req.usuario.id
        });
      }
      res.status(200).json({ message: "Venta anulada exitosamente" });
    } else {
      res.status(404).json({ error: "Venta no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al anular la venta" });
  }
};

// Listar ventas paginadas y filtradas
const listarVentas = async (req, res) => {
  console.log("listarVentas");
  try {
    const {
      page = 1,
      pageSize = 10,
      fechaDesde,
      fechaHasta,
      clienteId,
      sucursalId,
      listaPrecioId,
      formaVentaId,
      nroComprobante
    } = req.params;
    const { empresaId } = req.usuario;
    console.log(
      page,
      pageSize,
      fechaDesde,
      fechaHasta,
      clienteId,
      sucursalId,
      listaPrecioId,
      formaVentaId,
      nroComprobante
    );
    const condiciones = {
      empresaId
    };
    const desde = moment(fechaDesde).format("YYYY-MM-DD");
    const hasta = moment(fechaHasta).format("YYYY-MM-DD");
    console.log(fechaDesde);
    console.log(desde);
    if (desde && hasta) {
      condiciones.fechaVenta = {
        [Op.gte]: desde, // Mayor o igual que la fecha desde
        [Op.lte]: hasta  // Menor o igual que la fecha hasta
      };
    }

    if (clienteId > 0) {
      condiciones.clienteId = clienteId;
    }

    if (sucursalId > 0) {
      condiciones.sucursalId = sucursalId;
    }

    if (listaPrecioId > 0) {
      condiciones.listaPrecioId = listaPrecioId;
    }

    if (formaVentaId > 0) {
      condiciones.formaVentaId = formaVentaId;
    }
    if (nroComprobante && nroComprobante.length > 2) {
      condiciones.nroComprobante = {
        [Op.iLike]: `%${nroComprobante.toLowerCase()}%`
      };
    }

    const offset = (page - 1) * pageSize;
    const { rows: ventas, count } = await Venta.findAndCountAll({
      where: condiciones,
      include: [
        { model: Usuario, as: "vendedorCreacion", attributes: ["usuario"] },
        {
          model: Cliente,
          as: "cliente",
          attributes: ["nroDocumento", "razonSocial"]
        },
        {
          model: FormaVenta,
          as: "formaVenta",
          attributes: ["id", "descripcion"]
        },
        {
          model: ListaPrecio,
          as: "listaPrecio",
          attributes: ["id", "descripcion"]
        },
        {
          model: Sucursal,
          as: "sucursal",
          attributes: ["descripcion", "direccion", "telefono", "cel"]
        }
      ],
      order: [["id", "ASC"]], // Ordena por ID en orden descendente
      offset,
      limit: pageSize
    });

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page: Number(page),
      pageSize: Number(pageSize),
      ventas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al listar las ventas" });
  }
};

 
 
module.exports = {
  getById,
  createVenta,
  anularVenta,
  listarVentas, 
 };



