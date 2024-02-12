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
const { Op } = require("sequelize");

const moment = require("moment");
const { sequelize } = require("../../dbconfig");

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
      attributes: [
        "id",
        "fechaVenta",
        "nroComprobante",
        "importeTotal",
        "cobranzaId"
      ],
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["nroDocumento", "razonSocial"]
        },
        { model: Sucursal, as: "sucursal", attributes: ["descripcion"] }
      ]
    });

    let detalles = [];

    for (const venta of ventas) {
      condiciones2.cobranzaId = venta.cobranzaId;

      const cobranzaDetallesArray = await CobranzaDetalle.findAll({
        where: condiciones2,
        attributes: ["importeCobrado", "nroRef"],
        include: [
          { model: MedioPago, as: "medioPago", attributes: ["descripcion"] }
        ]
      });

      const cobranzaDetalles = cobranzaDetallesArray.map(detalle =>
        detalle.toJSON()
      );

      for (const primerCobranzaDetalle of cobranzaDetalles) {
        detalles.push({
          ...venta.toJSON(), // Aplicar toJSON() a la venta
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
      acumulador[medioPago].importeTotal += parseFloat(importeCobrado); // Convertir a número y sumar

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
 
const getVendedoresPorTotal = async (req, res) => {
  try {
    const { empresaId } = req.usuario;

    const { fechaDesde, fechaHasta, sucursalId } = req.params;
    const sucursalCondition = sucursalId !== '0' ? "AND v.sucursal_id = :sucursalId" : "";
 
    // Realizar la consulta a la base de datos para obtener las variantes más vendidas
    const query = `
      SELECT
        u.id,
        u.usuario as vendedor, 
        COUNT(v.id) as cantidad,
        SUM(v.total_kg) / 1000 AS peso,
        SUM(v.importe_total) total
      FROM ventas v  
      JOIN usuarios u ON u.id = v.usuario_creacion_id
      WHERE
        v.anulado = false   AND v.empresa_id = :empresaId
        AND v.fecha_Venta BETWEEN :fechaDesde AND :fechaHasta
        ${sucursalCondition}
      GROUP BY u.id, vendedor ORDER BY total  DESC 
    `;

    const resultados = await sequelize.query(query, {
      replacements: { fechaDesde, fechaHasta, sucursalId,empresaId },
      type: sequelize.QueryTypes.SELECT
    });

   
 
    // Estructurar y enviar la respuesta
    res.status(200).json({
      resultados: resultados
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener getVendedoresPorTotal" });
  }
};
 

const getInformeMediosDePago = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { fechaDesde, fechaHasta , sucursalId} = req.params;
    const sucursalCondition = sucursalId !== '0' ? "AND c.sucursal_id = :sucursalId" : "";
  
    const query = `
      SELECT
        mp.id AS id,
        mp.descripcion AS medioPago ,
        SUM(cd.importe_cobrado) AS totalImporteCobrado,
        COUNT( mp.id) AS cantidad
      FROM
        medio_pago mp
      LEFT JOIN
        cobranzas_detalle cd ON mp.id = cd.medio_pago_id
      LEFT JOIN
        cobranzas c ON cd.cobranza_id = c.id
      WHERE
        c.fecha_cobranza BETWEEN :fechaDesde AND :fechaHasta
        AND c.tipo = 'VENTA'
        AND c.anulado = false
        AND c.empresa_id = :empresaId
        ${sucursalCondition}
      GROUP BY mp.id, mp.descripcion    `;

    const resultados = await sequelize.query(query, {
      replacements: { fechaDesde, fechaHasta, sucursalId, empresaId },
      type: sequelize.QueryTypes.SELECT
    });

    // Estructurar y enviar la respuesta
    res.status(200).json({
      resultados
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener el informe de medios de pago" });
  }
};

const getTopClientes = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { fechaDesde, fechaHasta, sucursalId } = req.params;
    const sucursalCondition = sucursalId !== '0' ? "AND v.sucursal_id = :sucursalId" : "";
    // Realizar la consulta a la base de datos para obtener los clientes más compradores
    const query = `
      SELECT
        c.nro_documento as doc,
        c.razon_social as razonSocial,
        SUM(v.importe_total) AS totalImporte,
        COUNT(v.id) AS totalFacturas
      FROM
        ventas v
      JOIN
        clientes c ON v.cliente_id = c.id
      WHERE
        v.anulado = false AND v.empresa_id = :empresaId
        AND c.predeterminado = false
        AND c.propietario = false
        AND v.fecha_venta BETWEEN :fechaDesde AND :fechaHasta
        ${sucursalCondition}

      GROUP BY
      doc, razonSocial 
      ORDER BY
      totalImporte DESC
      LIMIT 10;
    `;

    const resultados = await sequelize.query(query, {
      replacements: { fechaDesde, fechaHasta, empresaId,  sucursalId  },
      type: sequelize.QueryTypes.SELECT
    });

    // Estructurar y enviar la respuesta
    res.status(200).json({
      resultados
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el top de clientes" });
  }
};
const getTopVariantes = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { fechaDesde, fechaHasta, sucursalId } = req.params;
    const sucursalCondition = sucursalId !== '0' ? "AND v.sucursal_id = :sucursalId" : "";
    // Realizar la consulta a la base de datos para obtener las variantes más vendidas
    const query = `
      SELECT
        va.id,
        va.cod_erp as codErp,
        pro.nombre as producto,
        var.descripcion as variedad,
        pre.descripcion as presentacion,
        SUM(vd.cantidad) AS vendidos,
        SUM(vd.total_kg) / 1000 AS peso,
        SUM(vd.importe_total) AS totalImporte
      FROM
        ventas_detalle vd
      JOIN
        ventas v ON vd.venta_id = v.id
      JOIN variantes va ON va.id = vd.variante_id
      JOIN productos pro ON va.producto_id = pro.id
      JOIN presentaciones pre ON va.presentacion_id = pre.id
      JOIN variedades var ON va.variedad_id = var.id
      WHERE v.anulado = false AND v.empresa_id = :empresaId
        AND v.fecha_Venta BETWEEN :fechaDesde AND :fechaHasta
        ${sucursalCondition}
      GROUP BY
      va.id,
      codErp,
      producto,
      variedad,
      presentacion
      ORDER BY
        vendidos DESC
      LIMIT 10;
    `;

    const resultados = await sequelize.query(query, {
      replacements: { fechaDesde, fechaHasta, sucursalId,empresaId  },
      type: sequelize.QueryTypes.SELECT
    });

    // Estructurar y enviar la respuesta
    res.status(200).json({
       resultados
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el top de variantes" });
  }
};
const getReporteVentasPorSucursal = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta, sucursalId } = req.params;
    const { empresaId } = req.usuario;
console.log(sucursalId)
    // Ajustar la condición para la sucursal
    const sucursalCondition = sucursalId !== '0' ? "AND s.id = :sucursalId" : "";

    // Realizar la consulta a la base de datos para obtener la cantidad de ventas y totales por sucursal
    const query = `
      SELECT
        s.id AS sucursalId,
        s.descripcion AS sucursalNombre,
        COUNT(v.id) AS totalVentas,
        SUM(v.importe_total) AS totalImporte
      FROM
        ventas v
      JOIN
        sucursales s ON v.sucursal_id = s.id
      WHERE
        v.anulado = false
        AND v.empresa_id = :empresaId
        AND v.fecha_venta BETWEEN :fechaDesde AND :fechaHasta
        ${sucursalCondition}
      GROUP BY
        s.id, s.descripcion
      ORDER BY
        totalImporte DESC;
    `;

    const resultados = await sequelize.query(query, {
      replacements: { fechaDesde, fechaHasta, empresaId, sucursalId  },
      type: sequelize.QueryTypes.SELECT
    });

    // Estructurar y enviar la respuesta
    res.status(200).json({
     
      resultados
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener el reporte de ventas por sucursal" });
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
  getPdf,
  getReporteCobranza,
  getReporteVentasPorSucursal ,
  getTopVariantes,
  getTopClientes,
  getInformeMediosDePago,  getVendedoresPorTotal
};
