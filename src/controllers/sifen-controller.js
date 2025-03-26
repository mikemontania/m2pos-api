 
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
const Documento = require("../models/documento.model");
const DocumentoXml = require("../models/documentoXml.model");
const { envioEventoXml, extraeRespEvento } = require("../metodosSifen/envioEvento.service");
const { consulta } = require("../metodosSifen/service/consulta.service");
const {   extraerDatosConsultaCdc } = require("../metodosSifen/xmlToJson");
const Sucursal = require("../models/sucursal.model");
const CondicionPago = require("../models/condicionPago.model");
const Cliente = require("../models/cliente.model");
const Variante = require("../models/variante.model");
const Presentacion = require("../models/presentacion.model");
const Variedad = require("../models/variedad.model");
const Producto = require("../models/producto.model");
const Unidad = require("../models/unidad.model");
const DocumentoDetalle = require("../models/documentoDetalle.model");
const EnvioDocumento = require("../models/envioDocumento");
const { generarXML } = require("../metodosSifen/generarXml");
const { cargandoLote, actualizarLote, relacionarDocumentosConLote } = require("../metodosSifen/service/createLote.service");
const { enviarXml } = require("../metodosSifen/envioLote.service");
const { actualizarEstadoDocumentos } = require("../jobs/envioLoteXml.job"); 
const { crearDocumentoXml } = require("./documentoXml-controller");  
const { parseStringPromise, Builder } = require("xml2js");
const path = require('path'); 
const { createKude } = require("../metodosSifen/kudejs/pdfKude");
const { formatToParams, formatToData } = require("../metodosSifen/service/formatData.service");
const { generateXMLDE } = require("../metodosSifen/service/jsonDeMain.service");
const { normalizeXML } = require("../metodosSifen/service/util");
const { signXML } = require("../metodosSifen/service/signxml.service");
const { generateQR } = require("../metodosSifen/service/generateQR.service");

 

