 
const { loadCertificateAndKey } = require("../helpers/certificado-helper"); 
const Empresa = require("../models/empresa.model");
const Moneda = require("../models/moneda.model");
const Departamento = require("../models/departamento.model");
const Ciudad = require("../models/ciudad.model");
const Barrio = require("../models/barrio.model");
const TablaSifen = require("../models/tablaSifen.model");
const { Op } = require("sequelize");
const EmpresaActividad = require("../models/empresaActividad.model");
const Actividad = require("../models/actividad.model");
const Venta = require("../models/venta.model");
const VentaXml = require("../models/ventaXml.model");
const { envioEventoXml, extraeRespEvento } = require("../metodosSifen/envioEvento.service");
const { consulta } = require("../metodosSifen/service/consulta.service");
const { extraerDatosRespuesta } = require("../metodosSifen/xmlToJson");
const Sucursal = require("../models/sucursal.model");
const FormaVenta = require("../models/formaVenta.model");
const Cliente = require("../models/cliente.model");
const Variante = require("../models/variante.model");
const Presentacion = require("../models/presentacion.model");
const Variedad = require("../models/variedad.model");
const Producto = require("../models/producto.model");
const Unidad = require("../models/unidad.model");
const VentaDetalle = require("../models/ventaDetalle.model");
const EnvioVenta = require("../models/envioVenta");
const { generarXML } = require("../metodosSifen/generarXml");
const { cargandoLote, actualizarLote, relacionarVentasConLote } = require("../metodosSifen/service/createLote.service");
const { enviarXml } = require("../metodosSifen/envioLote.service");
const { actualizarEstadoVentas } = require("../jobs/envioLoteXml.job");
const { generateXMLDE } = require("../metodosSifen/service/jsonDeMain.service");
 
const fs = require("fs"); 
const { formatToParams, formatToData } = require("../metodosSifen/service/formatData.service");
const { signXML } = require("../metodosSifen/service/signxml.service");
const { generateQR } = require("../metodosSifen/service/generateQR.service");
const probarGeneradorXml = async (req, res) => {
  console.log('/*****************Probando*********************/')
  try {
    // Obtener empresaId del usuario autenticado
    const { empresaId } = req.usuario;
    const { id } = req.params;

    // Buscar la venta por ID
    let venta = await obtenerVenta(id);
    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    } 
    //fs.writeFileSync('./generador/venta.json', JSON.stringify(venta, null, 2));
    console.log('/*****************venta.json*********************/')
    // Obtener datos de la empresa
    const empresa = await getEmpresaById(empresaId);
    if (!empresa) {
      return res.status(404).json({ error: `No se encontró la empresa con ID ${empresaId}` });
    }
    //fs.writeFileSync('./generador/empresa.json', JSON.stringify(empresa, null, 2));
    console.log('/*****************empresa.json*********************/')
    const params = await formatToParams(venta,empresa);
   // fs.writeFileSync('./generador/params.json', JSON.stringify(params, null, 2));
    console.log('/*****************params.json*********************/')

    const data = await formatToData(venta,empresa); 
    //fs.writeFileSync('./generador/data.json', JSON.stringify(data, null, 2));
    console.log('/*****************data.json*********************/')

    let xmlBase = await generateXMLDE(params,data);  
    xmlBase = xmlBase.replace('<?xml version="1.0" encoding="UTF-8"?>', "")
    
    const xmlFirmado =await signXML(xmlBase,empresa.certificado) 
    const xmlFirmadoConQr =await generateQR(xmlFirmado,  empresa.idCSC,  empresa.csc); 
    fs.writeFileSync('./generador/xmlgenerado.xml', xmlFirmadoConQr); 

    return res.status(200).json({ data: xmlFirmadoConQr });

  } catch (error) {
    console.error('❌ Error probando genrador de xml:', error);
    return res.status(500).json({ error: "Error al reintentar" });
  }
};






// Definir las URLs completas para cada servicio
 
