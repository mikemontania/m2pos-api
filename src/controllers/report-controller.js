const fs = require("fs");
const path = require("path"); // Agrega esta línea para requerir el módulo path
const { createInvoice } = require("../helpers/pdfGenerator");
const Venta = require("../models/venta.model");
const VentaDetalle = require("../models/ventaDetalle.model");
const Cliente = require("../models/cliente.model");
const FormaVenta = require("../models/formaVenta.model");
const Sucursal = require("../models/sucursal.model");
const Empresa = require("../models/empresa.model");
const Usuario = require("../models/usuario.model");
const Variante = require("../models/variante.model");
const Presentacion = require("../models/presentacion.model");
const Variedad = require("../models/variedad.model");
const Producto = require("../models/producto.model");
const Unidad = require("../models/unidad.model");
const Cobranza = require("../models/cobranza.model");
const CobranzaDetalle = require("../models/cobranzaDetalle.model");
const MedioPago = require("../models/medioPago.model");

const getTopVendedoresPorTotalKg = async (req, res) => {
  try {
    // Consulta para obtener el top de vendedores por totalKg
    const topVendedores = await Venta.findAll({
      attributes: [
        'usuarioCreacionId', // Selecciona el ID del vendedor
        [sequelize.fn('SUM', sequelize.col('totalKg')), 'totalKgSum'], // Suma totalKg y le asigna un alias
      ],
      group: ['usuarioCreacionId'], // Agrupa por el ID del vendedor
      order: [[sequelize.literal('totalKgSum'), 'DESC']], // Ordena por la suma totalKg de forma descendente
      include: [
        {
          model: Usuario, // Asocia el modelo Usuario
          as: 'vendedorCreacion', // Alias para la asociación de usuario de creación
        },
      ],
      limit: 10, // Limita los resultados a los 10 primeros vendedores
    });

    // Responde con el resultado
    res.status(200).json({
      message: 'Top de vendedores por totalKg',
      data: topVendedores,
    });
  } catch (error) {
    // Maneja los errores
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el top de vendedores por totalKg' });
  }
};
const getTopVariantesPorTotalKg = async (req, res) => {
  try {
    const topVariantes = await VentaDetalle.findAll({
      attributes: [
        'varianteId',
        [sequelize.fn('SUM', sequelize.col('totalKg')), 'totalKgSum'],
      ],
      group: ['varianteId'],
      order: [[sequelize.literal('totalKgSum'), 'DESC']],
      include: [
        {
          model: Variante,
          as: 'variante',
        },
      ],
      limit: 10, // Puedes ajustar el límite según tus necesidades
    });

    res.status(200).json({
      message: 'Top de variantes por totalKg',
      data: topVariantes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el top de variantes por totalKg' });
  }
};
const getInformeMediosDePago = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta } = req.params;

    const query = `
      SELECT
        mp.id AS medioPagoId,
        mp.descripcion AS medioPagoDescripcion,
        SUM(cd.importeCobrado) AS totalImporteCobrado
      FROM
        medio_pago mp
      LEFT JOIN
        cobranzas_detalle cd ON mp.id = cd.medioPagoId
      LEFT JOIN
        cobranzas c ON cd.cobranzaId = c.id
      WHERE
        c.fechaCobranza BETWEEN :fechaDesde AND :fechaHasta
      GROUP BY
        mp.id, mp.descripcion
    `;

    const resultados = await sequelize.query(query, {
      replacements: { fechaDesde, fechaHasta },
      type: sequelize.QueryTypes.SELECT,
    });

    // Estructurar y enviar la respuesta
    res.status(200).json({
      message: `Informe de medios de pago para el periodo ${fechaDesde} - ${fechaHasta}`,
      data: resultados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el informe de medios de pago" });
  }
};
const getReporteCobranza = async (req, res) => {
  console.log("getReporteCobranza");
  try {
    const { fechaDesde, fechaHasta, medioPagoId, sucursalId } = req.params;
    const { empresaId } = req.usuario;

    console.log(fechaDesde, fechaHasta, medioPagoId, sucursalId);
    const condiciones = {
      empresaId
    };
    const desde = moment(fechaDesde).format("YYYY-MM-DD");
    const hasta = moment(fechaHasta).format("YYYY-MM-DD");
    console.log(fechaDesde);
    console.log(desde);
    if (desde && hasta) {
      condiciones.fechaVenta = {
        [Op.lte]: desde,
        [Op.gte]: hasta
      };
    }
    condiciones.anulado = false;
    condiciones.cobranzaId != null;

    if (sucursalId > 0) {
      condiciones.sucursalId = sucursalId;
    }

    let condiciones2 = {};
    if (medioPagoId > 0) {
      condiciones2.medioPagoId = medioPagoId;
    }

    const ventas = await Venta.findAll({
      where: condiciones,
      attributes: ["id", "fechaVenta", "nroComprobante", "importeTotal"],
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["nroDocumento", "razonSocial"]
        },
        { model: Sucursal, as: "sucursal", attributes: ["descripcion"] }
      ]
    });
    //buscar cobranza y mediopago
    let detalles = [];

    for (const venta of ventas) {
      condiciones2.cobranzaId = venta.cobranzaId;

      const cobranzaDetalles = await Promise.all(
        CobranzaDetalle.findAll({
          where: condiciones2,
          attributes: ["importeCobrado", "nroRef"],
          include: [
            { model: MedioPago, as: "medioPago", attributes: ["descripcion"] }
          ]
        })
      );

      for (const primerCobranzaDetalle of cobranzaDetalles) {
        detalles.push({
          ...venta,
          importeCobrado: primerCobranzaDetalle.importeCobrado,
          nroRef: primerCobranzaDetalle.nroRef,
          medioPago: primerCobranzaDetalle.medioPago.descripcion
        });
      }
    }

    // Objeto para almacenar la información agrupada por medio de pago
    const agrupadoPorMedioPago = detalles.reduce((acumulador, detalle) => {
      const { medioPago, importeCobrado } = detalle;
      if (!acumulador[medioPago]) {
        acumulador[medioPago] = {
          cantidadCobranza: 0,
          importeTotal: 0
        };
      }

      acumulador[medioPago].cantidadCobranza++;
      acumulador[medioPago].importeTotal += importeCobrado;

      return acumulador;
    }, {});

    // Convertir el objeto agrupado a un array
    const resultadoAgrupado = Object.keys(
      agrupadoPorMedioPago
    ).map(medioPago => ({
      medioPago,
      cantidadCobranza: agrupadoPorMedioPago[medioPago].cantidadCobranza,
      importeTotal: agrupadoPorMedioPago[medioPago].importeTotal
    }));

    res.status(200).json({
      detalles: detalles,
      agrupado: resultadoAgrupado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar las ventas" });
  }
}; 
const getTopClientes = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta, topN } = req.params;

    // Realizar la consulta a la base de datos para obtener los clientes más compradores
    const query = `
      SELECT
        c.nroDocumento,
        c.razonSocial,
        SUM(v.importeTotal) AS totalImporte,
        COUNT(v.id) AS totalFacturas
      FROM
        ventas v
      JOIN
        clientes c ON v.clienteId = c.id
      WHERE
        v.anulado = false
        AND c.predeterminado = false
        AND c.propietario = false
        AND v.fechaVenta BETWEEN :fechaDesde AND :fechaHasta
      GROUP BY
        c.id, c.nroDocumento, c.razonSocial
      ORDER BY
        totalImporte DESC
      LIMIT :topN;
    `;

    const resultados = await sequelize.query(query, {
      replacements: { fechaDesde, fechaHasta, topN },
      type: sequelize.QueryTypes.SELECT,
    });

    // Estructurar y enviar la respuesta
    res.status(200).json({
      message: `Top ${topN} clientes más compradores para el periodo ${fechaDesde} - ${fechaHasta}`,
      data: resultados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el top de clientes" });
  }
};
const getTopVariantes = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta, topN } = req.params;

    // Realizar la consulta a la base de datos para obtener las variantes más vendidas
    const query = `
      SELECT
        v.varianteId,
        COUNT(vd.id) AS totalVentas,
        SUM(vd.importeTotal) AS totalImporte
      FROM
        ventas_detalle vd
      JOIN
        ventas v ON vd.ventaId = v.id
      WHERE
        v.anulado = false
        AND v.fechaVenta BETWEEN :fechaDesde AND :fechaHasta
      GROUP BY
        v.varianteId
      ORDER BY
        totalImporte DESC
      LIMIT :topN;
    `;

    const resultados = await sequelize.query(query, {
      replacements: { fechaDesde, fechaHasta, topN },
      type: sequelize.QueryTypes.SELECT,
    });

    // Estructurar y enviar la respuesta
    res.status(200).json({
      message: `Top ${topN} variantes más vendidas para el periodo ${fechaDesde} - ${fechaHasta}`,
      data: resultados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el top de variantes" });
  }
};
const getReporteVentasPorSucursal = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta, sucursalId } = req.params;

    // Realizar la consulta a la base de datos para obtener la cantidad de ventas y totales por sucursal
    const query = `
      SELECT
        s.id AS sucursalId,
        s.nombre AS sucursalNombre,
        COUNT(v.id) AS totalVentas,
        SUM(v.importeTotal) AS totalImporte
      FROM
        ventas v
      JOIN
        sucursales s ON v.sucursalId = s.id
      WHERE
        v.anulado = false
        AND v.fechaVenta BETWEEN :fechaDesde AND :fechaHasta
        AND s.id = :sucursalId
      GROUP BY
        s.id, s.nombre
      ORDER BY
        totalImporte DESC;
    `;

    const resultados = await sequelize.query(query, {
      replacements: { fechaDesde, fechaHasta, sucursalId },
      type: sequelize.QueryTypes.SELECT,
    });

    // Estructurar y enviar la respuesta
    res.status(200).json({
      message: `Reporte de ventas por sucursal para el periodo ${fechaDesde} - ${fechaHasta}`,
      data: resultados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el reporte de ventas por sucursal" });
  }
}; 
const getPdf = async (req, res) => {
  const { id } = req.params;
  try {
    const venta = await Venta.findByPk(id, {
      include: [
        { model: Usuario, as: "vendedorCreacion", attributes: ["usuario"] },
        {
          model: Cliente,
          as: "cliente",
          attributes: ["nroDocumento", "razonSocial", "direccion", "telefono"]
        },
        {
          model: FormaVenta,
          as: "formaVenta",
          attributes: ["id", "descripcion"]
        },
        {
          model: Sucursal,
          as: "sucursal",
          attributes: ["descripcion", "direccion", "telefono", "cel"]
        },
        {
          model: Empresa,
          as: "empresa",
          attributes: [
            "razonSocial",
            "ruc",
            "actividad1",
            "actividad2",
            "actividad3",
            "img",
            "web"
          ]
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
    /* console.log(venta)
 */

    const cabecera = {
      ...venta.dataValues,
      sucursal: { ...venta.dataValues.sucursal.dataValues },
      empresa: { ...venta.dataValues.empresa.dataValues },
      vendedorCreacion: { ...venta.dataValues.vendedorCreacion.dataValues },
      cliente: { ...venta.dataValues.cliente.dataValues },
      formaVenta: { ...venta.dataValues.formaVenta.dataValues }
    };
    let detalles = [];

    detallesVenta.forEach(detalle => {
      // Acceder a los datos de Variante
      const variante = detalle.variante;
      detalles.push({
        cantidad: detalle.dataValues.cantidad,
        importePrecio: detalle.dataValues.importePrecio,
        importeIva5: detalle.dataValues.importeIva5,
        importeIva10: detalle.dataValues.importeIva10,
        importeIvaExenta: detalle.dataValues.importeIvaExenta,
        importeDescuento: detalle.dataValues.importeDescuento,
        importeNeto: detalle.dataValues.importeNeto,
        importeSubtotal: detalle.dataValues.importeSubtotal,
        importeTotal: detalle.dataValues.importeTotal,
        totalKg: detalle.dataValues.totalKg,
        tipoDescuento: detalle.dataValues.tipoDescuento,
        variante: variante.dataValues,
        presentacion: variante.presentacion,
        variedad: variante.variedad,
        producto: variante.producto,
        unidad: variante.unidad
      });
      /*  console.log("-------------------");
    console.log(cabecera);
    console.log("-------------------");
    console.log(detalles);
    console.log("-------------------"); */
    });

    const pdfContent = createInvoice(cabecera, detalles);

    // Configurar la respuesta HTTP
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=FE-${cabecera.nroComprobante}.pdf`
    );

    // Enviar el contenido del PDF como respuesta
    pdfContent.pipe(res);
  } catch (error) {
    console.error("Error in getPdf:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getPdf
};
