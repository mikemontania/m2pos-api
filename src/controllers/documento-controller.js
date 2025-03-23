const { Op } = require("sequelize");
const Documento = require("../models/documento.model");
const Cobranza = require("../models/cobranza.model");
const DocumentoDetalle = require("../models/documentoDetalle.model");
const CobranzaDetalle = require("../models/cobranzaDetalle.model");
const { sequelize } = require("../../dbconfig");
const moment = require("moment");
const Numeracion = require("../models/numeracion.model");
const Cliente = require("../models/cliente.model");
const Sucursal = require("../models/sucursal.model");
const CondicionPago = require("../models/condicionPago.model");
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
const TablaSifen = require("../models/tablaSifen.model");
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const documento = await Documento.findByPk(id, {
      include: [
        { model: Usuario, as: "vendedorCreacion", attributes: ["usuario"] },
        { model: Usuario, as: "vendedorAnulacion", attributes: ["usuario"] },
        { model: ListaPrecio, as: "listaPrecio", attributes: ["descripcion"] },
        {
          model: Cliente,
          as: "cliente" 
        },
        {
          model: TablaSifen,
          as: "tipoDocumento", 
        },
        { model: CondicionPago, as: "condicionPago", attributes: ["descripcion"] },
        {
          model: Sucursal,
          as: "sucursal",
          attributes: ["descripcion", "direccion", "telefono", "cel"]
        }
      ]
    });
    if (!documento) {
      return res.status(404).json({ error: "Documento not found" });
    }
    const detallesDocumento = await DocumentoDetalle.findAll({
      where: { documentoId: id },
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
   /*  if (detallesDocumento.length === 0) {
      return res.status(404).json({ error: "No details found for this documento" });
    } */

    res.status(200).json({
      detalles: detallesDocumento,
      documento: documento
    });
  } catch (error) {
    console.error("Error in getPdf:", error);
    res.status(500).json({ error: error?.original?.detail ||   "Internal Server Error!!!" });
  }
};

