
const ejecucionJobs =() =>{
    require("./generadorXml.job");
    require("./generadorInutilizacion.job");
    require("./envioLoteXml.job");
    require("./consultaLoteXml.job");
}
 
module.exports = {
    ejecucionJobs
  };
  