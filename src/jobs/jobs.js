const { consultaLoteXml } = require("./consultaLoteXml.job");
const { envioLoteXml } = require("./envioLoteXml.job");
 const { generarXml } = require("./generadorXml.job");
const cron = require("node-cron"); 
// Asegúrate de importar el modelo adecuado
 const Empresa = require("../models/empresa.model"); 
const TablaSifen = require("../models/tablaSifen.model");
const Departamento = require("../models/departamento.model");
const Ciudad = require("../models/ciudad.model");
const Barrio = require("../models/barrio.model"); 
const EmpresaActividad = require("../models/empresaActividad.model");
const Actividad = require("../models/actividad.model");
require("dotenv").config(); // Cargar variables de entorno
const { Op } = require("sequelize");
const { loadCertificateAndKey } = require("../metodosSifen/obtenerCertificado"); 
const Moneda = require("../models/moneda.model"); 


const getEmpresas = async () => {
const tablas = ['iTiDE', 'iTipTra', 'iTImp', 'iTipCont'];
try {
  // Obtener empresas que generan XML
  const empresas = await Empresa.findAll({
    where: { modoSifen: 'SI'   },
    include: [
      { model: Moneda, as: 'moneda' },
      { model: Departamento, as: 'departamento' },
      { model: Ciudad, as: 'ciudad' },
      { model: Barrio, as: 'barrio' }
    ],
    raw: true,
    nest: true
  });

  if (!empresas.length) return [];

   // Obtener registros SIFEN
  const registros = await TablaSifen.findAll({
    where: { tabla: { [Op.in]: tablas } },
    raw: true,
    nest: true
  });

  console.log("Obteniendo registros SIFEN... =>", registros?.length);

  //Uso de Promise.all() para obtener actividades en paralelo, evitando consultas innecesariamente secuenciales.
  const actividadesPorEmpresa = await Promise.all(
    empresas.map(empresa =>
      EmpresaActividad.findAll({
        where: { empresaId: empresa.id },
        include: [{ model: Actividad, as: "actividades" }],
        raw: true,
        nest: true
      }).then(data =>
        data.map(a => ({
          cActEco: a.actividades.codigo,
          dDesActEco: a.actividades.descripcion
        }))
      )
    )
  );

  // Agregar datos SIFEN y actividades a cada empresa
  const empresasCompletas = await Promise.all(
    empresas.map(async (empresa, index) => {
      const certificado = await loadCertificateAndKey(empresa.id);
/*       console.log('************certificado**************',certificado);
 */
      if (!certificado) return null; // Excluir si el certificado es null 
      return {
        ...empresa,
        tipoContribuyente: registros.find(t => t.codigo == empresa.tipoContId && t.tabla === 'iTipCont'),
        tipoTransaccion: registros.find(t => t.codigo == empresa.tipoTransaId && t.tabla === 'iTipTra'),
        tipoImpuesto: registros.find(t => t.codigo == empresa.tipoImpId && t.tabla === 'iTImp'),
        actividades: actividadesPorEmpresa[index] || [],
        certificado: certificado || null
      };
    })
  );

 /*  console.log('Empresas procesadas:', empresasCompletas); */
  return empresasCompletas;
} catch (error) {
  console.error('❌ Error al obtener empresas:', error);
  return [];
}
};
const realizaTareas =async () =>{
  
  
    try {
      const empresas = await getEmpresas();
        if (!empresas?.length) {
            console.log('⏳ No hay empresas con facturación electrónica. o no tienen certificado valido');
            return;
          }
          console.log(`✅ Se encontraron ${empresas.length} empresas.`);
        await generarXml(empresas);
        await envioLoteXml(empresas);
        await consultaLoteXml(empresas);  
    } catch (error) {
        console.error('❌ Error al realizar jobs... :', error);
    }
}

const ejecucionJobs =() =>{

const activarTarea = process.env.ENABLE_VENTAS_JOB === "true";
const minutos = process.env.MINUTO_JOBS;
if (activarTarea) {
  console.log(`✅ Tarea programada para corriendo cada ${minutos} minutos.`);
  cron.schedule(`*/${minutos} * * * *`, realizaTareas, {
    scheduled: true,
    timezone: "America/Asuncion",
  });
} else {
  console.log("❌ Tarea de revisión para enviar lotes esta desactivada por configuración.");
}



}
 
module.exports = {
    ejecucionJobs
  };
  