const { sequelize } = require("../../dbconfig");
const moment = require("moment");
const Cliente = require("../models/cliente.model");
const ClienteSucursal = require("../models/ClienteSucursal.model");
const Pedido = require("../models/pedido.model");
const PedidoDetalle = require("../models/pedidoDetalle.model");
const Variante = require("../models/variante.model"); 

const TIPO_CONTRIBUYENTE = [
  { id: 1, descripcion: "PERSONAFISICA" },
  { id: 2, descripcion: "PERSONAJURIDICA" }
];

const TIPOS_DOCUMENTO = [
  { id: 1, descripcion: "RUC" },
  { id: 2, descripcion: "CI" },
  { id: 3, descripcion: "GUBERNAMENTAL" },
  { id: 4, descripcion: "EXTRANJERO" }
];

const TIPO_RECEPTOR = [
  { id: 1, descripcion: "CONTRIBUYENTE" },
  { id: 2, descripcion: "NOCONTRIBUYENTE" }
];

// Helpers corregidos
const esDescripcionValida = (type, descripcion) => {
  const listas = {
    tipoDocumento: TIPOS_DOCUMENTO,
    naturalezaReceptor: TIPO_RECEPTOR,
    tipoContribuyente: TIPO_CONTRIBUYENTE
  };
  const data = listas[type];
  if (!data) return false;
  return data.some(o => o.descripcion === descripcion);
};

const findValueId = (type, descripcion) => {
  const listas = {
    tipoDocumento: TIPOS_DOCUMENTO,
    naturalezaReceptor: TIPO_RECEPTOR,
    tipoContribuyente: TIPO_CONTRIBUYENTE
  };
  const data = listas[type];
  if (!data) return null;
  const obj = data.find(o => o.descripcion === descripcion);
  return obj ? obj.id : null;
};

/**
 * Controlador para recibir pedidos desde ecommerce
 */