const obtenerVenta = async (id) => {
  try {
    // Obteniendo las ventas pendientes
    const venta = await Venta.findByPk(id,{ 
      include: [
        { model: Sucursal, as: 'sucursal' },
        { model: FormaVenta, as: 'formaVenta' },
        { model: Cliente, as: 'cliente' },
        { model: TablaSifen, as: 'tipoDocumento' }
      ],
      raw: true,
      nest: true
    });
 
        const detalles = await VentaDetalle.findAll({
          where: { ventaId: venta.id },
          include: [
            {
              model: Variante,
              as: "variante",
              include: [
                { model: Presentacion, as: "presentacion", attributes: ["id", "descripcion", "size"] },
                { model: Variedad, as: "variedad", attributes: ["id", "descripcion", "color"] },
                { model: Producto, as: "producto", attributes: ["nombre"] },
                { model: Unidad, as: "unidad", attributes: ["code"] }
              ] 
            }
          ],
          raw: true,
          nest: true
        });
       
        // Procesando cada detalle
        venta.detalles = detalles.map((detalle) => {
           
          const descripcion =`${detalle.variante.producto.nombre} ${detalle.variante.presentacion.descripcion} ${detalle.variante.variedad.descripcion} ${detalle.variante.unidad.code}`
 
          return {
            ...detalle,
            codigo: detalle.variante.codErp,
            descripcion,
            cantidad: +(detalle.cantidad),
            importePrecio: +(detalle.importePrecio), 
            porcIva: +(detalle.porcIva),
            porcDescuento: +(detalle.porcDescuento),
            importeDescuento: +(detalle.importeDescuento),
            importeNeto: +(detalle.importeNeto),
            importeSubtotal: +(detalle.importeSubtotal),
            importeTotal: +(detalle.importeTotal),
            anticipo: +(detalle.anticipo),
            totalKg: +(detalle.totalKg)
          };
        });

        return venta; // Retornar la venta con sus detalles 
  } catch (error) {
    console.error('Error al obtener venta :', error);
  }
}; 


const limpiarRegistros = async (ventaId) => {
  try {
    // Eliminar registros en EnvioVenta relacionados con la venta
    await EnvioVenta.destroy({
      where: { ventaId }
    });

    // Eliminar registros en VentaXml relacionados con la venta
    await VentaXml.destroy({
      where: { ventaId }
    });

    return 'OK'; // Confirmación de éxito
  } catch (error) {
    console.error('Error en limpiarRegistros:', error);
    return null;
  }
};
const obtenerXmlFirmados = async (empresaId, ventaId) => {
  try {
    const ventasXml = await VentaXml.findAll({
      where: {
        ventaId: ventaId,
        empresaId: empresaId,
        estado: 'FIRMADO'
      },
      order: [['id', 'DESC']] // Ordenar por id en orden descendente
    });

    // Si no hay registros, retornar null
    if (!ventasXml || ventasXml.length === 0) return null;

    return ventasXml[0].xml.toString('utf8'); // Retorna el XML más reciente en formato string
  } catch (error) {
    console.error('❌ Error al obtener XMLs firmados:', error);
    return null;
  }
};






const reintentar = async (req, res) => {
  try {
    // Obtener empresaId del usuario autenticado
    const { empresaId } = req.usuario;
    const { id } = req.params;

    // Buscar la venta por ID
    let venta = await obtenerVenta(id);
    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    if (venta.estado == 'Aprobado' ||venta.estado == 'Recibido' ) {
      return res.status(404).json({ error: "No se puede reintentar este tipo de documentos" });
    }
 
    // Obtener datos de la empresa
    const empresa = await getEmpresaById(empresaId);
    if (!empresa) {
      return res.status(404).json({ error: `No se encontró la empresa con ID ${empresaId}` });
    }
   //quitamos los registros anteriores
    const Ok = await limpiarRegistros(venta.id);
    const generado = await generarXML(empresa,venta);
    const xmlfirmado = await obtenerXmlFirmados(empresa.id, venta.id);
     const lote  = await cargandoLote(empresa.id);
     if (!lote) {
      return res.status(500).json({ error: "Error al obtener el lote" });
    }
    
    // Enviar xml
    const respuesta = await enviarXml(lote.id, xmlfirmado,empresa.certificado); 
 
    const loteActualizado = await actualizarLote(lote.id, respuesta.respuesta, respuesta.id);
    console.log(loteActualizado)
    // Crear relación entre el lote y las ventas
    await relacionarVentasConLote(lote.id, [venta.id]);
    // Actualizar estado de las ventas según el resultado del envío
    if (loteActualizado.estado === "RECIBIDO") {
      console.log(`📨 Envío exitoso.`);
      await actualizarEstadoVentas([venta.id], 'Recibido');
    } else {
      console.warn(`⚠️ Fallo en el envío del lote ${lote.numeroLote}.`);
      await actualizarEstadoVentas([venta.id], 'Rechazado');
    }
 
    return res.status(200).json({ data: respuesta.respuesta });

  } catch (error) {
    console.error('❌ Error al reintentar venta:', error );
    return res.status(500).json({ error: "Error al reintentar" });
  }
};