// Crear una documento con sus detalles
const createDocumento = async (req, res) => {
  const fecha = moment(new Date()).format("YYYY-MM-DD");
  const { id, empresaId } = req.usuario;
  const t = await sequelize.transaction(); // Inicia la transacción
  try {
    const {
     
      sucursalId,
      numeracionId,
      listaPrecioId,
      condicionPagoId,
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
    const condicionPago = await CondicionPago.findByPk(condicionPagoId, {
      transaction: t
    });
    const cliente  = await Cliente.findByPk(clienteId, {      transaction: t    });
     if (cobranza && condicionPago.dias == 0) {
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
    if (condicionPago && condicionPago.dias > 0) {
      const nuevoCredito = await Credito.create({
        empresaId,
        sucursalId,
        condicionPagoId,
        cobranzaId: null,
        pagado: false,
        usuarioCreacionId: id,
        fechaVencimiento: moment(fecha)
          .add(condicionPago.dias, "days")
          .format("YYYY-MM-DD"), // Calcula fecha de vencimiento
        fecha: fecha,
        observacion: nroComprobante,
        importeTotal,
        clienteId
      });
    }
    // Guardar documento
    const documento = await Documento.create(
      {
        codigoSeguridad,
        cdc,
        empresaId,
        sucursalId,
        listaPrecioId,
        condicionPagoId,
        clienteId,
        anulado: false,
        enviado: false,
        usuarioCreacionId: id,
        fecha,
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
        tipoDoc:'FCT'  ,
        calculables: 'SI',
        importeDevuelto:0,
        estado:'Pendiente', 
        totalKg: totalKg ? Number((totalKg / 1000).toFixed(2)) : 0
      },
      { transaction: t }
    );
 
    // Guardar detalles
    await DocumentoDetalle.bulkCreate(
      detalles.map(detalle => ({
        documentoId: documento.id,
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

    res.status(201).json(documento);
  } catch (error) {
    // Si hay algún error, realiza un rollback de la transacción
    console.error(error);
    await t.rollback();
    res.status(500).json({ error: error?.original?.detail ||   "Error al crear la documento" });
  }
};
 

const crearNotaCredito = async (req, res) => { 
  const { id: usuarioId, empresaId } = req.usuario;
  const t = await sequelize.transaction(); // Inicia la transacción
  try {
    const {
      docAsociadoId,
      cdcAsociado,
      sucursalId,
      numeracionNotaCredId,
      listaPrecioId,
      condicionPagoId, 
      idMotEmi,
      clienteId,
      detalles ,
      porcDescuento,
      importeIva5,
      importeIva10,
      importeIvaExenta,
      importeDescuento,
      importeNeto,
      importeSubtotal,totalKg,
      importeTotal,
       importeAnterior ,
        importeDevuelto 
    } = req.body;
     
    // Validar datos
    if (!clienteId) {
      throw new Error("El campo clienteId es obligatorio");
    }
    //calcular totales
    
      console.log('body',{
        docAsociadoId,
        cdcAsociado,
        sucursalId,
        numeracionNotaCredId,
        listaPrecioId,
        condicionPagoId, 
        clienteId,
        detalles ,porcDescuento,
        importeIva5,
        importeIva10,
        importeIvaExenta,
        importeDescuento,
        importeNeto,
        importeSubtotal,totalKg,
        importeTotal
      })

    // Generar número de factura
    const numeracion = await Numeracion.findByPk(numeracionNotaCredId, {
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
    const cdcGenerado = generarCDC(numeracion.itide,empresa.ruc ,nroComprobante,tipoComprobante.id,fecha,tipoEmision.codigo,codigoSeguridad);
    
    // Guardar documento
    const documento = await Documento.create(
      {
        codigoSeguridad,
        cdc:cdcGenerado,
        empresaId,
        sucursalId,
        listaPrecioId,
        condicionPagoId,
        clienteId,
        anulado: false,
        enviado: false,
        usuarioCreacionId: usuarioId,
        fecha, 
        idMotEmi,
        cdcAsociado,
        docAsociadoId, 
        fechaInicio: numeracion.inicioTimbrado,
        fechaFin: numeracion.finTimbrado,
        timbrado: numeracion.timbrado,
        modoEntrega: "CONTRAENTREGA",
        nroComprobante, 
        itide: numeracion.itide,
        porcDescuento,
        importeIva5,
        importeIva10,
        importeIvaExenta,
        importeDescuento,
        importeNeto,
        importeSubtotal,
        importeTotal,
        tipoDoc:'NCR'  ,
        calculables: 'SI',
        importeAnterior ,
        importeDevuelto ,
        estado:'Pendiente', 
        totalKg: totalKg ? Number((totalKg / 1000).toFixed(2)) : 0
      },
      { transaction: t }
    );
    // Guardar detalles
    //Nota de credito no siempre tiene detalles
     
   await DocumentoDetalle.bulkCreate(
     detalles.map(detalle => ({
       documentoId: documento.id,
       ...detalle,
       totalKg: detalle.totalKg
         ? Number((detalle.totalKg / 1000).toFixed(2))
         : 0
     })),
     { transaction: t }
   );  

   if (docAsociadoId) {
    const documentoAsociado = await Documento.findByPk(docAsociadoId);
    await documentoAsociado.update({  
      calculables:'NO', 
    });
  }
    // Actualizar numeración
    await numeracion.save({ transaction: t }); 
    // Commit de la transacción si todo fue exitoso
    await t.commit(); 
    res.status(201).json(documento);
  } catch (error) {
    // Si hay algún error, realiza un rollback de la transacción
    console.error(error);
    await t.rollback();
    res.status(500).json({ error: error?.original?.detail ||   "Error al crear la NC" });
  }
};


// Anular una documento por ID
const anularDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const documento = await Documento.findByPk(id);
    if (documento) {
      await documento.update({
        anulado: true,
        calculables:'NO',
        fechaAnulacion: new Date(),
        usuarioAnulacionId: req.usuario.id
      });

      if (documento?.docAsociadoId) {
        const documentoAsociado = await Documento.findByPk(documento?.docAsociadoId);
        await documentoAsociado.update({  
          calculables:'SI', 
        });
      }



      //si el tipo de documento es  credito  debo eliminar el item del listado
      const condicionPago = await CondicionPago.findByPk(documento.condicionPagoId);
      if (condicionPago && condicionPago.dias > 0) {
        const creditoAgregado = await Credito.findOne({ documentoId: documento.id });
        await creditoAgregado.destroy();
      }

      if (documento.cobranzaId) {
        const cobranza = await Cobranza.findByPk(documento.cobranzaId);
        await cobranza.update({
          anulado: true,
          fechaAnulacion: new Date(),
          usuarioAnulacionId: req.usuario.id
        });
      }
      res.status(200).json({ message: "Documento anulada exitosamente" });
    } else {
      res.status(404).json({ error: "Documento no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al anular la documento" });
  }
};

// Listar documentos paginadas y filtradas
const listarDocumentos = async (req, res) => {
  console.log("listarDocumentos");
  try {
    const {
      page = 1,
      pageSize = 10,
      fechaDesde,
      fechaHasta,
      clienteId,
      sucursalId,
      listaPrecioId,
      condicionPagoId,
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
      condicionPagoId,
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
      condiciones.fecha = {
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

    if (condicionPagoId > 0) {
      condiciones.condicionPagoId = condicionPagoId;
    }
    if (nroComprobante && nroComprobante.length > 2) {
      condiciones.nroComprobante = {
        [Op.iLike]: `%${nroComprobante.toLowerCase()}%`
      };
    }

    const offset = (page - 1) * pageSize;
    const { rows: documentos, count } = await Documento.findAndCountAll({
      where: condiciones,
      include: [
        { model: Usuario, as: "vendedorCreacion", attributes: ["usuario"] },
        {
          model: Cliente,
          as: "cliente",
          attributes: ["nroDocumento", "razonSocial"]
        },
        {
          model: CondicionPago,
          as: "condicionPago",
          attributes: ["id", "descripcion"]
        },
        {
          model: TablaSifen,
          as: "tipoDocumento", 
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
      documentos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al listar las documentos" });
  }
};

 
 
module.exports = {
  getById,
  crearNotaCredito,
  createDocumento,
  anularDocumento,
  listarDocumentos, 
 };



