const cron = require('node-cron');
const nodemailer = require('nodemailer'); 
const Documento = require('../models/documento.model');
const Cliente = require('../models/cliente.model');
const DocumentoXml = require('../models/documentoXml.model');
const Empresa = require('../models/empresa.model');
const { parseStringPromise } = require('xml2js'); 
const { createKude } = require('../metodosSifen/kudejs/pdfKude');
const TablaSifen = require('../models/tablaSifen.model');
const { formatDate } = require('../metodosSifen/kudejs/util.kude');
 
// Configuración del transportador de correo
 //en gmail generar contraseña de aplicacion
//https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport ({ servicio : "Gmail" , host : "smtp.gmail.com" , port: process.env.MAIL_PORT,
  secure: process.env.MAIL_PORT == "465", // true solo si es puerto 465
  requireTLS: true,
  auth: {    user: "mikemontania@gmail.com",    pass: "ymnraqcwgzebwzza"   } 
});


 

// Probar autenticación antes de procesar
const verificarConexionEmail = async () => {
  try {
    await transporter.verify();
    console.log("✅ Autenticación SMTP exitosa.");
    return true;
  } catch (error) {
    console.error("❌ Error de autenticación SMTP:", error.message);
    return false;
  }
};

// Obtener XML firmado
const obtenerXmlFirmado = async (documento) => { 
  try {
    const documentosXml = await DocumentoXml.findAll({
      where: { documentoId: documento.id, estado: 'FIRMADO' },
      order: [['id', 'DESC']]
    });
    if (!documentosXml.length) return null;
    return documentosXml[0].xml.toString('utf8');
  } catch (error) {
    console.error(`Error obteniendo XML para ${documento.id}:`, error);
    return null;
  }
};
// Generar el KUDE en PDF
const obtenerKude = async (xmlFirmado, empresa) => { 
  try { 
    const xmldata = await parseStringPromise(xmlFirmado); 
    const pdfContent = await createKude(xmldata, xmlFirmado, empresa.img);
    return pdfContent; // Devuelve el PDF como un Buffer

  } catch (error) {
    console.error(`Error generando KUDE:`, error);
    return null;
  }
};

const enviarFactura = async (documento) => {
  try { 
    if (!documento.cliente || !documento.cliente.email) {
      console.log(`Cliente ${documento.cliente?.clienteId} sin email.`);
      await Documento.update({ estadoEnvioKude: 'NOENVIADO', obsEnvioKude: 'FALTA_EMAIL_C' }, { where: { id: documento.id } });
      return;
    }

    const xmlFirmado = await obtenerXmlFirmado(documento);
    if (!xmlFirmado) {
      await Documento.update({ estadoEnvioKude: 'ERROR', obsEnvioKude: 'XML_NO_ENCONTRADO' }, { where: { id: documento.id } });
      return;
    }

    const pdfBuffer = await obtenerKude(xmlFirmado, documento.empresa);
    if (!pdfBuffer) {
      console.log(`No se pudo generar el PDF para factura ${documento.cdc}`);
      await Documento.update({ estadoEnvioKude: 'ERROR', obsEnvioKude: 'PDF_NO_GENERADO' }, { where: { id: documento.id } });
      return;
    }

   
    // Configurar email con el PDF en memoria
    const mailOptions = {
      from: process.env.AGENTEENVIOEMAIL,
      to: documento.cliente.email,
      subject: `${documento.tipoDocumento.descripcion} ${documento.nroComprobante} del ${formatDate(documento.fecha)} emitida por ${documento.empresa.razonSocial}`,
      text: `Estimado cliente,\n\nAdjunto encontrará su Documento Tributario Electrónico (DTE) número ${documento.nroComprobante}  .\n\nGracias por su preferencia.`,
      attachments: [{
        filename: `${documento.cdc}.xml`,
        content: Buffer.from(xmlFirmado, 'utf-8'),
      }, {
        filename: `${documento.cdc}.pdf`,
        content: pdfBuffer,
        encoding: 'base64'
      }]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error enviando factura ${documento.id}:`, error);
      } else {
        console.log(`Factura ${documento.nroComprobante} enviada a ${documento.cliente.email} => ${info.response}`);
      }
  }); 

    await Documento.update({ estadoEnvioKude: 'ENVIADO', obsEnvioKude: 'OK' }, { where: { id: documento.id } });
  } catch (error) {
    console.error(`Error enviando factura ${documento.id}:`, error);
    await Documento.update({ 
      estadoEnvioKude: 'ERROR', 
      obsEnvioKude: error.message.substring(0, 100) // Trunca el mensaje a 100 caracteres
    }, { where: { id: documento.id } });
  }
};

// Ejecutar el job programado
const ejecucionJobsemail = async () => {
  console.log(`✅ ejecucionJobsemail`);
    const activarTarea = process.env.AGENTEENVIOSJOB === "true";
  const minutos = process.env.MINUTO_JOBS;

  if (!activarTarea) {
    console.log("❌ Tarea de revisión para enviar lotes desactivada por configuración.");
    return;
  }

  console.log(`✅ Tarea programada corriendo cada ${minutos} minutos.`);

  cron.schedule(`*/${minutos} * * * *`, async () => {
    console.log('Ejecutando job de envío de facturas...');

    // Verificar autenticación de email antes de procesar documentos
    const conexionValida = await verificarConexionEmail();
    if (!conexionValida) {
      console.log("⛔ No se enviarán correos debido a error en la autenticación SMTP.");
      return;
    }

    try {
      const documentos = await Documento.findAll({
        where: {   estado: 'Aprobado', estadoEnvioKude: 'NOENVIADO' },
        include: [{ model: Cliente, as: 'cliente' }, { model: Empresa, as: 'empresa' }, { model: TablaSifen, as: 'tipoDocumento' }]
      });

      for (const doc of documentos) {
        await enviarFactura(doc);
      }

      console.log('✅ Proceso de envío completado.');
    } catch (error) {
      console.error('❌ Error en el job de envío:', error);
    }
  });
};

module.exports = {
  ejecucionJobsemail
};
 