const crearPedido = async (req, res) => {
  let t = null;
  try {
    t = await sequelize.transaction();
    console.log(req);
    const { id:usuarioCreacionId, empresaId, sucursalId } = req.usuario || {};
   
    const {
      condicionPagoId,
      listaPrecioId, 
      cliente: clienteData,
      pedido: pedidoData,
      detalles: detallesData
    } = req.body || {};

    // ===== VALIDACIONES INICIALES =====
    if (!empresaId || !sucursalId || !condicionPagoId || !listaPrecioId) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Faltan datos de configuración: empresaId, sucursalId, condicionPagoId o listaPrecioId"
      });
    }

    if (!clienteData || !clienteData.nroDocumento) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Los datos del cliente son obligatorios (nroDocumento requerido)"
      });
    }

    if (!detallesData || !Array.isArray(detallesData) || detallesData.length === 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Debe haber al menos un detalle en el pedido"
      });
    }

    // ===== PASO 01: VERIFICAR SI EXISTE EL CLIENTE =====
    let cliente = await Cliente.findOne({
      where: {
        nroDocumento: clienteData.nroDocumento,
        empresaId: empresaId
      },
      transaction: t
    });

    // ===== PASO 1.1: CREAR CLIENTE SI NO EXISTE =====
    if (!cliente) {
      // Validaciones sobre descripciones (usar campos correctos que envíe tu ecom)
      if (clienteData.tipoDocumento && !esDescripcionValida('tipoDocumento', clienteData.tipoDocumento)) {
        throw new Error("Valor desconocido para tipoDocumento");
      }
      if (clienteData.naturalezaReceptor && !esDescripcionValida('naturalezaReceptor', clienteData.naturalezaReceptor)) {
        throw new Error("Valor desconocido para naturalezaReceptor");
      }
      if (clienteData.tipoContribuyente && !esDescripcionValida('tipoContribuyente', clienteData.tipoContribuyente)) {
        throw new Error("Valor desconocido para tipoContribuyente");
      }

      const tipoOperacionId = findValueId('tipoDocumento', clienteData.tipoDocumento) || 2;
      const naturalezaReceptorId = findValueId('naturalezaReceptor', clienteData.naturalezaReceptor) || 2;
      const tipoContribuyenteId = findValueId('tipoContribuyente', clienteData.tipoContribuyente) || null;

      cliente = await Cliente.create(
        {
          empresaId,
          razonSocial: clienteData.razonSocial || clienteData.nombreFantasia || "CLIENTE ECOMMERCE",
          nombreFantasia: clienteData.nombreFantasia || clienteData.razonSocial || "CLIENTE ECOMMERCE",
          nroDocumento: clienteData.nroDocumento,
          tipoOperacionId: tipoOperacionId,
          naturalezaReceptor: naturalezaReceptorId,
          tipoContribuyente: tipoContribuyenteId,
          email: clienteData.email || "",
          excentoIva: false,
          puntos: 0,
          codigoPais: "PRY",
          tipoDocIdentidad: 5,
          activo: true,
          predeterminado: false,
          propietario: false,
          usuarioCreacionId: usuarioCreacionId || null
        },
        { transaction: t }
      );
    }

    // ===== PASO 02: CARGAR/CREAR SUCURSAL DEL CLIENTE =====
    let clienteSucursal = await ClienteSucursal.findOne({
      where: {
        clienteId: cliente.id,
        principal: true
      },
      transaction: t
    });

    if (!clienteSucursal) {
      clienteSucursal = await ClienteSucursal.create(
        {
          clienteId: cliente.id,
          empresaId,
          nombre: clienteData.razonSocial || 'Principal',
          direccion: clienteData.direccion || '',
          telefono: clienteData.telefono || '',
          cel: clienteData.cel || '',
          latitud: clienteData.latitud || 0,
          longitud: clienteData.longitud || 0,
          principal: true,
          activo: true,
          listaPrecioId,
          condicionPagoId,
          usuarioCreacionId: usuarioCreacionId || null,
          codDepartamento: null,
          codCiudad: null,
          codBarrio: null,
          obs: clienteData.observacion || ''
        },
        { transaction: t }
      );
    }

    // ===== PASO 03: PREPARAR DETALLES DEL PEDIDO =====
    const detallesPedido = [];
    let totalImporteSubtotal = 0;
    let totalImporteIva5 = 0;
    let totalImporteIva10 = 0;
    let totalImporteIvaExenta = 0;
    let totalImporteDescuento = 0;
    let totalKg = 0;

    let descuentoGlobalRestante = parseFloat(pedidoData?.globalDescuentoImporte || 0);

    for (const detalle of detallesData) {
      const variante = await Variante.findOne({
        where: { codErp: detalle.sku || detalle.codErp, empresaId },
        transaction: t
      });
      if (!variante) {
        throw new Error(`No se encontró el producto con SKU: ${detalle.sku || detalle.codErp}`);
      }

      const cantidad = parseFloat(detalle.cantidad) || 1;
      const importePrecio = parseFloat(detalle.precio || detalle.importePrecio) || 0;
      const importeSubtotal = cantidad * importePrecio;

      let porcDescuento = parseFloat(detalle.descuento || detalle.porcDescuento) || 0;
      let importeDescuento = (importeSubtotal * porcDescuento) / 100;

      if (descuentoGlobalRestante > 0) {
        const disponible = Math.max(0, importeSubtotal - importeDescuento);
        const aplicar = Math.min(descuentoGlobalRestante, disponible);
        importeDescuento += aplicar;
        descuentoGlobalRestante -= aplicar;
        porcDescuento = importeSubtotal > 0 ? (importeDescuento / importeSubtotal) * 100 : 0;
      }

      if (importeDescuento > importeSubtotal) importeDescuento = importeSubtotal;

      const importeTotal = importeSubtotal - importeDescuento;
      const porcIva = parseFloat(variante.porcIva) || 10;

      // Ajusta la lógica de IVA según tu definición real:
      const importeIva10 = porcIva === 10 ? Math.round((importeTotal * 10) / 110) : 0;
      const importeIva5 = porcIva === 5 ? Math.round((importeTotal * 5) / 105) : 0;
      const importeIvaExenta = porcIva === 0 ? importeTotal : 0;
      const importeNeto = importeTotal - importeIva10 - importeIva5 - importeIvaExenta;

      const totalKgItem = parseFloat(detalle.totalKg) || 0;

      totalImporteSubtotal += importeSubtotal;
      totalImporteDescuento += importeDescuento;
      totalImporteIva5 += importeIva5;
      totalImporteIva10 += importeIva10;
      totalImporteIvaExenta += importeIvaExenta;
      totalKg += totalKgItem;

      detallesPedido.push({
        varianteId: variante.id,
        cantidad,
        importePrecio,
        porcIva,
        porcDescuento,
        importeDescuento,
        importeNeto,
        importeSubtotal,
        importeTotal,
        importeIva5,
        importeIva10,
        importeIvaExenta,
        anticipo: 0,
        totalKg: totalKgItem ? Number((totalKgItem / 1000).toFixed(2)) : 0,
        ivaTipo: porcIva === 10 ? 1 : porcIva === 5 ? 2 : 3,
        ivaBase: 100
      });
    }

    // ===== PASO 04: PREPARAR PEDIDO =====
    const fecha = moment(pedidoData?.fecha || new Date()).format("YYYY-MM-DD");
    const importeTotal = totalImporteSubtotal - totalImporteDescuento;
    // importeNeto = importeTotal - sum(IVA)
    const importeNeto = importeTotal - (totalImporteIva10 + totalImporteIva5 + totalImporteIvaExenta);
    const porcDescuento = totalImporteSubtotal > 0 ? (totalImporteDescuento / totalImporteSubtotal) * 100 : 0;

    // ===== PASO 05: CREAR CABECERA DEL PEDIDO =====
    const pedido = await Pedido.create(
      {
        empresaId,
        sucursalId,
        listaPrecioId,
        condicionPagoId,
        clienteId: cliente.id,
        clienteSucursalId: clienteSucursal.id,
        anulado: false,
        usuarioCreacionId: usuarioCreacionId || null,
        fecha,
        cobranzaId: null,
        porcDescuento: porcDescuento || 0,
        importeIva5: totalImporteIva5,
        importeIva10: totalImporteIva10,
        importeIvaExenta: totalImporteIvaExenta,
        importeDescuento: totalImporteDescuento,
        importeNeto,
        importeSubtotal: totalImporteSubtotal,
        importeTotal,
        observacion: pedidoData?.observacion || null,
        canal: "ecommerce",
        valorNeto: importeTotal,
        tipoDoc: "PD",
        importeDevuelto: 0,
        estado: "Pendiente",
        obsPedido: "pendiente",
        totalKg: totalKg ? Number((totalKg / 1000).toFixed(2)) : 0
      },
      { transaction: t }
    );

    // ===== PASO 06: CREAR DETALLES DEL PEDIDO =====
    if (detallesPedido.length > 0) {
      await PedidoDetalle.bulkCreate(
        detallesPedido.map(detalle => ({
          pedidoId: pedido.id,
          ...detalle
        })),
        { transaction: t }
      );
    }

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Pedido creado exitosamente desde ecommerce",
      data: {
        pedidoId: pedido.id,
        clienteId: cliente.id,
        clienteSucursalId: clienteSucursal.id,
        numPedido: pedidoData?.numPedido || null,
        total: importeTotal,
        fecha: pedido.fecha
      }
    });
  } catch (error) {
    if (t) {
      try {
        await t.rollback();
      } catch (rbErr) {
        console.error("Error al hacer rollback:", rbErr);
      }
    }
    console.error("Error en crearPedidoEcommerce:", error);
    const status = error.message && (error.message.startsWith("Valor desconocido") || error.message.startsWith("No se encontró")) ? 400 : 500;
    return res.status(status).json({
      success: false,
      message: "Error al crear el pedido desde ecommerce",
      error: error.message || "Error desconocido"
    });
  }
};

module.exports = {
  crearPedido
};
