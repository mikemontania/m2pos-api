const { Op } = require("sequelize"); 
const Cobranza = require("../models/cobranza.model"); 
const CobranzaDetalle = require("../models/cobranzaDetalle.model");
const { sequelize } = require("../../dbconfig");
const moment = require("moment"); 
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
const Empresa = require("../models/empresa.model");  

const {   tipoContribuyente,tiposEmisiones
} = require('../constantes/Constante.constant');   
const ClienteSucursal = require("../models/ClienteSucursal.model");
const Pedido = require("../models/pedido.model");
const PedidoDetalle = require("../models/pedidoDetalle.model");
const Departamento = require("../models/departamento.model");
const Ciudad = require("../models/ciudad.model");
const Barrio = require("../models/barrio.model");



const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await Pedido.findByPk(id, {
      include: [
        { model: Usuario, as: "vendedorCreacion", attributes: ["usuario"] },
        { model: Usuario, as: "vendedorAnulacion", attributes: ["usuario"] },
        { model: ListaPrecio, as: "listaPrecio", attributes: ["descripcion"] },
        {
          model: Cliente,
          as: "cliente" 
        },
        {
          model: ClienteSucursal,
          as: "clienteSucursal" ,
          include: [
            {
              model: CondicionPago,
              as: "condicionPago", 
            },
              {
          model: ListaPrecio,
          as: "listaPrecio",
          attributes: ["id", "descripcion"]
        },
            {
              model: Departamento,
              as: "departamento",
              attributes: ["codigo", "descripcion"]
            },
            {
              model: Ciudad,
              as: "ciudad",
              attributes: ["codigo", "descripcion"]
            },
            {
              model: Barrio,
              as: "barrio",
              attributes: ["codigo", "descripcion"]
            }
          ]
        }, 
        { model: CondicionPago, as: "condicionPago", attributes: ["descripcion"] },
        {
          model: Sucursal,
          as: "sucursal",
          attributes: ["descripcion", "direccion", "telefono", "cel"]
        }
      ]
    });
    if (!pedido) {
      return res.status(404).json({ error: "Pedido not found" });
    }
    const detallesPedido = await PedidoDetalle.findAll({
      where: { pedidoId: id },
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
   const decimalFields = [
  'porcDescuento', 'importeIva5', 'importeIva10', 'importeIvaExenta',
  'importeDescuento', 'importeNeto', 'importeSubtotal', 'importeTotal',
  'valorNeto', 'totalKg', 'cantidad', 'importePrecio', 'importeNeto',
  'importeSubtotal', 'importeTotal', 'anticipo', 'porcIva'
];
    res.status(200).json({
     documento: normalizeDecimalFields(pedido.toJSON(), decimalFields),
  detalles: normalizeDecimalFields(detallesPedido.map(d => d.toJSON()), decimalFields)
    });
  } catch (error) {
    console.error("Error in getPdf:", error);
    res.status(500).json({ error: error?.original?.detail ||   "Internal Server Error!!!" });
  }
};
function normalizeDecimalFields(obj, decimalFields = []) {
  if (Array.isArray(obj)) {
    return obj.map(item => normalizeDecimalFields(item, decimalFields));
  }

  const newObj = { ...obj };

  for (const field of decimalFields) {
    if (typeof newObj[field] === 'string' && !isNaN(newObj[field])) {
      newObj[field] = parseFloat(newObj[field]);
    }
  }

  for (const key in newObj) {
    if (typeof newObj[key] === 'object' && newObj[key] !== null) {
      newObj[key] = normalizeDecimalFields(newObj[key], decimalFields);
    }
  }

  return newObj;
}
// Crear una documento con sus detalles
const create = async (req, res) => {
   const { id, empresaId } = req.usuario;
  const t = await sequelize.transaction(); // Inicia la transacción
  try {
    const {
     
      sucursalId, 
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
      clienteSucursalId,
      detalles,
         canal,
      cobranza,
      observacion,
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
   // const cliente  = await Cliente.findByPk(clienteId, {      transaction: t    });
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
          tipo:'PD'
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
    const fecha = moment(new Date()).format("YYYY-MM-DD"); 
    // Guardar documento
    const pedido = await Pedido.create(
      {
        
        empresaId,
        sucursalId,
        listaPrecioId,
        condicionPagoId,
        clienteId,
        clienteSucursalId,
        anulado: false, 
        usuarioCreacionId: id,
        fecha,   
        cobranzaId: cobranzaId, 
        porcDescuento,
        importeIva5,
        importeIva10,
        importeIvaExenta,
        importeDescuento,
        importeNeto,
        importeSubtotal,
        importeTotal,
        observacion,
         canal,
        valorNeto: importeTotal,
        tipoDoc:'PD'  ,  
        importeDevuelto:0,
        estado:'Pendiente', 
         obsPedido:'pendiente', 
        totalKg: totalKg ? Number((totalKg / 1000).toFixed(2)) : 0
      },
      { transaction: t }
    ); 
    // Guardar detalles
    await PedidoDetalle.bulkCreate(
      detalles.map(detalle => ({
        pedidoId: pedido.id,
        ...detalle,
        totalKg: detalle.totalKg
          ? Number((detalle.totalKg / 1000).toFixed(2))
          : 0
      })),
      { transaction: t }
    );
    // Commit de la transacción si todo fue exitoso
    await t.commit(); 
    res.status(201).json(pedido);
  } catch (error) {
    // Si hay algún error, realiza un rollback de la transacción
    console.error(error);
    await t.rollback();
    error.msg =   error?.original?.detail || error.message || "Error al crear la documento";
    res.status(500).json( error);
  }
};
 
  
// Anular una documento por ID
const anular  = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body; // ✅ Recibimos el motivo desde el body
    const pedido = await Pedido.findByPk(id);
    if (pedido) {
      await pedido.update({
        anulado: true,  
        valorNeto: 0,
        obsPedido:'anulado',
        motivoAnulacion: motivo || '', // ✅ Guardamos el motivo (vacío si no viene) 
        fechaAnulacion: new Date(),
        usuarioAnulacionId: req.usuario.id
      });
 
    

      if (pedido.cobranzaId) {
        const cobranza = await Cobranza.findByPk(pedido.cobranzaId);
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

const updateCampos = async (req, res) => {
  try {
    const { id, campo, valor } = req.params;


    const camposPermitidos = ['fecha', 'obsPedido', 'observacion', 'canal'];

if (!camposPermitidos.includes(campo)) {
  return res.status(400).json({ error: `No está permitido modificar el campo '${campo}'` });
}

    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }


    // Actualizar el campo dinámicamente
    await pedido.update({ [campo]: valor });

    res.status(200).json({ message: `Campo '${campo}' actualizado correctamente.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error?.original?.detail || "Error al modificar el documento",
    });
  }
};



// Listar documentos paginadas y filtradas
const listar  = async (req, res) => {
 
  try {
    const {
      page = 1,
      pageSize = 10,
      fechaDesde,
      fechaHasta,
      clienteSucursalId,
      sucursalId,
      clienteId,
      listaPrecioId,
      condicionPagoId ,
      canal
    } = req.params;
    const { empresaId } = req.usuario;
   
    const condiciones = {      empresaId    };
    const desde = moment(fechaDesde).format("YYYY-MM-DD");
    const hasta = moment(fechaHasta).format("YYYY-MM-DD");
 
    if (desde && hasta) {
      condiciones.fecha = {
        [Op.gte]: desde, // Mayor o igual que la fecha desde
        [Op.lte]: hasta  // Menor o igual que la fecha hasta
      };
    }


   if (Number(clienteSucursalId) > 0) {
  condiciones.clienteSucursalId = Number(clienteSucursalId);
}

   if (Number(clienteId) > 0) {
  condiciones.clienteId = Number(clienteId);
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
    if (canal != 'todos') {
      condiciones.canal = canal;
    }
    

    const offset = (page - 1) * pageSize;
    const { rows: pedidos, count } = await Pedido.findAndCountAll({
      where: condiciones,
      include: [
        { model: Usuario, as: "vendedorCreacion", attributes: ["usuario"] },
        {
          model: Cliente,
          as: "cliente",
          attributes: ["nroDocumento", "razonSocial"]
        },
        {
          model: ClienteSucursal,
          as: "clienteSucursal",    include: [
          {
            model: CondicionPago,
            as: 'condicionPago', 
          },
          {
            model: ListaPrecio,
            as: 'listaPrecio', 
          },
          {
            model: Departamento,
            as: 'departamento', 
          },
          {
            model: Ciudad,
            as: 'ciudad', 
          },
          {
            model: Barrio,
            as: 'barrio', 
          }
        ]
        },
        {
          model: CondicionPago,
          as: "condicionPago",
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
      order: [["id", "DESC"]], // Ordena por ID en orden descendente
      offset,
      limit: pageSize
    });

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page: Number(page),
      pageSize: Number(pageSize),
      pedidos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al listar las documentos" });
  }
};

 const listarSinPaginacion = async (req, res) => {
  try {
    const {
      fechaDesde,
      fechaHasta,
      clienteSucursalId,
      clienteId,
      sucursalId,
      listaPrecioId,
      condicionPagoId,
      canal
    } = req.params;
    const { empresaId } = req.usuario;

    const condiciones = { empresaId };

    const desde = moment(fechaDesde).format("YYYY-MM-DD");
    const hasta = moment(fechaHasta).format("YYYY-MM-DD");

    if (desde && hasta) {
      condiciones.fecha = {
        [Op.gte]: desde,
        [Op.lte]: hasta,
      };
    }

    
   if (Number(clienteSucursalId) > 0) {
  condiciones.clienteSucursalId = Number(clienteSucursalId);
}

   if (Number(clienteId) > 0) {
  condiciones.clienteId = Number(clienteId);
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
    if (canal !== 'todos') {
      condiciones.canal = canal;
    }

    const pedidos = await Pedido.findAll({
      where: condiciones,
      include: [
        {
          model: Usuario,
          as: "vendedorCreacion",
          attributes: ["usuario"]
        },
        {
          model: Cliente,
          as: "cliente",
          attributes: ["nroDocumento", "razonSocial"]
        },
        {
          model: ClienteSucursal,
          as: "clienteSucursal",
          include: [
            {
              model: CondicionPago,
              as: "condicionPago",
              attributes: ["id", "descripcion"]
            },
            {
              model: Departamento,
              as: "departamento",
              attributes: ["codigo", "descripcion"]
            },
            {
              model: Ciudad,
              as: "ciudad",
              attributes: ["codigo", "descripcion"]
            },
            {
              model: Barrio,
              as: "barrio",
              attributes: ["codigo", "descripcion"]
            }
          ]
        },
        {
          model: CondicionPago,
          as: "condicionPago",
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
      order: [["id", "ASC"]]
    });

    // 🔁 Recorrer los pedidos para agregar los detalles
    for (const pedido of pedidos) {
      const detalles = await PedidoDetalle.findAll({
        where: { pedidoId: pedido.id },
        include: [
          {
            model: Variante,
            as: "variante",
            include: [
              {
                model: Presentacion,
                as: "presentacion",
                attributes: ["id", "descripcion", "size"]
              },
              {
                model: Variedad,
                as: "variedad",
                attributes: ["id", "descripcion", "color"]
              },
              {
                model: Producto,
                as: "producto"
              },
              {
                model: Unidad,
                as: "unidad",
                attributes: ["code"]
              }
            ]
          }
        ]
      });

      // 🧩 Agregar los detalles al pedido
      pedido.setDataValue("detalles", detalles);
    }

    res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error?.original?.detail || "Error al listar los documentos"
    });
  }
};

 
module.exports = {
  listarSinPaginacion,
  getById, 
  create ,
  anular ,
  listar  ,
  updateCampos
 };



