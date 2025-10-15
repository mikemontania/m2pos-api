const cron = require('node-cron');
const Documento = require('../models/documento.model'); 
const { crearYVerificarTransporter, enviarFactura } = require('../helpers/emailService');
const { decryptPassphrase } = require('../helpers/encript-helper');
const Cliente = require('../models/cliente.model');
const ClienteSucursal = require('../models/ClienteSucursal.model');
const CondicionPago = require('../models/condicionPago.model');
const TablaSifen = require('../models/tablaSifen.model');
 
const procesarEmpresa = async (empresa) => {
  try {
    if (empresa.envioKude === "NO") {
      console.log(`⚠️ Empresa ${empresa.razonSocial} con envioKude desactivado.`);
      return;
    }

    const tieneEmailEnvio = empresa.emailUser && empresa.emailUser.length > 5 &&
                            empresa.emailPass && empresa.emailPass.length > 5;
    if (!tieneEmailEnvio) {
      console.log(`⚠️ Empresa ${empresa.razonSocial} no tiene email válido.`);
      return;
    }

    const pass = decryptPassphrase(empresa.emailPass);

    // 🔹 Crear y verificar transporter
    const transporter = await crearYVerificarTransporter(empresa.emailUser, pass);
    if (!transporter) {
      console.log(`⛔ No se enviarán correos para ${empresa.razonSocial} debido a error SMTP.`);
      return;
    }

    // Traer documentos pendientes (limit 30)
    const documentos = await Documento.findAll({
      where: { estado: 'Aprobado', estadoEnvioKude: 'NOENVIADO', empresaId: empresa.id },
      include: [ {
          model: Cliente,
          as: "cliente",
          attributes: ["id", "nroDocumento", "razonSocial","email"]
        },
 {
          model: ClienteSucursal,
          as: "clienteSucursal",
          attributes: ["nombre"]
        },
        {
          model: CondicionPago,
          as: "condicionPago",
          attributes: ["id", "descripcion"]
        },
        {
          model: TablaSifen,
          as: "tipoDocumento"
        },
      
      ],
      order: [['id', 'ASC']],
      limit: 30
    });
 
    if (!documentos?.length) {
      console.log(`✅ No hay documentos pendientes a Aprobados`);
      return;
    }

    console.log(`📄 Enviando ${documentos.length} documentos para ${empresa.razonSocial}`);

    for (const doc of documentos) {
      try {
        await enviarFactura(doc,empresa, transporter);
      } catch (errorDoc) {
        console.error(`❌ Error enviando factura ${doc.nroComprobante} de ${empresa.razonSocial}:`, errorDoc);
      }
    }

    console.log(`✅ Envío completado para ${empresa.razonSocial}`);

  } catch (error) {
    console.error(`❌ Error procesando empresa ${empresa.razonSocial}:`, error);
  }
};



const ejecucionJobsemail = async (empresas) => {
console.log('/*********************************ejecucionJobsemail**************************************/')
  // 🔹 Procesar empresas una por una
  for (const empresa of empresas) {
    await procesarEmpresa(empresa);
  }
};

module.exports = { ejecucionJobsemail };