const consultarcdc = async (req, res) => { 
  try {
    const { empresaId } = req.usuario;
    const { id,cdc } = req.params;

    const empresa = await getEmpresaById(empresaId);
    if (!empresa) {
      return res.status(404).json({ error: `No se encontró la empresa con ID ${empresaId}` });
    }

            const data = { id, cdc ,tipoConsulta:"CDC"}
            const respuesta = await consulta(data, empresa.certificado );
            console.log(respuesta);
            const json = await extraerDatosRespuesta(respuesta.respuesta);
            
            return res.status(200).json({data:respuesta.respuesta});
        } catch (error) {
          console.error('❌ Error al consultar cdc:', error.message);
          return res.status(500).json({ error: "Error al consultar cdc" });
        }
 
}

 
const anular = async (req, res) => {
  try {
    // Obtener empresaId del usuario autenticado
    const { empresaId } = req.usuario;
    const { id } = req.params;

    // Buscar la venta por ID
    let venta = await Venta.findByPk(id);
    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    //inutilizacion 2, cancelacion 1
    let tipoAnulacion = (venta.dataValues?.estado === 'Pendiente') ? 2 : 1; 
    // Obtener datos de la empresa
    const empresa = await getEmpresaById(empresaId);
    if (!empresa) {
      return res.status(404).json({ error: `No se encontró la empresa con ID ${empresaId}` });
    }

    // Enviar evento de anulación
    const respuesta = await envioEventoXml(tipoAnulacion, venta, empresa);
    const json = await extraeRespEvento(respuesta);
    console.log("Respuesta del evento:", json);

    // Registrar el evento en la base de datos
    await VentaXml.create({
      orden: 3,
      empresaId: empresa.id,
      ventaId: venta.id,
      estado: 'CONCLUIDO',
      xml: respuesta,
    });

    // Si la respuesta es "Aprobado", actualizar la venta como anulada
    if (json.estado === 'Aprobado') {
      await Venta.update({ estado: json.estado, anulado: true }, { where: { id: venta.id } });
      return res.status(200).json({ ok: true });
    } else {
      return res.status(400).json({ error: json });
    }

  } catch (error) {
    console.error('❌ Error al anular venta:', error.message);
    return res.status(500).json({ error: "Error al anular" });
  }
};


const getEmpresaById = async (id) => {
  const tablas = ['iTiDE', 'iTipTra', 'iTImp', 'iTipCont'];
  try { 
    // Obtener empresas que generan XML
    let empresa = await Empresa.findByPk(id, { 
      include: [
        { model: Moneda, as: 'moneda' },
        { model: Departamento, as: 'departamento' },
        { model: Ciudad, as: 'ciudad' },
        { model: Barrio, as: 'barrio' }
      ],
      raw: true,
      nest: true
    });
  
    if (!empresa ) return null;
  
     // Obtener registros SIFEN
    const registros = await TablaSifen.findAll({
      where: { tabla: { [Op.in]: tablas } },
      raw: true,
      nest: true
    }); 
    console.log("Obteniendo registros SIFEN... =>", registros?.length);
 
    const actividadesPorEmpresa = await EmpresaActividad.findAll({
      where: { empresaId: empresa.id },
      include: [{ model: Actividad, as: "actividades" }],
      raw: true,
      nest: true
    }).then(data =>
      data.map(a => ({
        cActEco: a.actividades.codigo,
        dDesActEco: a.actividades.descripcion
      }))
    );
    
 
    // Cargar certificado
    const certificado = await loadCertificateAndKey(empresa.id);
/*     console.log('************certificado**************', certificado);
 */
    if (!certificado) {
      console.warn(`⚠️ No se encontró certificado para la empresa ID: ${empresa.id}`);
      return null;
    }
  
    empresa = {
      ...empresa,
      tipoContribuyente: registros.find(t => t.codigo == empresa.tipoContId && t.tabla === 'iTipCont'),
      tipoTransaccion: registros.find(t => t.codigo == empresa.tipoTransaId && t.tabla === 'iTipTra'),
      tipoImpuesto: registros.find(t => t.codigo == empresa.tipoImpId && t.tabla === 'iTImp'),
      actividades: actividadesPorEmpresa || [],
      certificado: certificado || null
    };

    return empresa;
  } catch (error) {
    console.error('❌ Error al obtener empresas:', error);
    return [];
  }
  };
// Exportar las funciones para ser utilizadas en otros archivos del proyecto
module.exports = { 
  anular,
  consultarcdc,
  reintentar,probarGeneradorXml
};
