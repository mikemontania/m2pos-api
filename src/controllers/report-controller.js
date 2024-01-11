const fs = require("fs");
const path = require("path"); // Agrega esta línea para requerir el módulo path
const invoice = require("../data/clients");
const { createInvoice } = require("../helpers/pdfGenerator");
const { client } = require("../data/clients");
const { venta } = require("../data/venta");
const Venta = require("../models/venta.model");
const VentaDetalle = require("../models/ventaDetalle.model");
const Cliente = require("../models/cliente.model");
const FormaVenta = require("../models/formaVenta.model");
const ListaPrecio = require("../models/listaPrecio.model");
const Sucursal = require("../models/sucursal.model");
const Empresa = require("../models/empresa.model");
const Usuario = require("../models/usuario.model");
const Variante = require("../models/variante.model");
const Presentacion = require("../models/presentacion.model");
const Variedad = require("../models/variedad.model");
const Producto = require("../models/producto.model");
const Unidad = require("../models/unidad.model");

const getPdf = async (req, res) => {
  const id = 1;

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
        attributes: ["descripcion", "direccion", "telefono"]
      },
      {
        model: Empresa,
        as: "empresa",
        attributes: [
          "razonSocial",
          "actividad1",
          "actividad2",
          "actividad3",
          "img"
        ]
      }
    ]
  });

  console.log(venta);
  const detallesVenta = await VentaDetalle.findAll({
    where: { ventaId: id },
    include: [
      {
        model: Variante,
        as: 'variante',  // Asegúrate de usar el alias correcto aquí
        include: [
          {
            model: Presentacion,
            as: 'presentacion',  // Asegúrate de usar el alias correcto aquí
            attributes: ['id', 'descripcion', 'size'],
          },
          {
            model: Variedad,
            as: 'variedad',  // Asegúrate de usar el alias correcto aquí
            attributes: ['id', 'descripcion', 'color'],
          },
          {
            model: Producto,
            as: 'producto',  // Asegúrate de usar el alias correcto aquí
            attributes: ['nombre'],
          },
          {
            model: Unidad,
            as: 'unidad',  // Asegúrate de usar el alias correcto aquí
            attributes: ['code'],
          },
        ],
      },
    ],
  });
  
  detallesVenta.forEach(detalle => {
    console.log('VentaDetalle:', detalle.dataValues);
  
    // Acceder a los datos de Variante
    const variante = detalle.variante;
    console.log('Variante:', variante.dataValues);
  
    // Acceder a los datos de Presentacion
    const presentacion = variante.presentacion;
    console.log('Presentacion:', presentacion.dataValues);
  
    // Acceder a los datos de Variedad
    const variedad = variante.variedad;
    console.log('Variedad:', variedad.dataValues);
  
    // Acceder a los datos de Producto
    const producto = variante.producto;
    console.log('Producto:', producto.dataValues);
  
    // Acceder a los datos de Unidad
    const unidad = variante.unidad;
    console.log('Unidad:', unidad.dataValues);
  
    console.log('-------------------');
  });

  const pdfContent = createInvoice(client);

  // Configurar la respuesta HTTP
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=invoice-${client.invoice_nr}.pdf`
  );

  // Enviar el contenido del PDF como respuesta
  pdfContent.pipe(res);
};

module.exports = {
  getPdf
};
