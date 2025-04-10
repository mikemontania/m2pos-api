const cron = require('node-cron');
const Documento = require('../models/documento.model');
const Cliente = require('../models/cliente.model');
const Empresa = require('../models/empresa.model');
const TablaSifen = require('../models/tablaSifen.model');
const { verificarConexionEmail, enviarFactura } = require('../helpers/emailService');
 
const ejecucionJobsemail = async () => {
  console.log(`✅ ejecucionJobsemail`);
  if (process.env.AGENTEENVIOSJOB !== "true") {
    console.log("❌ Tarea de revisión para enviar lotes desactivada.");
    return;
  }

  console.log(`✅ Tarea programada cada ${process.env.MINUTO_JOBS} minutos.`);

  cron.schedule(`*/${process.env.MINUTO_JOBS} * * * *`, async () => {
    console.log('Ejecutando job de envío de facturas...');
    
    if (!(await verificarConexionEmail())) {
      console.log("⛔ No se enviarán correos debido a error en la autenticación SMTP.");
      return;
    }

    try {
      const documentos = await Documento.findAll({
        where: { estado: 'Aprobado', estadoEnvioKude: 'NOENVIADO' },
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

module.exports = { ejecucionJobsemail };