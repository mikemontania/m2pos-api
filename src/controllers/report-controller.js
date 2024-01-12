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

const getPdf = async (req, res) => {
  const { id } = req.params;

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
/* console.log(venta)
 */  const cabecera ={
    ...venta.dataValues,
   sucursal: {...venta.dataValues.sucursal.dataValues} ,
   empresa: {...venta.dataValues.empresa.dataValues} ,
   vendedorCreacion : {...venta.dataValues.vendedorCreacion.dataValues} ,
   cliente: {...venta.dataValues.cliente.dataValues} ,
   formaVenta: {...venta.dataValues.formaVenta.dataValues} ,

  }  
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
    })
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
};

module.exports = {
  getPdf
};