const getKude = async (req, res) => {
  
  try {

    const { empresaId } = req.usuario;
    const { id } = req.params;

    // Buscar la documento por ID
    let documentoXml = await  DocumentoXml.findByPk(id);
    if (!documentoXml) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
  
    // Obtener datos de la empresa
    const empresa = await getEmpresaById(empresaId);
    if (!empresa) {
      return res.status(404).json({ error: `No se encontró la empresa con ID ${empresaId}` });
    }
   const xmlFirmado=  documentoXml.xml.toString('utf8');
   const xmldata = await parseStringPromise(xmlFirmado);
   const gTimb = xmldata.rDE.DE[0].gTimb[0];
    //aqui lo que hare es crear un reporte por cada reportName e invocarlo segun el tipoDocumento de momento lo llamare createKude(empresa, xmlFirmado) 
    const pdfContent = await createKude(xmldata, xmlFirmado, empresa.img);
    const pdfFilePath =  `${parseInt(gTimb.iTiDE[0])}${gTimb.dNumTim[0]}${gTimb.dEst[0]}${gTimb.dPunExp[0]}${gTimb.dNumDoc[0]}.pdf`

    // Configurar la respuesta HTTP
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=FE-${pdfFilePath}.pdf`
    );

    // Enviar el contenido del PDF como respuesta
    pdfContent.pipe(res);


/*     // Establecer las cabeceras HTTP
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=FE-${pdfFilePath}`);
 
  res.send(pdfContent); */
  } catch (error) {
    console.error("Error in getPdf:", error);
    res.status(500).json({ error: error?.original?.detail || "Internal Server Error" });
  }
};
const obtenerDocumento = async (id) => {
  try {
    // Obteniendo las documentos pendientes
    const documento = await Documento.findByPk(id,{ 
      include: [
        { model: Sucursal, as: 'sucursal' },
        { model: CondicionPago, as: 'condicionPago' },
        { model: Cliente, as: 'cliente' },
        { model: TablaSifen, as: 'tipoDocumento' }
      ],
      raw: true,
      nest: true
    });
 
        const detalles = await DocumentoDetalle.findAll({
          where: { documentoId: documento.id },
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
        documento.detalles = detalles.map((detalle) => {
           
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

        return documento; // Retornar la documento con sus detalles 
  } catch (error) {
    console.error('Error al obtener documento :', error);
  }
}; 
 
const limpiarRegistros = async (documentoId) => {
  try {
    // Eliminar registros en EnvioDocumento relacionados con la documento
    await EnvioDocumento.destroy({
      where: { documentoId }
    });

    // Eliminar registros en DocumentoXml relacionados con la documento
    await DocumentoXml.destroy({
      where: { documentoId }
    });

    return 'OK'; // Confirmación de éxito
  } catch (error) {
    console.error('Error en limpiarRegistros:', error);
    return null;
  }
};
const obtenerXmlFirmados = async (empresaId, documentoId) => {
  try {
    const documentosXml = await DocumentoXml.findAll({
      where: {
        documentoId: documentoId,
        empresaId: empresaId,
        estado: 'FIRMADO'
      },
      order: [['id', 'DESC']] // Ordenar por id en orden descendente
    });

    // Si no hay registros, retornar null
    if (!documentosXml || documentosXml.length === 0) return null;

    return documentosXml[0].xml.toString('utf8'); // Retorna el XML más reciente en formato string
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

    // Buscar la documento por ID
    let documento = await obtenerDocumento(id);
    if (!documento) {
      return res.status(404).json({ error: "Documento no encontrada" });
    }
    if (documento.estado == 'Aprobado' ||documento.estado == 'Recibido' ) {
      return res.status(404).json({ error: "No se puede reintentar este tipo de documentos" });
    }
 
    // Obtener datos de la empresa
    const empresa = await getEmpresaById(empresaId);
    if (!empresa) {
      return res.status(404).json({ error: `No se encontró la empresa con ID ${empresaId}` });
    }
   //quitamos los registros anteriores
    const Ok = await limpiarRegistros(documento.id);
    const params = await formatToParams(documento,empresa); 
    const data = await formatToData(documento,empresa); 
    console.log({params,data}) 
    let xmlBase = await generateXMLDE(params,data);  
    xmlBase =    normalizeXML(xmlBase);          
    xmlBase = xmlBase.replace('<?xml version="1.0" encoding="UTF-8"?>', "")
    await crearDocumentoXml(empresa.id, documento.id, xmlBase, 1  ,'GENERADO'  )  
    const xmlFirmado =await signXML(xmlBase,empresa.certificado) 
    const xmlFirmadoConQr =await generateQR(xmlFirmado,  empresa.idCSC,  empresa.csc);
    console.log('Este es el xml xmlFirmadoConQr =>',xmlFirmadoConQr)
    await crearDocumentoXml(empresa.id, documento.id, xmlFirmadoConQr, 2  ,'FIRMADO'  )  
    const xmlfirmado = await obtenerXmlFirmados(empresa.id, documento.id);
     const lote  = await cargandoLote(empresa.id);
     if (!lote) {
      return res.status(500).json({ error: "Error al obtener el lote" });
    }
    
    // Enviar xml
    const respuesta = await enviarXml(lote.id, xmlfirmado,empresa.certificado); 
 
    const loteActualizado = await actualizarLote(lote.id, respuesta.respuesta, respuesta.id);
    console.log(loteActualizado)
    // Crear relación entre el lote y las documentos
    await relacionarDocumentosConLote(lote.id, [documento.id]);
    // Actualizar estado de las documentos según el resultado del envío
    if (loteActualizado.estado === "RECIBIDO") {
      console.log(`📨 Envío exitoso.`);
      await actualizarEstadoDocumentos([documento.id], 'Recibido');
    } else {
      console.warn(`⚠️ Fallo en el envío del lote ${lote.numeroLote}.`);
      await actualizarEstadoDocumentos([documento.id], 'Rechazado');
    }
    let documentoUpdated = await Documento.findByPk(id);
 
    return res.status(200).json({ documento: documentoUpdated });

  } catch (error) {
    console.error('❌ Error al reintentar documento:', error );
    return res.status(500).json({ error: "Error al reintentar" });
  }
};
 
const actualizarEstadoDocumentosCdc = async (cdc, nuevoEstado) => {
  try {
    await Documento.update({ estado: nuevoEstado }, {
      where: { cdc:  cdc   }
    });
    console.log(`✅ Documentos actualizadas a estado: ${nuevoEstado}`);
  } catch (error) {
    console.error('❌ Error al actualizar documentos:', error);
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
            const formateado = await extraerDatosConsultaCdc(respuesta.respuesta); 
            console.log(formateado)
            if (formateado.codigo =='0420') { 
              await actualizarEstadoDocumentosCdc( cdc, 'EstadoDesconocido');
            }
            let documentoUpdated = await Documento.findOne({ where: { cdc } });

            return res.status(200).json({data:formateado , documento:documentoUpdated});
        } catch (error) {
          console.error('❌ Error al consultar cdc:', error.message);
          return res.status(500).json({ error: "Error al consultar cdc" });
        }
 
}
const anular = async (req, res) => {
   
  try {
    // Obtener empresaId del usuario autenticado
    const { empresaId } = req.usuario;
    const { id, tipo } = req.params; 
    const evento =  (tipo === 2 ? 'Inutil' : 'Cancel') 
    // Buscar la documento por ID
    let documento = await Documento.findByPk(id);
    if (!documento) {
      return res.status(404).json({ error: "Documento no encontrada" });
    } 
    // Obtener datos de la empresa
    const empresa = await getEmpresaById(empresaId);
    if (!empresa) {
      return res.status(404).json({ error: `No se encontró la empresa con ID ${empresaId}` });
    } 
    // Enviar evento de anulación
   
    let respuesta = await envioEventoXml(+tipo, documento, empresa);
    let json = await extraeRespEvento(respuesta);
    console.log("Respuesta del evento:", json);
     await crearDocumentoXml(empresa.id,documento.id,respuesta,3,evento+json.estado);
     //Aprobado, Rechazado, ect
     if (json.estado =='Aprobado') {
       await Documento.update({estado:evento+json.estado , anulado:true,calculable:false,  valorNeto: 0,
        fechaAnulacion: new Date(), usuarioAnulacionId: req.usuario.id},{where: { id: documento.id }});
        if (documento.docAsociadoId  ) {  
           const documentoAso = await Documento.findByPk(documento.docAsociadoId);
           await documentoAso.update({ 
             calculable:true, 
           }); 
       } 
     }else{
      await Documento.update({estado:evento+json.estado },{where: { id: documento.id }});
     }
 
     
     // Actualizar el estado de la documento en la base de datos
    // Buscar la documento actualizada
    let documentoActualizada = await Documento.findByPk(id);

    // Responder con la documento actualizada
    return res.status(200).json({ documento: documentoActualizada, json });

  } catch (error) {
    console.error('❌ Error al anular documento:', error);
    return res.status(500).json({ error: "Error al anular" });
  }
};
 
 
const getEmpresaById = async (id) => {
  const tablas = ['iTiDE', 'iTipTra', 'iTImp', 'iTipCont'];
  try { 
    // Obtener empresas que generan XML
    let empresa = await Empresa.findOne({ 
      where: { id, modoSifen: 'SI' }, // Agregamos la condición aquí
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
  reintentar ,getKude
};
