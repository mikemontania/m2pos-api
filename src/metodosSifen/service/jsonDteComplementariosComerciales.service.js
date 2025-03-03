const { unidadesMedidas } = require("./constants.service");

 
  const generateDatosComercialesUsoGeneral = (  data) => {
    const jsonResult = {
      //dOrdCompra : data['complementarios']['ordenCompra'],
      //dOrdVta : data['complementarios']['ordenVenta'],
      //dAsiento : data['complementarios']['numeroAsiento']
    };

    if (data['complementarios'] && data['complementarios']['ordenCompra']) {
      jsonResult['dOrdCompra'] = data['complementarios']['ordenCompra'];
    }
    if (data['complementarios'] && data['complementarios']['ordenVenta']) {
      jsonResult['dOrdVta'] = data['complementarios']['ordenVenta'];
    }
    if (data['complementarios'] && data['complementarios']['numeroAsiento']) {
      jsonResult['dAsiento'] = data['complementarios']['numeroAsiento'];
    }

    if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 7) {
      //Opcional si 1 o 7
      if (
        (data['complementarios'] &&
          data['complementarios']['carga'] &&
          data['complementarios']['carga']['volumenTotal']) ||
        (data['complementarios'] && data['complementarios']['carga'] && data['complementarios']['carga']['pesoTotal'])
      ) {
        jsonResult['gCamCarg'] = generateDatosCarga(  data);
      }
    }
    return jsonResult;
  }
 
  const generateDatosCarga =(  data) => {
    //TODO ALL
    const jsonResult = {
      /*cUniMedTotVol : data['complementarios']['carga']['unidadMedida'], 
            dDesUniMedTotVol : data['complementarios']['carga']['ordenVenta'],
            dTotVolMerc : data['complementarios']['carga']['totalVolumenMercaderia'],
            cUniMedTotPes : data['complementarios']['carga']['numeroAsiento'],
            dDesUniMedTotPes : data['complementarios']['carga']['numeroAsiento'],
            dTotPesMerc : data['complementarios']['carga']['numeroAsiento'],
            iCarCarga : data['complementarios']['carga']['numeroAsiento'],
            dDesCarCarga : data['complementarios']['carga']['numeroAsiento'],*/
    };

    if (
      data['complementarios'] &&
      data['complementarios']['carga'] &&
      data['complementarios']['carga']['unidadMedidaVolumenTotal']
    ) {
 
      jsonResult['cUniMedTotVol'] = data['complementarios']['carga']['unidadMedidaVolumenTotal'];
      jsonResult['dDesUniMedTotVol'] = unidadesMedidas.filter(
        (td) => td.codigo == data['complementarios']['carga']['unidadMedidaVolumenTotal'],
      )[0]['representacion'];
    }
    if (
      data['complementarios'] &&
      data['complementarios']['carga'] &&
      data['complementarios']['carga']['volumenTotal']
    ) {
      jsonResult['dTotVolMerc'] = data['complementarios']['carga']['volumenTotal'];
    }
    if (
      data['complementarios'] &&
      data['complementarios']['carga'] &&
      data['complementarios']['carga']['unidadMedidaPesoTotal']
    ) {
      
      jsonResult['cUniMedTotPes'] = data['complementarios']['carga']['unidadMedidaPesoTotal'];
      jsonResult['dDesUniMedTotPes'] = unidadesMedidas.filter(
        (td) => td.codigo == data['complementarios']['carga']['unidadMedidaPesoTotal'],
      )[0]['representacion'];
    }
    if (data['complementarios'] && data['complementarios']['carga'] && data['complementarios']['carga']['pesoTotal']) {
      jsonResult['dTotPesMerc'] = data['complementarios']['carga']['pesoTotal'];
    }
    if (
      data['complementarios'] &&
      data['complementarios']['carga'] &&
      data['complementarios']['carga']['caracteristicaCarga']
    ) {
      /*if (
        constanteService.caracteristicasCargas.filter(
          (um) => um.codigo === data['complementarios']['carga']['caracteristicaCarga'],
        ).length == 0
      ) {
        throw new Error(
          "Característica de Carga '" +
            data['complementarios']['carga']['caracteristicaCarga'] +
            "' en data.complementarios.carga.caracteristicaCarga no válido. Valores: " +
            constanteService.caracteristicasCargas.map((a) => a.codigo + '-' + a.descripcion),
        );
      }*/
      jsonResult['iCarCarga'] = data['complementarios']['carga']['caracteristicaCarga'];
      jsonResult['dDesCarCarga'] = constanteService.caracteristicasCargas.filter(
        (td) => td.codigo == data['complementarios']['carga']['caracteristicaCarga'],
      )[0]['descripcion'];

      if (data['complementarios']['carga']['caracteristicaCarga'] == 3) {
        if (data['complementarios']['carga']['caracteristicaCargaDescripcion']) {
          jsonResult['dDesCarCarga'] = data['complementarios']['carga']['caracteristicaCargaDescripcion'];
          /*} else {
          throw new Error(
            'Para data.complementarios.carga.caracteristicaCarga = 3 debe informar el campo data.complementarios.carga.caracteristicaCargaDescripcion',
          );*/
        }
      }
    }
    return jsonResult;
  }
 
  module.exports = {
    generateDatosComercialesUsoGeneral
   };
  