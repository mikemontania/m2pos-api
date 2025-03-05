const { formatDateToLocalISO } = require("../generarXml");
const { paises } = require("./constants.service");

const formatToParams = (venta, empresa) => {

    
  try {
    return {
      ruc: empresa.ruc,
      razonSocial: empresa.razonSocial,
      nombreFantasia: empresa.nombreFantasia,
      actividadesEconomicas: empresa.actividades.map(act => ({
        codigo: act.cActEco,
        descripcion: act.dDesActEco
      })),
      timbradoNumero: venta.timbrado,
      timbradoFecha: venta.fechaInicio,
      tipoContribuyente: empresa.tipoContId,
      tipoRegimen: empresa.tipoImpId,
      establecimientos: [
        {
          codigo: venta.sucursalId.toString().padStart(3, "0"),
          direccion: venta.sucursal.direccion,
          numeroCasa: empresa.numCasa.toString(),
          complementoDireccion1: "",
          complementoDireccion2: "",
          departamento: empresa.departamento.codigo,
          departamentoDescripcion: empresa.departamento.descripcion,
          distrito: empresa.ciudad.codigo,
          distritoDescripcion: empresa.ciudad.descripcion,
          ciudad: empresa.barrio.codigo,
          ciudadDescripcion: empresa.barrio.descripcion,
          telefono: venta.sucursal.telefono,
          email: venta.sucursal.email, 
        }
      ]
    };
  } catch (error) {
    console.error("❌ Error formatToParams:", error.message);
  }
};

const formatToData = (venta, empresa) => {
  try {
    const [establecimiento, punto, numero] =
      venta.nroComprobante.split("-") || [];
    const pais = paises.find(p => p.codigo == venta.cliente.codigoPais);
    const items = venta.detalles.map(detalle => ({
      codigo: detalle.codigo,
      descripcion: detalle.descripcion,
      observacion: null,
      unidadMedida: 77,
      cantidad: detalle.cantidad,
      precioUnitario: detalle.importePrecio,
      cambio: 0,
      descuento: detalle.importeDescuento,
      anticipo: detalle.anticipo || 0,
      pais: pais.codigo,
      paisDescripcion: pais.descripcion,
      tolerancia: 1, //nota remision
      toleranciaCantidad: 1, //nota remision
      toleranciaPorcentaje: 1, //nota remision
      cdcAnticipo: "", //nota remision
      dncp: {
        codigoNivelGeneral: "1111111",
        codigoNivelEspecifico: "1111111",
        codigoGtinProducto: "1111111",
        codigoNivelPaquete: "1111111"
      },
      ivaTipo: detalle.ivaTipo,
      ivaBase: detalle.ivaBase,
      iva: detalle.porcIva,
      lote: null,
      vencimiento: null,
      numeroSerie: null,
      numeroPedido: null,
      numeroSeguimiento: null,
      importador: null,
      registroSenave: null,
      registroEntidadComercial: null,
      sectorAutomotor: null
    }));

    return {
      cdc: venta.cdc,
      codigoSeguridad: venta.codigoSeguridad,
      tipoDocumento: venta.itide,
      establecimiento: establecimiento,
      codigoSeguridadAleatorio: venta.codigoSeguridad,
      punto: punto,
      numero: numero,
      descripcion: "",
      observacion: "",
      fecha: formatDateToLocalISO(venta.fechaCreacion),
      tipoEmision: 1,
      tipoTransaccion: empresa.tipoTransaId,
      tipoImpuesto: empresa.tipoImpId,
      moneda: empresa.codMoneda,
      condicionAnticipo: 1,
      condicionTipoCambio: 1,
      descuentoGlobal: venta.importeDescuento,
      anticipoGlobal: 0,
      cambio: 6700,
      cliente: {
        contribuyente: true,
        ruc: "2005001-1",
        razonSocial: venta.cliente.razonSocial,
        nombreFantasia: venta.cliente.nombreFantasia,
        tipoOperacion: venta.cliente.tipoOperacionId,
        direccion: venta.cliente.direccion,
        numeroCasa: "0",
        departamento: null,
        departamentoDescripcion: null,
        distrito: null,
        distritoDescripcion: null,
        ciudad: null,
        ciudadDescripcion: null,
        pais: pais.codigo,
        paisDescripcion: pais.descripcion,
        tipoContribuyente: venta.cliente.tipoContribuyente,
        documentoTipo: venta.cliente.tipoDocIdentidad,
        documentoNumero: venta.cliente.nroDocumento,
        telefono: venta.cliente.telefono,
        celular: venta.cliente.celular,
        email: venta.cliente.email,
        //codigo: venta.cliente.id
      },

      factura: {
        presencia: 1,
        fechaEnvio: venta.fechaVenta,
        dncp: {
          modalidad: "00",
          entidad: 111111,
          año: 11,
          secuencia: 1111111,
          fecha: venta.fechaVenta
        }
      },

      condicion: {
        tipo: +venta.formaVenta.id == 1 ? 1 : 2, //1 es contado 2 es credito
        entregas: [
          {
            tipo: 1,
            monto: venta.importeTotal,
            moneda: "PYG",
            cambio: 0
          }
        ]
      },
      items: items,
      sectorEnergiaElectrica: null,
      sectorSeguros: null,
      sectorSupermercados: null,
      sectorAdicional: null,
      detalleTransporte: null,
      complementarios: null,
      documentoAsociado: null
    };
  } catch (error) {
    console.error("❌ Error formatToData:", error.message);
  }
};

module.exports = {
  formatToParams,
  formatToData
};
