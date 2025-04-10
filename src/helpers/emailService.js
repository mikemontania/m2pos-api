const nodemailer = require('nodemailer');
const { parseStringPromise } = require('xml2js');
const { createKude } = require('../metodosSifen/kudejs/pdfKude');
const { formatDate } = require('../metodosSifen/kudejs/util.kude');
const DocumentoXml = require('../models/documentoXml.model');
const Documento = require('../models/documento.model');

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_PORT == "465",
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// Verificar conexión de email
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
    return documentosXml.length ? documentosXml[0].xml.toString('utf8') : null;
  } catch (error) {
    console.error(`Error obteniendo XML para ${documento.id}:`, error);
    return null;
  }
};

// Generar el KUDE en PDF
const obtenerKude = async (xmlFirmado, empresa) => { 
  try { 
    const xmldata = await parseStringPromise(xmlFirmado); 
    return await createKude(xmldata, xmlFirmado, empresa.img);
  } catch (error) {
    console.error(`Error generando KUDE:`, error);
    return null;
  }
};

// Enviar factura por email
const enviarFactura = async (documento) => {
  try {
    if (!documento.cliente?.email) {
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

    // Configurar email con el PDF
    const mailOptions = {
      from: process.env.AGENTEENVIOEMAIL,
      to: documento.cliente.email,
      subject: `${documento.tipoDocumento.descripcion} ${documento.nroComprobante} del ${formatDate(documento.fecha)} emitida por ${documento.empresa.razonSocial}`,
      text: `Estimado cliente,\n\nAdjunto encontrará su Documento Tributario Electrónico (DTE) número ${documento.nroComprobante}.\n\nGracias por su preferencia.`,
      attachments: [
        { filename: `${documento.cdc}.xml`, content: Buffer.from(xmlFirmado, 'utf-8') },
        { filename: `${documento.cdc}.pdf`, content: pdfBuffer, encoding: 'base64' }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log(`Factura ${documento.nroComprobante} enviada a ${documento.cliente.email}`);

    await Documento.update({ estadoEnvioKude: 'ENVIADO', obsEnvioKude: 'OK' }, { where: { id: documento.id } });

  } catch (error) {
    console.error(`Error enviando factura ${documento.id}:`, error);
    await Documento.update({ 
      estadoEnvioKude: 'ERROR', 
      obsEnvioKude: error.message.substring(0, 100)
    }, { where: { id: documento.id } });
  }
};

module.exports = {
  verificarConexionEmail,
  obtenerXmlFirmado,
  obtenerKude,
  enviarFactura
};
