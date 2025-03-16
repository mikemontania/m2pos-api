const separarXmlData = xmldata => {
    const rDE = xmldata.rDE;
    const gTimb = xmldata.rDE.DE[0].gTimb[0];
    return {
      informacionGeneral: {
        id: rDE.DE[0]["$"].Id, // Aquí accedemos al valor de "Id"
        Signature: rDE.Signature[0],
        gCamFuFD: rDE.gCamFuFD[0]
      },
      tipoDocumento: parseInt(gTimb.iTiDE[0]),
      timbrado: gTimb.dNumTim[0],
      establecimiento: gTimb.dEst[0],
      punto: gTimb.dPunExp[0],
      numero: gTimb.dNumDoc[0],
      datosDocumento: {
        fechaEmision:rDE.DE[0].gDatGralOpe[0].dFeEmiDE ,
        emisor: rDE.DE[0].gDatGralOpe[0].gEmis[0],
        operacionCom: rDE.DE[0].gDatGralOpe[0].gOpeCom[0], 
        receptor: rDE.DE[0].gDatGralOpe[0].gDatRec[0],
        timbrado: rDE.DE[0].gTimb[0],
        operacion: rDE.DE[0].gOpeDE[0],
        detalles: rDE.DE[0].gDtipDE[0].gCamItem,
        condicionesPago: rDE.DE[0].gDtipDE[0].gCamCond[0],
        totales: rDE.DE[0].gTotSub[0]
      }
    };
  };
  const titleCase = (str) => {
    return (str ?? "N/D")
      .toLowerCase()
      .split(" ") // Dividir en palabras
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizar la primera letra
      .join(" "); // Volver a unir las palabras
  };
  const formatDate = date => {
    if (date) {
      const data = date.toString().split("-");
      return `${data[2]}/${data[1]}/${data[0]}`;
    }
    return "";
  };

  const formatearId = (id) => {
    return id.replace(/(.{4})(?=.)/g, '$1 '); // Agregar un espacio cada 4 caracteres
 };
  // Función para formatear valores con separador de miles
const formatearConSeparadorMiles = (valor) => {
  if (typeof valor === 'number' || !isNaN(parseFloat(valor))) {
    return parseFloat(valor).toLocaleString(); // Formato con separador de miles
  }
  return valor; // Si no es un número, retorna el valor original
}




  module.exports = {
    formatDate,titleCase,separarXmlData,formatearConSeparadorMiles,formatearId 
  };
  