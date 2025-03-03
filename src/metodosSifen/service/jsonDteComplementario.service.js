 
  const generateDatosComplementariosComercialesDeUsoEspecificos = ( data) => {
    const jsonResult = {};
    let entro = false;
    if (data['sectorEnergiaElectrica']) {
      entro = true;
      jsonResult['gGrupEner'] = generateDatosSectorEnergiaElectrica( data);
    }

    if (data['sectorSeguros']) {
      entro = true;
      jsonResult['gGrupSeg'] = generateDatosSectorSeguros( data);
    }

    if (data['sectorSupermercados']) {
      entro = true;
      jsonResult['gGrupSup'] = generateDatosSectorSupermercados( data);
    }

    if (data['sectorAdicional']) {
      entro = true;
      jsonResult['gGrupAdi'] = generateDatosDatosAdicionalesUsoComercial( data);
    }

    if (entro) {
      return jsonResult;
    } else {
      return null;
    }
  }
 
  const generateDatosSectorEnergiaElectrica = ( data) => {
    const jsonResult = {
      dNroMed: data['sectorEnergiaElectrica']['numeroMedidor'],
      dActiv: data['sectorEnergiaElectrica']['codigoActividad'],
      dCateg: data['sectorEnergiaElectrica']['codigoCategoria'],
      dLecAnt: data['sectorEnergiaElectrica']['lecturaAnterior'],
      dLecAct: data['sectorEnergiaElectrica']['lecturaActual'],
      dConKwh: data['sectorEnergiaElectrica']['lecturaActual'] - data['sectorEnergiaElectrica']['lecturaAnterior'],
    };

    /*if (data['lecturaAnterior'] > data['lecturaActual']) {
      throw new Error('Sector Energia Electrica lecturaActual debe ser mayor a lecturaAnterior');
    }*/
    return jsonResult;
  }
 
  const generateDatosSectorSeguros = (  data) => {
    const jsonResult = {
      dCodEmpSeg: data['sectorSeguros']['codigoAseguradora'],
      gGrupPolSeg: {
        dPoliza: data['sectorSeguros']['codigoPoliza'],
        dUnidVig: data['sectorSeguros']['vigenciaUnidad'], //horas, dias, año
        dVigencia: data['sectorSeguros']['vigencia'],
        dNumPoliza: data['sectorSeguros']['numeroPoliza'],
        dFecIniVig: data['sectorSeguros']['inicioVigencia'],
        dFecFinVig: data['sectorSeguros']['finVigencia'],
        dCodInt: data['sectorSeguros']['codigoInternoItem'],
      },
    };
    return jsonResult;
  }
 
  const generateDatosSectorSupermercados = (  data) => {
    const jsonResult = {
      dNomCaj: data['sectorSupermercados']['nombreCajero'],
      dEfectivo: data['sectorSupermercados']['efectivo'],
      dVuelto: data['sectorSupermercados']['vuelto'],
      dDonac: data['sectorSupermercados']['donacion'],
      dDesDonac: data['sectorSupermercados']['donacionDescripcion'].substring(0, 20),
    };
    return jsonResult;
  }

 
  const generateDatosDatosAdicionalesUsoComercial = (  data) => {
    const jsonResult = {
      /*dCiclo: data['sectorAdicional']['ciclo'].substring(0, 15),
      dFecIniC: data['sectorAdicional']['inicioCiclo'],
      dFecFinC: data['sectorAdicional']['finCiclo'],
      dVencPag: data['sectorAdicional']['vencimientoPago'],
      dContrato: data['sectorAdicional']['numeroContrato'],
      dSalAnt: data['sectorAdicional']['saldoAnterior'],*/
    };

    if (data['sectorAdicional']['ciclo']) {
      /*if (
        !((data['sectorAdicional']['ciclo'] + '').length >= 1 && (data['sectorAdicional']['ciclo'] + '').length <= 15)
      ) {
        throw new Error('El Ciclo en data.sectorAdicional.ciclo debe contener entre 1 y 15 caracteres ');
      }*/

      jsonResult['dCiclo'] = data['sectorAdicional']['ciclo'];
    }

    if (data['sectorAdicional']['inicioCiclo']) {
      /*if (!((data['sectorAdicional']['inicioCiclo'] + '').length == 10)) {
        throw new Error('El Inicio de Ciclo en data.sectorAdicional.inicioCiclo debe contener 10 caracteres ');
      }*/

      jsonResult['dFecIniC'] = data['sectorAdicional']['inicioCiclo'];
    }

    if (data['sectorAdicional']['finCiclo']) {
      /*if (!((data['sectorAdicional']['finCiclo'] + '').length == 10)) {
        throw new Error('El Fin de Ciclo en data.sectorAdicional.finCiclo debe contener 10 caracteres ');
      }*/

      jsonResult['dFecFinC'] = data['sectorAdicional']['finCiclo'];
    }

    if (data['sectorAdicional']['vencimientoPago']) {
      /*if (!((data['sectorAdicional']['vencimientoPago'] + '').length == 10)) {
        throw new Error('La fecha de Pago en data.sectorAdicional.vencimientoPago debe contener 10 caracteres ');
      }*/

      let fecha = new Date(data.fecha);
      let fechaPago = new Date(data['sectorAdicional']['vencimientoPago']);
      /*if (fecha.getTime() > fechaPago.getTime()) {
        throw new Error(
          "La fecha de pago '" +
            data['sectorAdicional']['vencimientoPago'] +
            "' en data.sectorAdicional.vencimientoPago debe ser despues de la Fecha del Documento",
        );
      }*/

      jsonResult['dVencPag'] = data['sectorAdicional']['vencimientoPago'];
    }

    if (data['sectorAdicional']['numeroContrato']) {
      /*if (
        !(
          (data['sectorAdicional']['numeroContrato'] + '').length >= 1 &&
          (data['sectorAdicional']['numeroContrato'] + '').length <= 30
        )
      ) {
        throw new Error(
          'El numero de Contrato en data.sectorAdicional.numeroContrato debe contener entre 1 y 30 caracteres ',
        );
      }*/

      jsonResult['dContrato'] = data['sectorAdicional']['numeroContrato'];
    }

    if (data['sectorAdicional']['saldoAnterior']) {
      /*if ( ! ( (data['sectorAdicional']['saldoAnterior']+"").length >= 1 && (data['sectorAdicional']['saldoAnterior']+"").length <= 30 ) ) {
        throw new Error("El numero de Contrato en data.sectorAdicional.saldoAnterior debe contener entre 1 y 30 caracteres ");        
      }*/

      jsonResult['dSalAnt'] = data['sectorAdicional']['saldoAnterior'];
    }

    return jsonResult;
  }
  module.exports = {
    generateDatosComplementariosComercialesDeUsoEspecificos
   };
  