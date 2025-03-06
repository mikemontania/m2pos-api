

const { tiposDocumentos, tiposRegimenes, tiposEmisiones, tiposConstancias, tiposDocumentosImpresos, tiposDocumentosAsociados, caracteristicasCargas, unidadesMedidas, tiposDocumentosIdentidades, validateDepartamentoDistritoCiudad, departamentos, distritos, ciudades, modalidadesTransportes, tiposTransportes, condicionesNegociaciones, monedas, condicionesCreditosTipos, condicionesTiposPagos, tarjetasCreditosTipos, condicionesOperaciones, remisionesResponsables, remisionesMotivos, notasCreditosMotivos, naturalezaVendedorAutofactura, indicadoresPresencias, paises, tiposDocumentosReceptor, tiposOperaciones, obligaciones, tiposTransacciones, globalPorItem, tiposImpuestos } = require("./constants.service");
const { generateDatosItemsOperacionValidate } = require("./jsonDteItemValidate.service");
const { leftZero, isIsoDate } = require("./util");
const validateValues = (params, data) => {
  errors = new Array();

  if (tiposDocumentos.filter((um) => um.codigo === +data['tipoDocumento']).length == 0) {
    errors.push(
      "Tipo de Documento '" +
      data['tipoDocumento'] +
      "' en data.tipoDocumento no válido. Valores: " +
      tiposDocumentos.map((a) => a.codigo + '-' + a.descripcion),
    );
  }

  if (typeof data['cliente'] == 'undefined') {
    errors.push('Debe especificar los datos del Cliente en data.cliente');
  }

  if (data['cliente']) {
    if (typeof data['cliente']['contribuyente'] == 'undefined') {
      errors.push(
        'Debe indicar si el Cliente es o no un Contribuyente true|false en data.cliente.contribuyente',
      );
    }

    if (typeof data['cliente']['contribuyente'] == 'undefined') {
      errors.push(
        'Debe indicar si el Cliente es o no un Contribuyente true|false en data.cliente.contribuyente',
      );
    }

    if (!(data['cliente']['contribuyente'] === true || data['cliente']['contribuyente'] === false)) {
      errors.push('data.cliente.contribuyente debe ser true|false');
    }
  }

  generateCodigoControlValidate(params, data);

  datosEmisorValidate(params, data);

  generateDatosOperacionValidate(data);

  generateDatosGeneralesValidate(params, data);

  generateDatosEspecificosPorTipoDEValidate(params, data);

  if (data['tipoDocumento'] == 4) {
    generateDatosAutofacturaValidate(data);
  }

  if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 4) {
    generateDatosCondicionOperacionDEValidate(data);
  }

  errors = generateDatosItemsOperacionValidate(params, data, errors);

  generateDatosComplementariosComercialesDeUsoEspecificosValidate(data);

  if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 7) {
    //1 Opcional, 7 Obligatorio
    if (data['tipoDocumento'] == 7) {
      if (!data['detalleTransporte']) {
        errors.push(
          'Debe especificar el detalle de transporte en data.transporte para el Tipo de Documento = 7',
        );
      } else {
        generateDatosTransporteValidate(data);
      }
    } else {
      //Es por que tipoDocumento = 1
      if (data['detalleTransporte']) {
        generateDatosTransporteValidate(data);
      }
    }
  }

  if (data['tipoDocumento'] != 7) {
    generateDatosTotalesValidate(data);
  }

  if (data['complementarios']) {
    generateDatosComercialesUsoGeneralValidate(data);
  }

  if (data['moneda'] != 'PYG' && data['condicionTipoCambio'] == 1) {
    if (!data['cambio']) {
      errors.push(
        'Debe especificar el valor del Cambio en data.cambio cuando moneda != PYG y la Cotización es Global',
      );
    }
  }

  if (data['tipoDocumento'] == 4 || data['tipoDocumento'] == 5 || data['tipoDocumento'] == 6) {
    if (!data['documentoAsociado']) {
      errors.push(
        'Documento asociado es obligatorio para el tipo de documento electrónico (' +
        data['tipoDocumento'] +
        ') seleccionado',
      );
    }
  }
  if (
    data['tipoDocumento'] == 1 ||
    data['tipoDocumento'] == 4 ||
    data['tipoDocumento'] == 5 ||
    data['tipoDocumento'] == 6 ||
    data['tipoDocumento'] == 7
  ) {
    if (data['documentoAsociado']) {
      if (!Array.isArray(data['documentoAsociado'])) {
        generateDatosDocumentoAsociadoValidate(data['documentoAsociado'], data);
      } else {
        //Caso sea un array.

        for (var i = 0; i < data['documentoAsociado'].length; i++) {
          const dataDocumentoAsociado = data['documentoAsociado'][i];

          generateDatosDocumentoAsociadoValidate(dataDocumentoAsociado, data);
        }
      }
    }
  }

  //Tratamiento Final, del Envio del Error, no tocar
  if (this.errors.length > 0) {
    let errorExit = new Error();

    let msgErrorExit = '';

    let recorrerHasta = errors.length;
    if ((defaultConfig.errorLimit || 3) < recorrerHasta) {
      recorrerHasta = defaultConfig.errorLimit || 3;
    }

    for (let i = 0; i < recorrerHasta; i++) {
      const error = errors[i];
      msgErrorExit += error;

      if (i < recorrerHasta - 1) {
        msgErrorExit += defaultConfig.errorSeparator + '';
      }
    }

    errorExit.message = msgErrorExit;
    /*errorExit.firstMessage =errors[0];
    errorExit.errorsArray =errors;*/
    throw errorExit;
  }
}

const generateCodigoControlValidate = (data) => {
  if (data.cdc && (data.cdc + '').length == 44) {
    //Caso ya se le pase el CDC
    //const codigoSeguridad = data.cdc.substring(34, 43);
    const codigoControl = data.cdc;

    //Como se va utilizar el CDC enviado como parametro, va a verificar que todos los datos del XML coincidan con el CDC.
    const tipoDocumentoCDC = codigoControl.substring(0, 2);
    //const rucCDC =codigoControl.substring(2, 10);
    //const dvCDC =codigoControl.substring(10, 11);
    const establecimientoCDC = codigoControl.substring(11, 14);
    const puntoCDC = codigoControl.substring(14, 17);
    const numeroCDC = codigoControl.substring(17, 24);
    //const tipoContribuyenteCDC =codigoControl.substring(24, 25);
    const fechaCDC = codigoControl.substring(25, 33);
    const tipoEmisionCDC = codigoControl.substring(33, 34);

    if (+data['tipoDocumento'] != +tipoDocumentoCDC) {
      errors.push(
        "El Tipo de Documento '" +
        data['tipoDocumento'] +
        "' en data.tipoDocumento debe coincidir con el CDC re-utilizado (" +
        +tipoDocumentoCDC +
        ')',
      );
    }

    const establecimiento = leftZero(data['establecimiento'], 3);
    if (establecimiento != establecimientoCDC) {
      errors.push(
        "El Establecimiento '" +
        establecimiento +
        "'en data.establecimiento debe coincidir con el CDC reutilizado (" +
        establecimientoCDC +
        ')',
      );
    }

    const punto = leftZero(data['punto'], 3);
    if (punto != puntoCDC) {
      errors.push(
        "El Punto '" + punto + "' en data.punto debe coincidir con el CDC reutilizado (" + puntoCDC + ')',
      );
    }

    const numero = leftZero(data['numero'], 7);
    if (numero != numeroCDC) {
      errors.push(
        "El Numero de Documento '" +
        numero +
        "'en data.numero debe coincidir con el CDC reutilizado (" +
        numeroCDC +
        ')',
      );
    }

    /*if (+data['tipoContribuyente'] != +tipoContribuyenteCDC) {
     errors.push("El Tipo de Contribuyente '" + data['tipoContribuyente'] + "' en data.tipoContribuyente debe coincidir con el CDC reutilizado (" + tipoContribuyenteCDC + ")");
    }*/
    const fecha =
      (data['fecha'] + '').substring(0, 4) +
      (data['fecha'] + '').substring(5, 7) +
      (data['fecha'] + '').substring(8, 10);
    if (fecha != fechaCDC) {
      errors.push(
        "La fecha '" + fecha + "' en data.fecha debe coincidir con el CDC reutilizado (" + fechaCDC + ')',
      );
    }

    if (+data['tipoEmision'] != +tipoEmisionCDC) {
      errors.push(
        "El Tipo de Emisión '" +
        data['tipoEmision'] +
        "' en data.tipoEmision debe coincidir con el CDC reutilizado (" +
        tipoEmisionCDC +
        ')',
      );
    }
  }
}

const datosEmisorValidate = (params, data) => {
  if (params['ruc'].indexOf('-') == -1) {
    errors.push('RUC debe contener dígito verificador en params.ruc');
  }
  let rucEmisor = params['ruc'].split('-')[0];
  const dvEmisor = params['ruc'].split('-')[1];

  var reg = new RegExp(/^\d+$/);
  /*if (!reg.test(rucEmisor)) {
   errors.push("La parte que corresponde al RUC '" + params['ruc'] + "' en params.ruc debe ser numérico");
  }*/
  if (rucEmisor.length > 8) {
    errors.push(
      "La parte que corresponde al RUC '" + params['ruc'] + "' en params.ruc debe contener de 1 a 8 caracteres",
    );
  }

  if (!reg.test(dvEmisor)) {
    errors.push(
      "La parte que corresponde al DV del RUC '" + params['ruc'] + "' en params.ruc debe ser numérico",
    );
  }
  if (dvEmisor > 9) {
    errors.push(
      "La parte que corresponde al DV del RUC '" + params['ruc'] + "' en params.ruc debe ser del 1 al 9",
    );
  }

  if (!((params['timbradoNumero'] + '').length == 8)) {
    errors.push('Debe especificar un Timbrado de 8 caracteres en params.timbradoNumero');
  }

  if (!isIsoDate(params['timbradoFecha'])) {
    errors.push(
      "Valor de la Fecha '" + params['timbradoFecha'] + "' en params.fecha no válido. Formato: yyyy-MM-dd",
    );
  }

  if (params['tipoRegimen']) {
    if (tiposRegimenes.filter((um) => um.codigo === params['tipoRegimen']).length == 0) {
      errors.push(
        "Tipo de Regimen '" +
        data['tipoRegimen'] +
        "' en params.tipoRegimen no válido. Valores: " +
        tiposRegimenes.map((a) => a.codigo + '-' + a.descripcion),
      );
    }
  }

  if (!params['razonSocial']) {
    errors.push('La razon social del emisor en params.razonSocial no puede ser vacio');
  } else {
    if (!((params['razonSocial'] + '').length >= 4 && (params['razonSocial'] + '').length <= 250)) {
      errors.push(
        "La razon Social del Emisor '" +
        params['razonSocial'] +
        "' en params.razonSocial debe tener de 4 a 250 caracteres",
      );
    }
  }

  if (params['nombreFantasia'] && (params['nombreFantasia'] + '').length > 0) {
    if (!((params['nombreFantasia'] + '').length >= 4 && (params['nombreFantasia'] + '').length <= 250)) {
      errors.push(
        "El nombre de Fantasia del Emisor '" +
        params['nombreFantasia'] +
        "' en params.nombreFantasia debe tener de 4 a 250 caracteres",
      );
    }
  }

  //Aqui hay que verificar los datos de las sucursales
  if (!(params['establecimientos'] && Array.isArray(params['establecimientos']))) {
    errors.push('Debe especificar un array de establecimientos en params.establecimientos');
  } else {
    for (let i = 0; i < params['establecimientos'].length; i++) {
      const establecimiento = params['establecimientos'][i];

      if (!establecimiento.codigo) {
        errors.push(
          'Debe especificar el código del establecimiento en params.establecimientos[' + i + '].codigo',
        );
      }

      if (establecimiento['telefono']) {
        if (!(establecimiento['telefono'].length >= 6 && establecimiento['telefono'].length <= 15)) {
          errors.push(
            "El valor '" +
            establecimiento['telefono'] +
            "' en params.establecimientos[" +
            i +
            '].telefono debe tener una longitud de 6 a 15 caracteres',
          );
        } else {
          if (
            (establecimiento['telefono'] + '').includes('(') ||
            (establecimiento['telefono'] + '').includes(')') ||
            (establecimiento['telefono'] + '').includes('[') ||
            (establecimiento['telefono'] + '').includes(']')
          ) {
            /*this.errors.push(
              "El valor '" +
                establecimiento['telefono'] +
                "' en params.establecimientos[" +
                i +
                '].telefono no puede contener () o []',
            );*/
            //Finalmente no da error en la SET por esto
          }
        }
      }
    }
  }
}

const generateDatosOperacionValidate = (data) => {
  /*if (params['ruc'].indexOf('-') == -1) { //removido temporalmente, parece que no hace falta
   errors.push('RUC debe contener dígito verificador en params.ruc');
  }*/

  if (tiposEmisiones.filter((um) => um.codigo === data['tipoEmision']).length == 0) {
    errors.push(
      "Tipo de Emisión '" +
      data['tipoEmision'] +
      "' en data.tipoEmision no válido. Valores: " +
      tiposEmisiones.map((a) => a.codigo + '-' + a.descripcion),
    );
  }

  //Validar aqui "dInfoFisc"
  if (data['tipoDocumento'] == 7) {
    //Nota de Remision
    if (!(data['descripcion'] && (data['descripcion'] + '').trim().length > 0)) {
      //Segun dicen en TDE no es obligatorio, entonces se retira la validacion.
      //this.errors.push('Debe informar la Descripción en data.descripcion para el Documento Electrónico');
    }
  }
}

const generateDatosGeneralesValidate = (params, data) => {
  generateDatosGeneralesInherentesOperacionValidate(data);

  generateDatosGeneralesEmisorDEValidate(params, data);

  if (defaultConfig.userObjectRemove == false) {
    //Si está TRUE no crea el objeto usuario
    if (data['usuario']) {
      //No es obligatorio
      generateDatosGeneralesResponsableGeneracionDEValidate(data);
    }
  }
  generateDatosGeneralesReceptorDEValidate(data);
}

const generateDatosGeneralesInherentesOperacionValidate = (data) => {
  if (data['tipoDocumento'] == 7) {
    //C002
    return; //No informa si el tipo de documento es 7
  }

  if (!isIsoDateTime(data['fecha'])) {
    errors.push(
      "Valor de la Fecha '" + data['fecha'] + "' en data.fecha no válido. Formato: yyyy-MM-ddTHH:mm:ss",
    );
  }

  if (!data['tipoImpuesto']) {
    errors.push('Debe especificar el Tipo de Impuesto en data.tipoImpuesto');
  } else {
    if (tiposImpuestos.filter((um) => um.codigo === +data['tipoImpuesto']).length == 0) {
      errors.push(
        "Tipo de Impuesto '" +
        data['tipoImpuesto'] +
        "' en data.tipoImpuesto no válido. Valores: " +
        tiposImpuestos.map((a) => a.codigo + '-' + a.descripcion),
      );
    }
  }

  let moneda = data['moneda'];
  if (!moneda) {
    moneda = 'PYG';
  }

  if (monedas.filter((um) => um.codigo === moneda).length == 0) {
    errors.push(
      "Moneda '" +
      moneda +
      "' en data.moneda no válido. Valores: " +
      monedas.map((a) => a.codigo + '-' + a.descripcion),
    );
  }

  if (data['condicionAnticipo']) {
    if (globalPorItem.filter((um) => um.codigo === data['condicionAnticipo']).length == 0) {
      errors.push(
        "Condición de Anticipo '" +
        data['condicionAnticipo'] +
        "' en data.condicionAnticipo no válido. Valores: " +
        globalPorItem.map((a) => a.codigo + '-Anticipo ' + a.descripcion),
      );
    }
  } else {
    //condicionAnticipo - si no tiene condicion anticipo, pero tipo transaccion es 9, que de un error.
  }

  if (tiposTransacciones.filter((um) => um.codigo === data['tipoTransaccion']).length == 0) {
    errors.push(
      "Tipo de Transacción '" +
      data['tipoTransaccion'] +
      "' en data.tipoTransaccion no válido. Valores: " +
      tiposTransacciones.map((a) => a.codigo + '-' + a.descripcion),
    );
  }

  if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 4) {
    //Obligatorio informar iTipTra D011
    if (!data['tipoTransaccion']) {
      errors.push('Debe proveer el Tipo de Transacción en data.tipoTransaccion');
    }
  }

  if (moneda != 'PYG') {
    if (!data['condicionTipoCambio']) {
      errors.push('Debe informar el tipo de Cambio en data.condicionTipoCambio');
    }
  }

  if (data['condicionTipoCambio'] == 1 && moneda != 'PYG') {
    if (!(data['cambio'] && data['cambio'] > 0)) {
      errors.push('Debe informar el valor del Cambio en data.cambio');
    }
  }

  if (data['obligaciones']) {
    if (!Array.isArray(data['obligaciones'])) {
      errors.push('El valor de data.obligaciones debe ser un Array');
    } else {
      for (let i = 0; i < data['obligaciones'].length; i++) {
        let obligacion = data['obligaciones'][i];

        if (!obligacion.codigo) {
          errors.push('No fue especificado un código en data.obligaciones[' + i + '].codigo');
        } else {
          //Verificar cada item
          if (obligaciones.filter((um) => um.codigo === +obligacion.codigo).length == 0) {
            errors.push(
              "Obligación '" +
              obligacion.codigo +
              "' en data.obligaciones[" +
              i +
              '].codigo no válido. Valores: ' +
              constanteService.obligaciones.map((a) => a.codigo + '-' + a.descripcion),
            );
          }
        }
      }
    }
  }
}

const generateDatosGeneralesEmisorDEValidate = (params, data) => {
  const regExpOnlyNumber = new RegExp(/^\d+$/);

  if (!(params && params.establecimientos)) {
    errors.push('Debe proveer un Array con la información de los establecimientos en params');
  }

  //Validar si el establecimiento viene en params
  let establecimiento = leftZero(data['establecimiento'], 3);
  //let punto = leftZero(data['punto'], 3);

  if (params.establecimientos.filter((um) => um.codigo === establecimiento).length == 0) {
    errors.push(
      "Establecimiento '" +
      establecimiento +
      "' no encontrado en params.establecimientos*.codigo. Valores: " +
      params.establecimientos.map((a) => a.codigo + '-' + a.denominacion),
    );
  }

  /*if (params['ruc'].indexOf('-') == -1) { //Removido temporalmente, al parecer no hace falta
   errors.push('RUC debe contener dígito verificador en params.ruc');
  }*/

  if (!(params['actividadesEconomicas'] && params['actividadesEconomicas'].length > 0)) {
    errors.push('Debe proveer el array de actividades económicas en params.actividadesEconomicas');
  }

  //Validacion de algunos datos de la sucursal
  const establecimientoUsado = params['establecimientos'].filter((e) => e.codigo === establecimiento)[0];

  if (!establecimientoUsado) {
    errors.push(
      'Debe especificar los datos del Establecimiento "' + establecimiento + '" en params.establecimientos*',
    );
  } else {
    if (!establecimientoUsado.ciudad) {
      errors.push('Debe proveer la Ciudad del establecimiento en params.establecimientos*.ciudad');
    }
    if (!establecimientoUsado.distrito) {
      errors.push('Debe proveer la Distrito del establecimiento en params.establecimientos*.distrito');
    }
    if (!establecimientoUsado.departamento) {
      errors.push('Debe proveer la Departamento del establecimiento en params.establecimientos*.departamento');
    }

    validateDepartamentoDistritoCiudad(
      'params.establecimientos*',
      +establecimientoUsado.departamento,
      +establecimientoUsado.distrito,
      +establecimientoUsado.ciudad,
      errors,
    );

    if (establecimientoUsado['numeroCasa']) {
      if (!regExpOnlyNumber.test(establecimientoUsado['numeroCasa'])) {
        errors.push('El Número de Casa en params.establecimientos*.numeroCasa debe ser numérico');
      }
    }
  }
}

const generateDatosGeneralesResponsableGeneracionDEValidate = (data) => {
  if (
    tiposDocumentosIdentidades.filter((um) => um.codigo === +data['usuario']['documentoTipo'])
      .length == 0
  ) {
    errors.push(
      "Tipo de Documento '" +
      data['usuario']['documentoTipo'] +
      "' no encontrado en data.usuario.documentoTipo. Valores: " +
      tiposDocumentosIdentidades.map((a) => a.codigo + '-' + a.descripcion),
    );
  }

  if (!data['usuario']['documentoNumero']) {
    errors.push('El Documento del Responsable en data.usuario.documentoNumero no puede ser vacio');
  }

  if (!data['usuario']['nombre']) {
    errors.push('El Nombre del Responsable en data.usuario.nombre no puede ser vacio');
  }

  if (!data['usuario']['cargo']) {
    errors.push('El Cargo del Responsable en data.usuario.cargo no puede ser vacio');
  }
}

const generateDatosGeneralesReceptorDEValidate = (data) => {
  if (!data['cliente']) {
    return; //El error de cliente vacio, ya fue validado arriba
  }

  if (!data['cliente']['tipoOperacion']) {
    errors.push('Tipo de Operación del Cliente en data.cliente.tipoOperacion es requerido > 0');
  } else {
    if (
      tiposOperaciones.filter((um) => um.codigo === +data['cliente']['tipoOperacion']).length ==
      0
    ) {
      errors.push(
        "Tipo de Operación '" +
        data['cliente']['tipoOperacion'] +
        "' del Cliente en data.cliente.tipoOperacion no encontrado. Valores: " +
        tiposOperaciones.map((a) => a.codigo + '-' + a.descripcion),
      );
    }
  }
  if (!data['cliente']['contribuyente'] && data['cliente']['tipoOperacion'] != 4) {
    if (
      tiposDocumentosReceptor.filter((um) => um.codigo === +data['cliente']['documentoTipo'])
        .length == 0
    ) {
      errors.push(
        "Tipo de Documento '" +
        data['cliente']['documentoTipo'] +
        "' del Cliente en data.cliente.documentoTipo no encontrado. Valores: " +
        tiposDocumentosReceptor.map((a) => a.codigo + '-' + a.descripcion),
      );

      if (+data['cliente']['documentoTipo'] == 9) {
        if (!data['cliente']['documentoTipoDescripcion']) {
          errors.push(
            'Debe especificar la Descripción para el tipo de Documento en data.cliente.documentoTipoDescripcion para documentoTipo=9',
          );
        }
      }
    }
  }

  var regExpOnlyNumber = new RegExp(/^\d+$/);
  if (data['cliente']['contribuyente']) {
    if (!data['cliente']['ruc']) {
      errors.push('Debe proporcionar el RUC en data.cliente.ruc');
    } else {
      if (data['cliente']['ruc'].indexOf('-') == -1) {
        errors.push('RUC debe contener dígito verificador en data.cliente.ruc');
      }

      const rucCliente = data['cliente']['ruc'].split('-');

      //Un RUC puede ser alphanumerico
      /*if (!regExpOnlyNumber.test((rucCliente[0] + '').trim())) {
       errors.push(
          "La parte del RUC del Cliente '" + data['cliente']['ruc'] + "' en data.cliente.ruc debe ser numérico",
        );
      }*/
      if (!regExpOnlyNumber.test((rucCliente[1] + '').trim())) {
        errors.push(
          "La parte del DV del RUC del Cliente '" +
          data['cliente']['ruc'] +
          "' en data.cliente.ruc debe ser numérico",
        );
      }

      if (!(rucCliente[0].length >= 3 && rucCliente[0].length <= 8)) {
        errors.push(
          "La parte del RUC '" + data['cliente']['ruc'] + "' en data.cliente.ruc debe contener de 3 a 8 caracteres",
        );
      }

      if (rucCliente[1] > 9) {
        errors.push(
          "La parte del DV del RUC '" + data['cliente']['ruc'] + "' en data.cliente.ruc debe ser del 1 al 9",
        );
      }
    }

    if (!data['cliente']['tipoContribuyente']) {
      errors.push('Debe proporcionar el Tipo de Contribuyente en data.cliente.tipoContribuyente');
    }
  }

  if (!data['cliente']['razonSocial']) {
    errors.push('La razon social del receptor en data.cliente.razonSocial no puede ser vacio');
  } else {
    if (!((data['cliente']['razonSocial'] + '').length >= 4 && (data['cliente']['razonSocial'] + '').length <= 250)) {
      errors.push(
        "La razon Social del Cliente '" +
        data['cliente']['razonSocial'] +
        "' en data.cliente.razonSocial debe tener de 4 a 250 caracteres",
      );
    }
  }

  if (data['cliente']['nombreFantasia'] && (data['cliente']['nombreFantasia'] + '').length > 0) {
    if (
      !(
        (data['cliente']['nombreFantasia'] + '').length >= 4 && (data['cliente']['nombreFantasia'] + '').length <= 250
      )
    ) {
      errors.push(
        "El nombre de Fantasia del Cliente '" +
        data['cliente']['nombreFantasia'] +
        "' en data.cliente.nombreFantasia debe tener de 4 a 250 caracteres",
      );
    }
  }

  if (paises.filter((pais) => pais.codigo === data['cliente']['pais']).length == 0) {
    errors.push(
      "Pais '" +
      data['cliente']['pais'] +
      "' del Cliente en data.cliente.pais no encontrado. Valores: " +
      paises.map((a) => a.codigo + '-' + a.descripcion),
    );
  }

  if (data['tipoDocumento'] == 4) {
    if (data['cliente']['tipoOperacion'] != 2) {
      errors.push('El Tipo de Operación debe ser 2-B2C para el Tipo de Documento AutoFactura');
    }
  }

  if (!data['cliente']['contribuyente'] && data['cliente']['tipoOperacion']) {
    //No es contribuyente
    //Obligatorio completar D210

    if (!data['cliente']['contribuyente'] && data['cliente']['tipoOperacion'] != 4) {
      if (!data['cliente']['documentoTipo']) {
        //Val.: 59
        errors.push('Debe informar el Tipo de Documento del Cliente en data.cliente.documentoTipo');
      }

      //Cuando el campo puede ser un número, y se admite el valor cero, mejor preguntar de ésta forma
      if (typeof data['cliente']['documentoNumero'] == 'undefined') {
        //Val.: 65
        errors.push('Debe informar el número de documento en data.cliente.documentoNumero');
      } else {
        //Validar que documentoNumero no tenga .
        if ((data['cliente']['documentoNumero'] + '').indexOf('.') > -1) {
          errors.push(
            'El valor "' + data['cliente']['documentoNumero'] + '" en data.cliente.documentoNumero no es válido ',
          );
        }
        //Validar que documentoNumero no tenga /
        if ((data['cliente']['documentoNumero'] + '').indexOf('/') > -1) {
          errors.push(
            'El valor "' + data['cliente']['documentoNumero'] + '" en data.cliente.documentoNumero no es válido ',
          );
        }
      }
    }
  }

  if (
    !data['cliente']['contribuyente'] &&
    data['tipoDocumento'] != 4 &&
    data['cliente']['tipoOperacion'] != 2 &&
    data['cliente']['tipoOperacion'] != 4
  ) {
    //Val.: 46. parrafo 1
    errors.push('El tipo de Operación debe ser 2-B2C o 4-B2F para el Receptor "No Contribuyente"');
  }

  if (data['cliente']['tipoOperacion'] == 4 && data['cliente']['contribuyente'] == true) {
    //Val.: 46. parrafo 2
    errors.push('La naturaleza del Receptor debe ser "No contribuyente" para el Tipo de Operación = 4-B2F');
  }



  if (data['tipoDocumento'] === 7) {
    if (!data['cliente']['direccion']) {
      errors.push('data.cliente.direccion es Obligatorio para Tipo de Documento 7');
    }
  }

  if (data['cliente']['direccion']) {
    //Si tiene dirección hay que completar numero de casa.

    if (
      !(
        (data['cliente']['direccion'] + '').trim().length >= 1 &&
        (data['cliente']['direccion'] + '').trim().length <= 255
      )
    ) {
      errors.push(
        "La dirección del Receptor '" +
        data['cliente']['direccion'] +
        "' en data.cliente.direccion debe tener de 1 a 255 caracteres",
      );
    }

    if (data['cliente']['numeroCasa'] == null) {
      errors.push('Debe informar el Número de casa del Receptor en data.cliente.numeroCasa');
    }

    if (!((data['cliente']['numeroCasa'] + '').length > 0)) {
      errors.push('Debe informar el Número de casa del Receptor en data.cliente.numeroCasa');
    }

  }

  if (data['cliente']['numeroCasa']) {
    if (!regExpOnlyNumber.test(data['cliente']['numeroCasa'])) {
      errors.push('El Número de Casa en data.cliente.numeroCasa debe ser numérico');
    }
  }

  if (data['cliente']['direccion'] && data['cliente']['tipoOperacion'] != 4) {
    if (!data['cliente']['ciudad']) {
      errors.push('Obligatorio especificar la Ciudad en data.cliente.ciudad para Tipo de Operación != 4');
    } else {
      if (
        ciudades.filter((ciudad) => ciudad.codigo === +data['cliente']['ciudad']).length == 0
      ) {
        errors.push(
          "Ciudad '" +
          data['cliente']['ciudad'] +
          "' del Cliente en data.cliente.ciudad no encontrado. Valores: " +
          ciudades.map((a) => a.codigo + '-' + a.descripcion),
        );
      }

      //De acuerdo a la Ciudad pasada como parametro, buscar el distrito y departamento y asignar dichos
      //valores de forma predeterminada, aunque este valor sera sobre-escrito caso el usuario envie
      //data['cliente']['distrito'] y data['cliente']['departamento']
      let objCiudad = ciudades.filter((ciu) => ciu.codigo === +data['cliente']['ciudad']);

      if (objCiudad && objCiudad[0]) {
        let objDistrito = distritos.filter((dis) => dis.codigo === +objCiudad[0]['distrito']);

        let objDepartamento = departamentos.filter(
          (dep) => dep.codigo === +objDistrito[0]['departamento'],
        );

        data['cliente']['distrito'] = objDistrito[0]['codigo'];

        data['cliente']['departamento'] = objDepartamento[0]['codigo'];
      }
    }

    if (!data['cliente']['distrito']) {
      errors.push('Obligatorio especificar el Distrito en data.cliente.distrito para Tipo de Operación != 4');
    } else if (
      distritos.filter((distrito) => distrito.codigo === +data['cliente']['distrito']).length ==
      0
    ) {
      errors.push(
        "Distrito '" +
        data['cliente']['distrito'] +
        "' del Cliente en data.cliente.distrito no encontrado. Valores: " +
        distritos.map((a) => a.codigo + '-' + a.descripcion),
      );
    }

    if (!data['cliente']['departamento']) {
      errors.push(
        'Obligatorio especificar el Departamento en data.cliente.departamento para Tipo de Operación != 4',
      );
    } else if (
      departamentos.filter(
        (departamento) => departamento.codigo === +data['cliente']['departamento'],
      ).length == 0
    ) {
      errors.push(
        "Departamento '" +
        data['cliente']['departamento'] +
        "' del Cliente en data.cliente.departamento no encontrado. Valores: " +
        departamentos.map((a) => a.codigo + '-' + a.descripcion),
      );
    }

    //console.log("distrito", data['cliente']['distrito'], "ciudad", data['cliente']['ciudad'], "departamento", data['cliente']['departamento']);
    validateDepartamentoDistritoCiudad(
      'data.cliente',
      +data['cliente']['departamento'],
      +data['cliente']['distrito'],
      +data['cliente']['ciudad'],
      errors,
    );
  }

  if (data['cliente']['tipoOperacion'] == 4) {
    if (data['cliente']['pais'] == 'PRY') {
      errors.push('El tipo de Operación = 4-B2F requiere un pais diferente a PRY');
    }
  }

  if (data['cliente']['telefono']) {
    if (!(data['cliente']['telefono'].length >= 6 && data['cliente']['telefono'].length <= 15)) {
      errors.push(
        "El valor '" +
        data['cliente']['telefono'] +
        "' en data.cliente.telefono debe tener una longitud de 6 a 15 caracteres",
      );
    } else {
      if (
        (data['cliente']['telefono'] + '').includes('(') ||
        (data['cliente']['telefono'] + '').includes(')') ||
        (data['cliente']['telefono'] + '').includes('[') ||
        (data['cliente']['telefono'] + '').includes(']')
      ) {
        /*this.errors.push(
          "El valor '" + data['cliente']['telefono'] + "' en data.cliente.telefono no puede contener () o []",
        );*/
        //Finalmente no da error en la SET por esto
      }
    }
  }

  if (data['cliente']['celular']) {
    if (!(data['cliente']['celular'].length >= 10 && data['cliente']['celular'].length <= 20)) {
      errors.push(
        "El valor '" +
        data['cliente']['celular'] +
        "' en data.cliente.celular debe tener una longitud de 10 a 20 caracteres",
      );
    } else {
      if (
        (data['cliente']['celular'] + '').includes('(') ||
        (data['cliente']['celular'] + '').includes(')') ||
        (data['cliente']['celular'] + '').includes('[') ||
        (data['cliente']['celular'] + '').includes(']')
      ) {
        errors.push(
          "El valor '" + data['cliente']['celular'] + "' en data.cliente.celular no puede contener () o []",
        );
      }
    }
  }

  if (data['cliente']['email']) {
    let email = new String(data['cliente']['email']); //Hace una copia, para no alterar.

    //Verificar si tiene varios correos.
    if (email.indexOf(',') > -1) {
      //Si el Email tiene , (coma) entonces va enviar solo el primer valor, ya que la SET no acepta Comas
      email = email.split(',')[0].trim();
    }

    //Verificar espacios
    if (email.indexOf(' ') > -1) {
      errors.push("El valor '" + email + "' en data.cliente.email no puede poseer espacios");
    }

    if (!(email.length >= 3 && email.length <= 80)) {
      errors.push("El valor '" + email + "' en data.cliente.email debe tener una longitud de 3 a 80 caracteres");
    }

    //se valida el mail
    var regExEmail = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm);
    if (!regExEmail.test(email + '')) {
      errors.push("El valor '" + email + "' en data.cliente.email es inválido");
    }
  }

  if (data['cliente']['codigo']) {
    if (!((data['cliente']['codigo'] + '').length >= 3 && (data['cliente']['codigo'] + '').length <= 15)) {
      errors.push(
        "El código del Cliente '" +
        data['cliente']['codigo'] +
        "' en data.cliente.codigo debe tener de 3 a 15 caracteres",
      );
    }
  }
}

const generateDatosEspecificosPorTipoDEValidate = (params, data) => {
  if (data['tipoDocumento'] === 1) {
    generateDatosEspecificosPorTipoDE_FacturaElectronicaValidate(data);
  }
  if (data['tipoDocumento'] === 4) {
    generateDatosEspecificosPorTipoDE_AutofacturaValidate(data);
  }

  if (data['tipoDocumento'] === 5 || data['tipoDocumento'] === 6) {
    generateDatosEspecificosPorTipoDE_NotaCreditoDebitoValidate(params, data);
  }

  if (data['tipoDocumento'] === 7) {
    generateDatosEspecificosPorTipoDE_RemisionElectronicaValidate(params, data);
  }
}

const generateDatosEspecificosPorTipoDE_FacturaElectronicaValidate = (data) => {
  if (!data['factura']) {
    errors.push('Debe indicar los datos especificos de la Factura en data.factura');
    return; // Termina el metodos
  }

  if (
    indicadoresPresencias.filter((um) => um.codigo === +data['factura']['presencia']).length ==
    0
  ) {
    errors.push(
      "Indicador de Presencia '" +
      data['factura']['presencia'] +
      "' en data.factura.presencia no encontrado. Valores: " +
      indicadoresPresencias.map((a) => a.codigo + '-' + a.descripcion),
    );
  }

  if (data['factura']['fechaEnvio']) {
    let fechaFactura = new Date(data['fecha']);
    let fechaEnvio = new Date(data['factura']['fechaEnvio']);

    if (fechaFactura.getTime() > fechaEnvio.getTime()) {
      errors.push(
        "La Fecha de envío '" +
        data['factura']['fechaEnvio'] +
        "'en data.factura.fechaEnvio, debe ser despues de la fecha de Factura",
      );
    }
  }

  if (data['cliente']['tipoOperacion'] === 3) {
    generateDatosEspecificosPorTipoDE_ComprasPublicasValidate(data);
  }
}

const generateDatosEspecificosPorTipoDE_ComprasPublicasValidate = (data) => {
  if (!(data['dncp'] && data['dncp']['modalidad'] && (data['dncp']['modalidad'] + '').length == 2)) {
    errors.push('Debe informar la modalidad de Contratación DNCP  (2 digitos) en data.dncp.modalidad');
  }
  /*    if (!(data['dncp'] && data['dncp']['entidad'] && data['dncp']['entidad'].length > 0)) {
   errors.push('Debe informar la entidad de Contratación DNCP en data.dncp.entidad');
  }*/
  if (
    !(data['dncp'] && data['dncp']['entidad'] && +data['dncp']['entidad'] > 9999 && +data['dncp']['entidad'] < 100000)
  ) {
    errors.push('Debe informar la entidad de Contratación DNCP (5 digitos) en data.dncp.entidad');
  }
  /*if (!(data['dncp'] && data['dncp']['año'] && data['dncp']['año'].length > 0)) {
   errors.push('Debe informar el año de Contratación DNCP en data.dncp.año');
  }*/
  if (!(data['dncp'] && data['dncp']['año'] && +data['dncp']['año'] > 0 && +data['dncp']['año'] < 100)) {
    errors.push('Debe informar el año de Contratación DNCP (2 digitos) en data.dncp.año');
  }
  /*if (!(data['dncp'] && data['dncp']['secuencia'] && data['dncp']['secuencia'].length > 0)) {
   errors.push('Debe informar la secuencia de Contratación DNCP en data.dncp.secuencia');
  }*/
  if (
    !(
      data['dncp'] &&
      data['dncp']['secuencia'] &&
      +data['dncp']['secuencia'] > 999999 &&
      +data['dncp']['secuencia'] < 10000000
    )
  ) {
    errors.push('Debe informar la secuencia de Contratación DNCP (7 digitos) en data.dncp.secuencia');
  }

  if (!(data['dncp'] && data['dncp']['fecha'] && (data['dncp']['fecha'] + '').length > 0)) {
    errors.push('Debe informar la fecha de emisión de código de Contratación DNCP en data.dncp.fecha');
  } else {
    if (!isIsoDate(data['dncp']['fecha'])) {
      errors.push(
        "Fecha DNCP '" + data['dncp']['fecha'] + "' en data.dncp.fecha no válida. Formato: yyyy-MM-dd",
      );
    }
  }
}

const generateDatosEspecificosPorTipoDE_AutofacturaValidate = (data) => {
  if (!data['autoFactura']) {
    errors.push('Para tipoDocumento = 4 debe proveer los datos de Autofactura en data.autoFactura');
  }
  if (!data['autoFactura']['ubicacion']) {
    errors.push(
      'Para tipoDocumento = 4 debe proveer los datos del Lugar de Transacción de la Autofactura en data.autoFactura.ubicacion',
    );
  }

  if (!data['autoFactura']['tipoVendedor']) {
    errors.push('Debe especificar la Naturaleza del Vendedor en data.autoFactura.tipoVendedor');
  }

  if (!data['autoFactura']['documentoTipo']) {
    errors.push('Debe especificar el Tipo de Documento del Vendedor en data.autoFactura.documentoTipo');
  }

  if (
    naturalezaVendedorAutofactura.filter(
      (um) => um.codigo === data['autoFactura']['tipoVendedor'],
    ).length == 0
  ) {
    errors.push(
      "Tipo de Vendedor '" +
      data['autoFactura']['tipoVendedor'] +
      "' en data.autoFactura.tipoVendedor no encontrado. Valores: " +
      naturalezaVendedorAutofactura.map((a) => a.codigo + '-' + a.descripcion),
    );
  }

  if (
    tiposDocumentosIdentidades.filter(
      (um) => um.codigo === data['autoFactura']['documentoTipo'],
    ).length == 0
  ) {
    errors.push(
      "Tipo de Documento '" +
      data['autoFactura']['documentoTipo'] +
      "' en data.autoFactura.documentoTipo no encontrado. Valores: " +
      tiposDocumentosIdentidades.map((a) => a.codigo + '-' + a.descripcion),
    );
  }

  if (!data['autoFactura']['ubicacion']) {
    errors.push('Debe especificar la ubicación de la transacción en data.autoFactura.ubicacion');
  }

  if (!data['autoFactura']['documentoNumero']) {
    errors.push('Debe especificar el Nro. de Documento del Vendedor en data.autoFactura.documentoNumero');
  }
  if (!data['autoFactura']['nombre']) {
    errors.push('Debe especificar el Nombre del Vendedor en data.autoFactura.nombre');
  }
  if (!data['autoFactura']['direccion']) {
    errors.push('Debe especificar la Dirección del Vendedor en data.autoFactura.direccion');
  }
  if (!data['autoFactura']['numeroCasa']) {
    errors.push('Debe especificar el Número de Casa del Vendedor en data.autoFactura.numeroCasa');
  }

  let errorDepDisCiu = false;
  let errorDepDisCiuUbi = false;

  if (!data['autoFactura']['ciudad']) {
    errors.push('Debe especificar la Ciudad del Vendedor en data.autoFactura.ciudad');
    errorDepDisCiu = true;
  } else {
    if (
      ciudades.filter((ciudad) => ciudad.codigo === +data['autoFactura']['ciudad']).length == 0
    ) {
      errors.push(
        "Ciudad '" +
        data['autoFactura']['ciudad'] +
        "' del Cliente en data.autoFactura.ciudad no encontrado. Valores: " +
        ciudades.map((a) => a.codigo + '-' + a.descripcion),
      );
      errorDepDisCiu = true;
    }

    //De acuerdo a la Ciudad pasada como parametro, buscar el distrito y departamento y asignar dichos
    //valores de forma predeterminada, aunque este valor sera sobre-escrito caso el usuario envie
    //data['autoFactura']['ciudad']['distrito'] y data['autoFactura']['ciudad']['departamento']
    let objCiudad = ciudades.filter((ciu) => ciu.codigo === +data['autoFactura']['ciudad']);

    if (objCiudad && objCiudad[0]) {
      let objDistrito = distritos.filter((dis) => dis.codigo === +objCiudad[0]['distrito']);

      let objDepartamento = departamentos.filter(
        (dep) => dep.codigo === +objDistrito[0]['departamento'],
      );

      //Solo actualiza si no tiene valor
      if (!data['autoFactura']['distrito']) data['autoFactura']['distrito'] = objDistrito[0]['codigo'];

      if (!data['autoFactura']['departamento']) data['autoFactura']['departamento'] = objDepartamento[0]['codigo'];
    }

    if (errorDepDisCiu) {
      if (!data['autoFactura']['departamento']) {
        errors.push('Debe especificar el Departamento del Vendedor en data.autoFactura.departamento');
        errorDepDisCiu = true;
      }
      if (!data['autoFactura']['distrito']) {
        errors.push('Debe especificar el Distrito Vendedor en data.autoFactura.distrito');
        errorDepDisCiu = true;
      }
    }
  }

  if (!data['autoFactura']['ubicacion']['ciudad']) {
    errors.push('Debe especificar la Ciudad del Lugar de la Transacción en data.autoFactura.ubicacion.ciudad');
    errorDepDisCiuUbi = true;
  } else {
    if (
      ciudades.filter((ciudad) => ciudad.codigo === +data['autoFactura']['ubicacion']['ciudad'])
        .length == 0
    ) {
      errors.push(
        "Ciudad '" +
        data['autoFactura']['ubicacion']['ciudad'] +
        "' del Cliente en data.autoFactura.ubicacion.ciudad no encontrado. Valores: " +
        ciudades.map((a) => a.codigo + '-' + a.descripcion),
      );
      errorDepDisCiuUbi = true;
    }

    //De acuerdo a la Ciudad pasada como parametro, buscar el distrito y departamento y asignar dichos
    //valores de forma predeterminada, aunque este valor sera sobre-escrito caso el usuario envie
    //data['autoFactura']['ubicacion']['ciudad']['distrito'] y data['autoFactura']['ubicacion']['ciudad']['departamento']
    let objCiudad = ciudades.filter(
      (ciu) => ciu.codigo === +data['autoFactura']['ubicacion']['ciudad'],
    );

    if (objCiudad && objCiudad[0]) {
      let objDistrito = distritos.filter((dis) => dis.codigo === +objCiudad[0]['distrito']);

      let objDepartamento = departamentos.filter(
        (dep) => dep.codigo === +objDistrito[0]['departamento'],
      );

      //Solo actualiza si no tiene valor
      if (!data['autoFactura']['ubicacion']['distrito'])
        data['autoFactura']['ubicacion']['distrito'] = objDistrito[0]['codigo'];

      if (!data['autoFactura']['ubicacion']['departamento'])
        data['autoFactura']['ubicacion']['departamento'] = objDepartamento[0]['codigo'];
    }

    if (errorDepDisCiuUbi) {
      if (!data['autoFactura']['ubicacion']['departamento']) {
        errors.push(
          'Debe especificar el Departamento del Lugar de la Transacción en data.autoFactura.ubicacion.departamento',
        );
        errorDepDisCiuUbi = true;
      }
      if (!data['autoFactura']['ubicacion']['distrito']) {
        errors.push(
          'Debe especificar el Distrito del Lugar de la Transacciónen data.autoFactura.ubicacion.distrito',
        );
        errorDepDisCiuUbi = true;
      }
    }
  }

  if (errorDepDisCiu) {
    validateDepartamentoDistritoCiudad(
      'data.autoFactura',
      +data['autoFactura']['departamento'],
      +data['autoFactura']['distrito'],
      +data['autoFactura']['ciudad'],
      errors,
    );
  }

  if (errorDepDisCiuUbi) {
    validateDepartamentoDistritoCiudad(
      'data.autoFactura.ubicacion',
      +data['autoFactura']['ubicacion']['departamento'],
      +data['autoFactura']['ubicacion']['distrito'],
      +data['autoFactura']['ubicacion']['ciudad'],
      errors,
    );
  }
}

const generateDatosEspecificosPorTipoDE_NotaCreditoDebitoValidate = (data) => {
  if (!(data['notaCreditoDebito']['motivo'] && data['notaCreditoDebito']['motivo'])) {
    errors.push('Debe completar el motivo para la nota de crédito/débito en data.notaCreditoDebito.motivo');
  } else {
    if (
      notasCreditosMotivos.filter((um) => um.codigo === +data['notaCreditoDebito']['motivo'])
        .length == 0
    ) {
      errors.push(
        "Motivo de la Nota de Crédito/Débito '" +
        data['notaCreditoDebito']['motivo'] +
        "' en data.notaCreditoDebito.motivo no encontrado. Valores: " +
        notasCreditosMotivos.map((a) => a.codigo + '-' + a.descripcion),
      );
    }
  }
}

const generateDatosEspecificosPorTipoDE_RemisionElectronicaValidate = (params, data) => {
  if (!(data['remision'] && data['remision']['motivo'])) {
    errors.push('No fue pasado el Motivo de la Remisión en data.remision.motivo.');
  } else {
    if (+data['remision']['motivo'] == 99) {
      if (!(data['remision'] && data['remision']['motivoDescripcion'])) {
        errors.push(
          'Debe especificar la Descripción el Motivo de la Remisión en data.remision.motivoDescripcion para el motivo=99.',
        );
      }
    }
  }

  if (!(data['remision'] && data['remision']['tipoResponsable'])) {
    errors.push('No fue pasado el Tipo de Responsable de la Remisión en data.remision.tipoResponsable.');
  }

  if (remisionesMotivos.filter((um) => um.codigo === +data['remision']['motivo']).length == 0) {
    errors.push(
      "Motivo de la Remisión '" +
      data['remision']['motivo'] +
      "' en data.remision.motivo no encontrado. Valores: " +
      remisionesMotivos.map((a) => a.codigo + '-' + a.descripcion),
    );
  }

  if (!data['remision']['kms']) {
    //analizar por que se puso
    errors.push('Debe especificar Kilometros estimado recorrido en data.remision.kms');
  }

  if (data['remision'] && data['remision']['motivo'] == 7) {
    //Motivo=7-Translado entre locales
    if (data['cliente']['ruc'] != params['ruc']) {
      errors.push('RUC del receptor debe coincidir con el RUC del emisor');
    }
  }

  if (
    remisionesResponsables.filter((um) => um.codigo === data['remision']['tipoResponsable'])
      .length == 0
  ) {
    errors.push(
      "Tipo de Responsable '" +
      data['remision']['tipoResponsable'] +
      "' en data.remision.tipoResponsable no encontrado. Valores: " +
      remisionesResponsables.map((a) => a.codigo + '-' + a.descripcion),
    );
  }
}

const generateDatosAutofacturaValidate = (data) => {
  if (!data['autoFactura']) {
    errors.push('Debe especificar los datos de Autofactura en data.autoFactura para el Tipo de Documento = 4');
    return;
  }

  if (!data['autoFactura']['documentoNumero']) {
    errors.push(
      'Debe especificar el Documento del Vendedor para la AutoFactura en data.autoFactura.documentoNumero',
    );
  } else {
    if (
      !(
        (data['autoFactura']['documentoNumero'] + '').length >= 1 &&
        (data['autoFactura']['documentoNumero'] + '').length <= 20
      )
    ) {
      errors.push(
        'El Numero de Documento del Vendedor en data.autoFactura.numeroDocuemnto debe contener entre 1 y 20 caracteres ',
      );
    }

    if (
      new RegExp(/[a-zA-Z]/g).test(data['autoFactura']['documentoNumero']) ||
      new RegExp(/\./g).test(data['autoFactura']['documentoNumero'])
    ) {
      errors.push(
        'El Numero de Documento del Vendedor "' +
        data['autoFactura']['documentoNumero'] +
        '" en data.autoFactura.numeroDocuemnto no puede contener Letras ni puntos',
      );
    }
  }

  if (!data['documentoAsociado']) {
    errors.push('Debe indicar el Documento Asociado en data.documentoAsociado para el Tipo de Documento = 4');
  } else {
    if (Array.isArray(data['documentoAsociado'])) {
      validateAsociadoConstancia(data['documentoAsociado'][0], true);
    } else {
      validateAsociadoConstancia(data['documentoAsociado'], false);
    }

    if (data['cliente']['contribuyente'] == false) {
      errors.push('El Cliente de una Autofactura debe ser Contribuyente en data.cliente.contribuyente');
    }
  }
}

const validateAsociadoConstancia = (documentoAsociado, isArray) => {
  if (!(documentoAsociado['constanciaControl'] && documentoAsociado['constanciaControl'].length > 0)) {
    errors.push(
      'Debe indicar el Número de Control de la Constancia en data.documentoAsociado.constanciaControl. ' +
      (isArray ? 'En la posicion 0' : ''),
    );
  } else {
    if ((documentoAsociado['constanciaControl'] + '').length != 8) {
      errors.push(
        'El Numero de Control de la Constancia "' +
        documentoAsociado['constanciaControl'] +
        '" en data.documentoAsociado.constanciaControl debe contener 8 caracteres. ' +
        (isArray ? 'En la posicion 0' : ''),
      );
    }
  }

  if (!(documentoAsociado['constanciaNumero'] && (documentoAsociado['constanciaNumero'] + '').length > 0)) {
    errors.push(
      'Debe indicar el Numero de la Constancia en data.documentoAsociado.constanciaNumero. ' +
      (isArray ? 'En la posicion 0' : ''),
    );
  } else {
    if (isNaN(documentoAsociado['constanciaNumero'])) {
      errors.push(
        'El Numero de la Constancia "' +
        documentoAsociado['constanciaNumero'] +
        '" en data.documentoAsociado.constanciaNumero debe ser numérico. ' +
        (isArray ? 'En la posicion 0' : ''),
      );
    }
    if ((documentoAsociado['constanciaNumero'] + '').length != 11) {
      errors.push(
        'El Numero de la Constancia "' +
        documentoAsociado['constanciaNumero'] +
        '" en data.documentoAsociado.constanciaNumero debe contener 11 caracteres. ' +
        (isArray ? 'En la posicion 0' : ''),
      );
    }
  }
}
const generateDatosCondicionOperacionDEValidate = (data) => {
  const items = data['items'];
  let sumaSubtotales = 0;

  if (true) {
    if (!data['condicion']) {
      errors.push('Debe indicar los datos de la Condición de la Operación en data.condicion');
      return; // sale metodo
    } else {
      if (
        condicionesOperaciones.filter((um) => um.codigo === data['condicion']['tipo']).length ==
        0
      ) {
        errors.push(
          "Condición de la Operación '" +
          data['condicion']['tipo'] +
          "' en data.condicion.tipo no encontrado. Valores: " +
          condicionesOperaciones.map((a) => a.codigo + '-' + a.descripcion),
        );
      }

      generateDatosCondicionOperacionDE_ContadoValidate(data);

      if (data['condicion']['tipo'] === 2) {
        generateDatosCondicionOperacionDE_CreditoValidate(data);
      }
    }
  }
}


const generateDatosCondicionOperacionDE_ContadoValidate = (data) => {
  if (data['condicion']['tipo'] === 1) {
    if (!(data['condicion']['entregas'] && data['condicion']['entregas'].length > 0)) {
      errors.push(
        'El Tipo de Condición es 1 en data.condicion.tipo pero no se encontraron entregas en data.condicion.entregas',
      );
    }
  }

  if (data['condicion']['entregas'] && data['condicion']['entregas'].length > 0) {
    for (let i = 0; i < data['condicion']['entregas'].length; i++) {
      const dataEntrega = data['condicion']['entregas'][i];

      if (condicionesTiposPagos.filter((um) => um.codigo === dataEntrega['tipo']).length == 0) {
        errors.push(
          "Condición de Tipo de Pago '" +
          dataEntrega['tipo'] +
          "' en data.condicion.entregas[" +
          i +
          '].tipo no encontrado. Valores: ' +
          condicionesTiposPagos.map((a) => a.codigo + '-' + a.descripcion),
        );
      }

      if (dataEntrega['tipo'] == 99 && !dataEntrega['tipoDescripcion']) {
        errors.push(
          'Es obligatorio especificar la Descripción en data.condicion.entregas[' +
          i +
          '].tipoDescripcion para el tipo=99',
        );
      } else if (dataEntrega['tipo'] == 99) {
        if (
          !((dataEntrega['tipoDescripcion'] + '').length >= 4 && (dataEntrega['tipoDescripcion'] + '').length <= 30)
        ) {
          errors.push(
            'La Descripción del Tipo de Entrega en data.condicion.entregas[' +
            i +
            '].tipoDescripcion debe tener de 4 a 30 caracteres, para el tipo=99',
          );
        }
      }

      if (!dataEntrega['moneda']) {
        errors.push('Moneda es obligatorio en data.condicion.entregas[' + i + '].moneda');
      }

      if (monedas.filter((um) => um.codigo === dataEntrega['moneda']).length == 0) {
        errors.push("Moneda '" + dataEntrega['moneda']) +
          "' data.condicion.entregas[" +
          i +
          '].moneda no válido. Valores: ' +
          monedas.map((a) => a.codigo + '-' + a.descripcion);
      }

      //Verificar si el Pago es con Tarjeta de crédito
      if (dataEntrega['tipo'] === 3 || dataEntrega['tipo'] === 4) {
        if (!dataEntrega['infoTarjeta']) {
          errors.push(
            'Debe informar los datos de la tarjeta en data.condicion.entregas[' +
            i +
            '].infoTarjeta si la forma de Pago es a Tarjeta',
          );
        } else {
          if (!dataEntrega['infoTarjeta']['tipo']) {
            errors.push(
              'Debe especificar el tipo de tarjeta en data.condicion.entregas[' +
              i +
              '].infoTarjeta.tipo si la forma de Pago es a Tarjeta',
            );
          } else {
            if (
              tarjetasCreditosTipos.filter(
                (um) => um.codigo === dataEntrega['infoTarjeta']['tipo'],
              ).length == 0
            ) {
              errors.push(
                "Tipo de Tarjeta '" +
                dataEntrega['infoTarjeta']['tipo'] +
                "' en data.condicion.entregas[" +
                i +
                '].infoTarjeta.tipo no encontrado. Valores: ' +
                tarjetasCreditosTipos.map((a) => a.codigo + '-' + a.descripcion),
              );
            }

            if (dataEntrega['infoTarjeta']['tipoDescripcion']) {
              if (
                !(
                  (dataEntrega['infoTarjeta']['tipoDescripcion'] + '').length >= 4 &&
                  (dataEntrega['infoTarjeta']['tipoDescripcion'] + '').length <= 20
                )
              ) {
                errors.push(
                  'La descripción del Tipo de Tarjeta en data.condicion.entregas[' +
                  i +
                  '].infoTarjeta.tipoDescripcion debe tener de 4 a 20 caracteres',
                );
              }
            }
          }

          if (dataEntrega['infoTarjeta']['ruc']) {
            if (dataEntrega['infoTarjeta']['ruc'].indexOf('-') == -1) {
              errors.push(
                'RUC de Proveedor de Tarjeta debe contener digito verificador en data.condicion.entregas[' +
                i +
                '].infoTarjeta.ruc',
              );
            }

            var regExpOnlyNumber = new RegExp(/^\d+$/);
            const rucCliente = dataEntrega['infoTarjeta']['ruc'].split('-');

            //Un RUC puede ser alphanumerico
            /*if (!regExpOnlyNumber.test((rucCliente[0] + '').trim())) {
             errors.push(
                "La parte del RUC del Cliente '" +
                  dataEntrega['infoTarjeta']['ruc'] +
                  "' en data.condicion.entregas[" +
                  i +
                  '].infoTarjeta.ruc debe ser numérico',
              );
            }*/
            if (!regExpOnlyNumber.test((rucCliente[1] + '').trim())) {
              errors.push(
                "La parte del DV del RUC del Cliente '" +
                dataEntrega['infoTarjeta']['ruc'] +
                "' en data.condicion.entregas[" +
                i +
                '].infoTarjeta.ruc debe ser numérico',
              );
            }

            if (!(rucCliente[0].length >= 3 && rucCliente[0].length <= 8)) {
              errors.push(
                "La parte del RUC '" +
                dataEntrega['infoTarjeta']['ruc'] +
                "' en data.condicion.entregas[" +
                i +
                '].infoTarjeta.ruc debe contener de 1 a 8 caracteres',
              );
            }

            if (rucCliente[1] > 9) {
              errors.push(
                "La parte del DV del RUC '" +
                dataEntrega['infoTarjeta']['ruc'] +
                "' en data.condicion.entregas[" +
                i +
                '].infoTarjeta.ruc debe ser del 1 al 9',
              );
            }
          }

          if (dataEntrega['infoTarjeta']['codigoAutorizacion']) {
            if (
              !(
                (dataEntrega['infoTarjeta']['codigoAutorizacion'] + '').length >= 6 &&
                (dataEntrega['infoTarjeta']['codigoAutorizacion'] + '').length <= 10
              )
            ) {
              errors.push(
                'El código de Autorización en data.condicion.entregas[' +
                i +
                '].infoTarjeta.codigoAutorizacion debe tener de 6 y 10 caracteres',
              );
            }
          }

          if (dataEntrega['infoTarjeta']['titular']) {
            if (
              !(
                (dataEntrega['infoTarjeta']['titular'] + '').length >= 4 &&
                (dataEntrega['infoTarjeta']['titular'] + '').length <= 30
              )
            ) {
              errors.push(
                'El Titular de la Tarjeta en data.condicion.entregas[' +
                i +
                '].infoTarjeta.titular debe tener de 4 y 30 caracteres',
              );
            }
            //Validar que titular no tenga .
            if (dataEntrega['infoTarjeta']['titular'].indexOf('.') > -1) {
              errors.push(
                'El valor "' +
                dataEntrega['infoTarjeta']['titular'] +
                '" en data.condicion.entregas[' +
                i +
                '].infoTarjeta.titular no es válido ',
              );
            }
            //Validar que titular no tenga /
            if (dataEntrega['infoTarjeta']['titular'].indexOf('/') > -1) {
              errors.push(
                'El valor "' +
                dataEntrega['infoTarjeta']['titular'] +
                '" en data.condicion.entregas[' +
                i +
                '].infoTarjeta.titular no es válido ',
              );
            }
          }

          if (dataEntrega['infoTarjeta']['numero']) {
            if (!((dataEntrega['infoTarjeta']['numero'] + '').length == 4)) {
              errors.push(
                'El código de Autorización en data.condicion.entregas[' +
                i +
                '].infoTarjeta.numero debe tener de 4 caracteres',
              );
            }
          }
        }
      }

      //Verificar si el Pago es con Cheque
      if (dataEntrega['tipo'] === 2) {
        if (!dataEntrega['infoCheque']) {
          errors.push(
            'Debe informar sobre el cheque en data.condicion.entregas[' +
            i +
            '].infoCheque si la forma de Pago es 2-Cheques',
          );
        }
      }

      if (dataEntrega['moneda'] !== 'PYG') {
        if (!dataEntrega['cambio']) {
          errors.push(
            'Debe informar la cotizacion del monto de la Entrega en data.condicion.entregas[' +
            i +
            '].cambio si la forma de Pago es diferente a PYG',
          );
        }
      }
    }
  }
}


const generateDatosCondicionOperacionDE_CreditoValidate = (data) => {
  if (!data['condicion']['credito']) {
    errors.push(
      'Fue especificado Condicion Tipo 2 (Crédito) pero el detalle de Crédito en data.condicion.credito es nulo',
    );
  } else {
    if (!data['condicion']['credito']['tipo']) {
      errors.push(
        'El tipo de Crédito en data.condicion.credito.tipo es obligatorio si la condición posee créditos',
      );
    } else {
      if (
        condicionesCreditosTipos.filter(
          (um) => um.codigo === data['condicion']['credito']['tipo'],
        ).length == 0
      ) {
        errors.push(
          "Tipo de Crédito '" +
          data['condicion']['credito']['tipo'] +
          "' en data.condicion.credito.tipo no encontrado. Valores: " +
          condicionesCreditosTipos.map((a) => a.codigo + '-' + a.descripcion),
        );
      }
    }

    if (+data['condicion']['credito']['tipo'] === 1) {
      //Plazo
      if (!data['condicion']['credito']['plazo']) {
        errors.push(
          'El tipo de Crédito en data.condicion.credito.tipo es 1 entonces data.condicion.credito.plazo es obligatorio',
        );
      } else {
        if (
          !(
            (data['condicion']['credito']['plazo'] + '').length >= 2 &&
            (data['condicion']['credito']['plazo'] + '').length <= 15
          )
        ) {
          errors.push(
            'El Plazo de Crédito en data.condicion.credito.plazo debe contener entre 2 y 15 caracteres ',
          );
        }
      }
    }

    if (+data['condicion']['credito']['tipo'] === 2) {
      //Cuota
      if (!data['condicion']['credito']['cuotas']) {
        errors.push(
          'El tipo de Crédito en data.condicion.credito.tipo es 2 entonces data.condicion.credito.cuotas es obligatorio',
        );
      } else {
      }

      //Si es Cuotas
      //Recorrer array de infoCuotas e informar en el JSON

      if (data['condicion']['credito']['infoCuotas'] && data['condicion']['credito']['infoCuotas'].length > 0) {
        for (let i = 0; i < data['condicion']['credito']['infoCuotas'].length; i++) {
          const infoCuota = data['condicion']['credito']['infoCuotas'][i];

          if (monedas.filter((um) => um.codigo === infoCuota['moneda']).length == 0) {
            errors.push(
              "Moneda '" +
              infoCuota['moneda'] +
              "' en data.condicion.credito.infoCuotas[" +
              i +
              '].moneda no encontrado. Valores: ' +
              monedas.map((a) => a.codigo + '-' + a.descripcion),
            );
          }

          if (!infoCuota['vencimiento']) {
            //No es obligatorio
            //this.errors.push('Obligatorio informar data.transporte.inicioEstimadoTranslado. Formato yyyy-MM-dd');
          } else {
            if (!isIsoDate(infoCuota['vencimiento'])) {
              errors.push(
                "Vencimiento de la Cuota '" +
                infoCuota['vencimiento'] +
                "' en data.condicion.credito.infoCuotas[" +
                i +
                '].vencimiento no válido. Formato: yyyy-MM-dd',
              );
            }
          }
        }
      } else {
        errors.push('Debe proporcionar data.condicion.credito.infoCuotas[]');
      }
    }
  }
}

const generateDatosComplementariosComercialesDeUsoEspecificosValidate = (data) => {
  if (data['sectorEnergiaElectrica']) {
    generateDatosSectorEnergiaElectricaValidate(data);
  }

  if (data['sectorSeguros']) {
    generateDatosSectorSegurosValidate();
  }

  if (data['sectorSupermercados']) {
    generateDatosSectorSupermercadosValidate();
  }

  if (data['sectorAdicional']) {
    generateDatosDatosAdicionalesUsoComercialValidate(data);
  }
}


const generateDatosSectorEnergiaElectricaValidate = (data) => {
  /*const jsonResult = {
    dNroMed: data['sectorEnergiaElectrica']['numeroMedidor'],
    dActiv: data['sectorEnergiaElectrica']['codigoActividad'],
    dCateg: data['sectorEnergiaElectrica']['codigoCategoria'],
    dLecAnt: data['sectorEnergiaElectrica']['lecturaAnterior'],
    dLecAct: data['sectorEnergiaElectrica']['lecturaActual'],
    dConKwh: data['sectorEnergiaElectrica']['lecturaActual'] - data['sectorEnergiaElectrica']['lecturaAnterior'],
  };*/

  if (data['sectorEnergiaElectrica']['lecturaAnterior'] > data['sectorEnergiaElectrica']['lecturaActual']) {
    errors.push('Sector Energia Electrica lecturaActual debe ser mayor a lecturaAnterior');
  }
}


const generateDatosSectorSegurosValidate = () => {

}


const generateDatosSectorSupermercadosValidate = () => {

}

const generateDatosDatosAdicionalesUsoComercialValidate = (data) => {
  /*const jsonResult = {
    dCiclo: data['sectorAdicional']['ciclo'].substring(0, 15),
    dFecIniC: data['sectorAdicional']['inicioCiclo'],
    dFecFinC: data['sectorAdicional']['finCiclo'],
    dVencPag: data['sectorAdicional']['vencimientoPago'],
    dContrato: data['sectorAdicional']['numeroContrato'],
    dSalAnt: data['sectorAdicional']['saldoAnterior'],
  };*/

  if (data['sectorAdicional']['ciclo']) {
    if (
      !((data['sectorAdicional']['ciclo'] + '').length >= 1 && (data['sectorAdicional']['ciclo'] + '').length <= 15)
    ) {
      errors.push('El Ciclo en data.sectorAdicional.ciclo debe contener entre 1 y 15 caracteres ');
    }
  }

  if (data['sectorAdicional']['inicioCiclo']) {
    if (!((data['sectorAdicional']['inicioCiclo'] + '').length == 10)) {
      errors.push('El Inicio de Ciclo en data.sectorAdicional.inicioCiclo debe contener 10 caracteres ');
    }
  }

  if (data['sectorAdicional']['finCiclo']) {
    if (!((data['sectorAdicional']['finCiclo'] + '').length == 10)) {
      errors.push('El Fin de Ciclo en data.sectorAdicional.finCiclo debe contener 10 caracteres ');
    }
  }

  if (data['sectorAdicional']['vencimientoPago']) {
    if (!((data['sectorAdicional']['vencimientoPago'] + '').length == 10)) {
      errors.push('La fecha de Pago en data.sectorAdicional.vencimientoPago debe contener 10 caracteres ');
    }

    let fecha = new Date(data.fecha);
    let fechaPago = new Date(data['sectorAdicional']['vencimientoPago']);
    if (fecha.getTime() > fechaPago.getTime()) {
      errors.push(
        "La fecha de pago '" +
        data['sectorAdicional']['vencimientoPago'] +
        "' en data.sectorAdicional.vencimientoPago debe ser despues de la Fecha del Documento",
      );
    }
  }

  if (data['sectorAdicional']['numeroContrato']) {
    if (
      !(
        (data['sectorAdicional']['numeroContrato'] + '').length >= 1 &&
        (data['sectorAdicional']['numeroContrato'] + '').length <= 30
      )
    ) {
      errors.push(
        'El numero de Contrato en data.sectorAdicional.numeroContrato debe contener entre 1 y 30 caracteres ',
      );
    }
  }

  if (data['sectorAdicional']['saldoAnterior']) {
    /*if ( ! ( (data['sectorAdicional']['saldoAnterior']+"").length >= 1 && (data['sectorAdicional']['saldoAnterior']+"").length <= 30 ) ) {
     errors.push("El numero de Contrato en data.sectorAdicional.saldoAnterior debe contener entre 1 y 30 caracteres ");        
    }*/
  }
}


const generateDatosTransporteValidate = (data) => {
  if (data['tipoDocumento'] == 7) {
    if (!(data['detalleTransporte'] && data['detalleTransporte']['tipo'] && data['detalleTransporte']['tipo'] > 0)) {
      errors.push('Obligatorio informar transporte.tipo');
    }
  }
  if (data['detalleTransporte'] && data['detalleTransporte']['condicionNegociacion']) {
    if (condicionesNegociaciones.indexOf(data['detalleTransporte']['condicionNegociacion']) < -1) {
      errors.push(
        'detalleTransporte.condicionNegociación (' +
        data['detalleTransporte']['condicionNegociacion'] +
        ') no válido',
      );
    }
  }
  if (data['tipoDocumento'] == 7) {
    if (!data['detalleTransporte']['inicioEstimadoTranslado']) {
      errors.push('Obligatorio informar data.transporte.inicioEstimadoTranslado. Formato yyyy-MM-dd');
    } else {
      if (!isIsoDate(data['detalleTransporte']['inicioEstimadoTranslado'])) {
        errors.push(
          "Valor de la Fecha '" +
          data['detalleTransporte']['inicioEstimadoTranslado'] +
          "' en data.transporte.inicioEstimadoTranslado no válido. Formato: yyyy-MM-dd",
        );
      }
    }
  }
  if (data['tipoDocumento'] == 7) {
    if (!data['detalleTransporte']['finEstimadoTranslado']) {
      errors.push('Obligatorio informar data.transporte.finEstimadoTranslado. Formato yyyy-MM-dd');
    } else {
      if (!isIsoDate(data['detalleTransporte']['finEstimadoTranslado'])) {
        errors.push(
          "Valor de la Fecha '" +
          data['detalleTransporte']['finEstimadoTranslado'] +
          "' en data.transporte.finEstimadoTranslado no válido. Formato: yyyy-MM-dd",
        );
      }
    }
  }

  if (data['tipoDocumento'] == 7) {
    if (data['detalleTransporte']['inicioEstimadoTranslado'] && data['detalleTransporte']['finEstimadoTranslado']) {
      let fechaInicio = new Date(data['detalleTransporte']['inicioEstimadoTranslado']);
      let fechaFin = new Date(data['detalleTransporte']['finEstimadoTranslado']);

      let fechaHoy = new Date(new Date().toISOString().slice(0, -14));
      fechaHoy.setHours(0);
      fechaHoy.setMinutes(0);
      fechaHoy.setSeconds(0);
      fechaHoy.setMilliseconds(0);
    }
  }

  if (tiposTransportes.filter((um) => um.codigo === data['detalleTransporte']['tipo']).length == 0) {
    errors.push(
      "Tipo de Transporte '" +
      data['detalleTransporte']['tipo'] +
      "' en data.transporte.tipo no encontrado. Valores: " +
      tiposTransportes.map((a) => a.codigo + '-' + a.descripcion),
    );
  }
  if (
    modalidadesTransportes.filter((um) => um.codigo === data['detalleTransporte']['modalidad'])
      .length == 0
  ) {
    errors.push(
      "Modalidad de Transporte '" +
      data['detalleTransporte']['modalidad'] +
      "' en data.transporte.modalidad no encontrado. Valores: " +
      modalidadesTransportes.map((a) => a.codigo + '-' + a.descripcion),
    );
  }

  if (data['detalleTransporte']['salida']) {
    generateDatosSalidaValidate(data);
  }
  if (data['detalleTransporte']['entrega']) {
    generateDatosEntregaValidate(data);
  }
  if (data['detalleTransporte']['vehiculo']) {
    generateDatosVehiculoValidate(data);
  }
  if (data['detalleTransporte']['transportista']) {
    generateDatosTransportistaValidate(data);
  }
}


const generateDatosSalidaValidate = (data) => {
  var regExpOnlyNumber = new RegExp(/^\d+$/);

  let errorDepDisCiu = false;
  if (!data['detalleTransporte']['salida']['ciudad']) {
    errors.push('Debe especificar la Ciudad del Local de Salida en data.transporte.salida.ciudad');
    errorDepDisCiu = true;
  } else {
    if (
      ciudades.filter(
        (ciudad) => ciudad.codigo === +data['detalleTransporte']['salida']['ciudad'],
      ).length == 0
    ) {
      errors.push(
        "Ciudad '" +
        data['detalleTransporte']['salida']['ciudad'] +
        "' del Cliente en data.transporte.salida.ciudad no encontrado. Valores: " +
        ciudades.map((a) => a.codigo + '-' + a.descripcion),
      );
      errorDepDisCiu = true;
    }

    //De acuerdo a la Ciudad pasada como parametro, buscar el distrito y departamento y asignar dichos
    //valores de forma predeterminada, aunque este valor sera sobre-escrito caso el usuario envie
    //data['detalleTransporte']['salida']['distrito'] y data['detalleTransporte']['salida']['departamento']
    let objCiudad = ciudades.filter(
      (ciu) => ciu.codigo === +data['detalleTransporte']['salida']['ciudad'],
    );

    if (objCiudad && objCiudad[0]) {
      let objDistrito = distritos.filter((dis) => dis.codigo === +objCiudad[0]['distrito']);

      let objDepartamento = departamentos.filter(
        (dep) => dep.codigo === +objDistrito[0]['departamento'],
      );

      //Solo actualiza si no tiene valor
      if (!data['detalleTransporte']['salida']['distrito'])
        data['detalleTransporte']['salida']['distrito'] = objDistrito[0]['codigo'];

      if (!data['detalleTransporte']['salida']['departamento'])
        data['detalleTransporte']['salida']['departamento'] = objDepartamento[0]['codigo'];
    }

    if (!errorDepDisCiu) {
      if (!data['detalleTransporte']['salida']['departamento']) {
        errors.push(
          'Debe especificar el Departamento del Local de Salida en data.transporte.salida.departamento',
        );
        errorDepDisCiu = true;
      }
      if (!data['detalleTransporte']['salida']['distrito']) {
        errors.push('Debe especificar el Distrito del Local de Salida en data.transporte.salida.distrito');
        errorDepDisCiu = true;
      }
    }
  }

  if (!errorDepDisCiu) {
    validateDepartamentoDistritoCiudad(
      'data.transporte.salida',
      +data['detalleTransporte']['salida']['departamento'],
      +data['detalleTransporte']['salida']['distrito'],
      +data['detalleTransporte']['salida']['ciudad'],
      errors,
    );
  }

  if (!data['detalleTransporte']['salida']['direccion']) {
    errors.push('Debe especificar la Dirección del Local de Salida en data.transporte.salida.direccion');
  } else {
    if (
      !(
        data['detalleTransporte']['salida']['direccion'].length >= 1 &&
        data['detalleTransporte']['salida']['direccion'].length <= 255
      )
    ) {
      errors.push(
        "Dirección del Local de Salida '" +
        data['detalleTransporte']['salida']['direccion'] +
        "' en data.transporte.salida.direccion debe tener una longitud de 1 a 255 caracteres",
      );
    }
  }

  if (data['detalleTransporte']['salida']['numeroCasa'] == null) {
    errors.push('Debe especificar el Número de Casa del Local de Salida en data.transporte.salida.numeroCasa');
  } else {
    if (!((data['detalleTransporte']['salida']['numeroCasa'] + '').length > 0)) {
      errors.push('Debe especificar el Número de Casa del Local de Salida en data.transporte.salida.numeroCasa');
    } else {
      if (data['detalleTransporte']['salida']['numeroCasa']) {
        if (!regExpOnlyNumber.test(data['detalleTransporte']['salida']['numeroCasa'])) {
          errors.push('El Número de Casa en data.transporte.salida.numeroCasa debe ser numérico');
        }
      } else {
        if (
          !(
            (data['detalleTransporte']['salida']['numeroCasa'] + '').length >= 1 &&
            (data['detalleTransporte']['salida']['numeroCasa'] + '').length <= 6
          )
        ) {
          errors.push(
            "Número de Casa del Local de Salida '" +
            data['detalleTransporte']['salida']['numeroCasa'] +
            "' en data.transporte.salida.numeroCasa debe tener una longitud de 1 a 6 caracteres",
          );
        }
      }
    }
  }


}


const generateDatosEntregaValidate = (data) => {
  var regExpOnlyNumber = new RegExp(/^\d+$/);
  let errorDepDisCiu = false;
  if (!data['detalleTransporte']['entrega']['ciudad']) {
    errors.push('Debe especificar la Ciudad del Local de Entrega en data.transporte.entrega.ciudad');
    errorDepDisCiu = true;
  } else {
    if (
      ciudades.filter(
        (ciudad) => ciudad.codigo === +data['detalleTransporte']['entrega']['ciudad'],
      ).length == 0
    ) {
      errors.push(
        "Ciudad '" +
        data['detalleTransporte']['entrega']['ciudad'] +
        "' del Cliente en data.transporte.entrega.ciudad no encontrado. Valores: " +
        ciudades.map((a) => a.codigo + '-' + a.descripcion),
      );
      errorDepDisCiu = true;
    }

    //De acuerdo a la Ciudad pasada como parametro, buscar el distrito y departamento y asignar dichos
    //valores de forma predeterminada, aunque este valor sera sobre-escrito caso el usuario envie
    //data['detalleTransporte']['entrega']['distrito'] y data['detalleTransporte']['entrega']['departamento']
    let objCiudad = ciudades.filter(
      (ciu) => ciu.codigo === +data['detalleTransporte']['entrega']['ciudad'],
    );

    if (objCiudad && objCiudad[0]) {
      let objDistrito = distritos.filter((dis) => dis.codigo === +objCiudad[0]['distrito']);

      let objDepartamento = departamentos.filter(
        (dep) => dep.codigo === +objDistrito[0]['departamento'],
      );

      //Solo actualiza si no tiene valor
      if (!data['detalleTransporte']['entrega']['distrito'])
        data['detalleTransporte']['entrega']['distrito'] = objDistrito[0]['codigo'];

      if (!data['detalleTransporte']['entrega']['departamento'])
        data['detalleTransporte']['entrega']['departamento'] = objDepartamento[0]['codigo'];
    }

    if (!errorDepDisCiu) {
      if (!data['detalleTransporte']['entrega']['departamento']) {
        errors.push(
          'Debe especificar el Departamento del Local de Entrega en data.transporte.entrega.departamento',
        );
        errorDepDisCiu = true;
      }
      if (!data['detalleTransporte']['entrega']['distrito']) {
        errors.push('Debe especificar el Distrito del Local de Entrega en data.transporte.entrega.distrito');
        errorDepDisCiu = true;
      }
    }
  }

  if (!errorDepDisCiu) {
    validateDepartamentoDistritoCiudad(
      'data.transporte.entrega',
      +data['detalleTransporte']['entrega']['departamento'],
      +data['detalleTransporte']['entrega']['distrito'],
      +data['detalleTransporte']['entrega']['ciudad'],
      errors,
    );
  }


  if (!data['detalleTransporte']['entrega']['direccion']) {
    errors.push('Debe especificar la Dirección del Local de Entrega en data.transporte.entrega.direccion');
  } else {
    if (
      !(
        data['detalleTransporte']['entrega']['direccion'].length >= 1 &&
        data['detalleTransporte']['entrega']['direccion'].length <= 255
      )
    ) {
      errors.push(
        "Dirección del Local de Entrega '" +
        data['detalleTransporte']['entrega']['direccion'] +
        "' en data.transporte.entrega.direccion debe tener una longitud de 1 a 255 caracteres",
      );
    }
  }

  if (data['detalleTransporte']['entrega']['numeroCasa'] == null) {
    errors.push('Debe especificar el Número de Casa del Local de Entrega en data.transporte.entrega.numeroCasa');
  } else {
    if (!((data['detalleTransporte']['entrega']['numeroCasa'] + '').length > 0)) {
      errors.push(
        'Debe especificar el Número de Casa del Local de Entrega en data.transporte.entrega.numeroCasa',
      );
    } else {
      if (data['detalleTransporte']['entrega']['numeroCasa']) {
        if (!regExpOnlyNumber.test(data['detalleTransporte']['entrega']['numeroCasa'])) {
          errors.push('El Número de Casa en data.transporte.entrega.numeroCasa debe ser numérico');
        }
      } else {
        if (
          !(
            (data['detalleTransporte']['entrega']['numeroCasa'] + '').length >= 1 &&
            (data['detalleTransporte']['entrega']['numeroCasa'] + '').length <= 6
          )
        ) {
          errors.push(
            "Número de Casa del Local de Entrega '" +
            data['detalleTransporte']['entrega']['numeroCasa'] +
            "' en data.transporte.entrega.numeroCasa debe tener una longitud de 1 a 6 caracteres",
          );
        }
      }
    }
  }


}


const generateDatosVehiculoValidate = (data) => {
  if (!(data['detalleTransporte'] && data['detalleTransporte']['vehiculo'])) {
    errors.push('Los datos del Vehiculo en data.transporte.vehiculo no fueron informados');
  } else {
    if (!data['detalleTransporte']['vehiculo']['tipo']) {
      errors.push('El tipo de Vehiculo en data.transporte.vehiculo.tipo no fue informado');
    } else {
      if (
        !(
          data['detalleTransporte']['vehiculo']['tipo'].length >= 4 &&
          data['detalleTransporte']['vehiculo']['tipo'].length <= 10
        )
      ) {
        errors.push(
          "Tipo de Vehiculo '" +
          data['detalleTransporte']['vehiculo']['tipo'] +
          "' en data.transporte.vehiculo.tipo debe tener una longitud de 4 a 10 caracteres ",
        );
      }
    }

    if (!data['detalleTransporte']['vehiculo']['documentoTipo']) {
      errors.push(
        'El Tipo de Documento del Vehiculo en data.transporte.vehiculo.documentoTipo no fue informado',
      );
    } else {
      if (+data['detalleTransporte']['vehiculo']['documentoTipo'] == 1) {
        if (!data['detalleTransporte']['vehiculo']['documentoNumero']) {
          errors.push(
            'El numero de identificacion del Vehiculo en data.transporte.vehiculo.documentoNumero no fue informado',
          );
        } else {
          if (
            !(
              data['detalleTransporte']['vehiculo']['documentoNumero'].length >= 1 &&
              data['detalleTransporte']['vehiculo']['documentoNumero'].length <= 20
            )
          ) {
            errors.push(
              "Número de Identificacion del Vehiculo '" +
              data['detalleTransporte']['vehiculo']['documentoNumero'] +
              "' en data.transporte.vehiculo.documentoNumero debe tener una longitud de 1 a 20 caracteres ",
            );
          }
        }
      }

      if (+data['detalleTransporte']['vehiculo']['documentoTipo'] == 2) {
        if (!data['detalleTransporte']['vehiculo']['numeroMatricula']) {
          errors.push(
            'El numero de matricula del Vehiculo en data.transporte.vehiculo.numeroMatricula no fue informado',
          );
        } else {
          if (
            !(
              data['detalleTransporte']['vehiculo']['numeroMatricula'].length >= 6 &&
              data['detalleTransporte']['vehiculo']['numeroMatricula'].length <= 7
            )
          ) {
            errors.push(
              "Número de Matricula '" +
              data['detalleTransporte']['vehiculo']['numeroMatricula'] +
              "' en data.transporte.vehiculo.numeroMatricula debe tener una longitud de 6 a 7 caracteres ",
            );
          }
        }
      }
    }
  }

  if (!data['detalleTransporte']['vehiculo']['marca']) {
    errors.push('La marca del Vehiculo en data.transporte.vehiculo.marca no fue informado');
  } else {
    if (
      !(
        data['detalleTransporte']['vehiculo']['marca'].length >= 1 &&
        data['detalleTransporte']['vehiculo']['marca'].length <= 10
      )
    ) {
      errors.push(
        "Marca del Vehiculo '" +
        data['detalleTransporte']['vehiculo']['marca'] +
        "' en data.transporte.vehiculo.marca debe tener una longitud de 1 a 10 caracteres",
      );
    }
  }
}

const generateDatosTransportistaValidate = (data) => {
  let errorEsContribuyente = false;
  if (data['detalleTransporte']['transportista']) {
    if (typeof data['detalleTransporte']['transportista']['contribuyente'] == 'undefined') {
      errors.push(
        'Debe indicar si el Transportista es o no un Contribuyente true|false en data.transporte.transportista.contribuyente',
      );
      errorEsContribuyente = true;
    }

    if (typeof data['detalleTransporte']['transportista']['contribuyente'] == 'undefined') {
      errors.push(
        'Debe indicar si el Transportista es o no un Contribuyente true|false en data.transporte.transportista.contribuyente',
      );
      errorEsContribuyente = true;
    }

    if (
      !(
        data['detalleTransporte']['transportista']['contribuyente'] === true ||
        data['detalleTransporte']['transportista']['contribuyente'] === false
      )
    ) {
      errors.push('data.transporte.transportista.contribuyente debe ser true|false');
      errorEsContribuyente = true;
    }
  }

  if (!errorEsContribuyente) {
    if (
      data['detalleTransporte'] &&
      data['detalleTransporte']['transportista'] &&
      data['detalleTransporte']['transportista']['contribuyente'] === true
    ) {
      if (
        !(
          data['detalleTransporte'] &&
          data['detalleTransporte']['transportista'] &&
          data['detalleTransporte']['transportista']['ruc']
        )
      ) {
        errors.push('Debe especificar el RUC para el Transportista en data.transporte.transportista.ruc');
      } else {
        if (data['detalleTransporte']['transportista']['ruc'].indexOf('-') == -1) {
          console.log('agregar error');

          errors.push('RUC debe contener dígito verificador en data.transporte.transportista.ruc');
        }

        var regExpOnlyNumber = new RegExp(/^\d+$/);
        const rucCliente = data['detalleTransporte']['transportista']['ruc'].split('-');

        //Un RUC puede ser alphanumerico
        /*if (!regExpOnlyNumber.test((rucCliente[0] + '').trim())) {
         errors.push(
            "La parte del RUC del Cliente '" +
              data['detalleTransporte']['transportista']['ruc'] +
              "' en data.transporte.transportista.ruc debe ser numérico",
          );
        }*/
        if (!regExpOnlyNumber.test((rucCliente[1] + '').trim())) {
          errors.push(
            "La parte del DV del RUC del Cliente '" +
            data['detalleTransporte']['transportista']['ruc'] +
            "' en data.transporte.transportista.ruc debe ser numérico",
          );
        }

        if (!(rucCliente[0].length >= 3 && rucCliente[0].length <= 8)) {
          errors.push(
            "La parte del RUC '" +
            data['detalleTransporte']['transportista']['ruc'] +
            "' en data.transporte.transportista.ruc debe contener de 1 a 8 caracteres",
          );
        }

        if (rucCliente[1] > 9) {
          errors.push(
            "La parte del DV del RUC '" +
            data['detalleTransporte']['transportista']['ruc'] +
            "' data.transporte.transportista.ruc debe ser del 1 al 9",
          );
        }
      }
    } else {
      //No es contribuyente
      if (!data['detalleTransporte']['transportista']['documentoTipo']) {
        errors.push('Debe especificar el Tipo de Documento en data.transporte.transportista.documentoTipo');
      } else {
        if (
          tiposDocumentosIdentidades.filter(
            (um) => um.codigo === data['detalleTransporte']['transportista']['documentoTipo'],
          ).length == 0
        ) {
          errors.push(
            "Tipo de Documento '" +
            data['detalleTransporte']['transportista']['documentoTipo'] +
            "' en data.transporte.transportista.documentoTipo no encontrado. Valores: " +
            tiposDocumentosIdentidades.map((a) => a.codigo + '-' + a.descripcion),
          );
        }
      }

      if (!data['detalleTransporte']['transportista']['documentoNumero']) {
        errors.push(
          'Es obligatorio especificar el Número de Documento la Empresa transportista en data.transporte.transportista.documentoNumero',
        );
      }
    }
  }

  //Datos obligatorios que no dependen de si es o no contribuyente
  if (!data['detalleTransporte']['transportista']['direccion']) {
    errors.push(
      'Es obligatorio especificar la dirección de la Empresa transportista en data.transporte.transportista.direccion',
    );
  } else {
    //Validar longitud
    if (
      !(
        data['detalleTransporte']['transportista']['direccion'].length >= 1 &&
        data['detalleTransporte']['transportista']['direccion'].length <= 150
      )
    ) {
      errors.push(
        'La direccion de la Empresa Transportista (' +
        data['detalleTransporte']['transportista']['direccion'] +
        ') en data.transporte.transportista.direccion debe tener una longitud de 1 a 150 caracteres',
      );
    }
  }

  //Chofer - Obligatorio
  if (
    !(
      data['detalleTransporte'] &&
      data['detalleTransporte']['transportista'] &&
      data['detalleTransporte']['transportista']['chofer']
    )
  ) {
    errors.push('Es obligatorio especificar los datos del chofer en data.transporte.transportista.chofer');
  } else {
    //Valida los datos del chofer

    if (!data['detalleTransporte']['transportista']['chofer']['documentoNumero']) {
      errors.push(
        'Es obligatorio especificar el nombre del chofer en data.transporte.transportista.chofer.documentoNumero',
      );
    } else {
      //Validar longitud
      if (
        !(
          data['detalleTransporte']['transportista']['chofer']['documentoNumero'].length >= 1 &&
          data['detalleTransporte']['transportista']['chofer']['documentoNumero'].length <= 20
        )
      ) {
        errors.push(
          'El número de documento del Chofer (' +
          data['detalleTransporte']['transportista']['chofer']['documentoNumero'] +
          ') en data.transporte.transportista.chofer.documentoNumero debe tener una longitud de 1 a 20 caracteres',
        );
      }

      //Validar si tiene puntos
      if ((data['detalleTransporte']['transportista']['chofer']['documentoNumero'] + '').includes('.')) {
        errors.push(
          'El número de documento del Chofer (' +
          data['detalleTransporte']['transportista']['chofer']['documentoNumero'] +
          ') en data.transporte.transportista.chofer.documentoNumero debe estar sin puntos',
        );
      }
    }

    if (!data['detalleTransporte']['transportista']['chofer']['nombre']) {
      errors.push(
        'Es obligatorio especificar el nombre del chofer en data.transporte.transportista.chofer.nombre',
      );
    } else {
      //Validar longitud
      if (
        !(
          data['detalleTransporte']['transportista']['chofer']['nombre'].length >= 4 &&
          data['detalleTransporte']['transportista']['chofer']['nombre'].length <= 60
        )
      ) {
        errors.push(
          'El nombre del Chofer (' +
          data['detalleTransporte']['transportista']['chofer']['nombre'] +
          ') en data.transporte.transportista.chofer.nombre debe tener una longitud de 4 a 60 caracteres',
        );
      }
    }

    if (!data['detalleTransporte']['transportista']['chofer']['direccion']) {
      errors.push(
        'Es obligatorio especificar la dirección del chofer en data.transporte.transportista.chofer.direccion',
      );
    } else {
      //Validar longitud
      if (
        !(
          data['detalleTransporte']['transportista']['chofer']['direccion'].length >= 4 &&
          data['detalleTransporte']['transportista']['chofer']['direccion'].length <= 60
        )
      ) {
        errors.push(
          'La direccion del Chofer (' +
          data['detalleTransporte']['transportista']['chofer']['direccion'] +
          ') en data.transporte.transportista.chofer.direccion debe tener una longitud de 4 a 60 caracteres',
        );
      }
    }
  }

  if (
    data['detalleTransporte'] &&
    data['detalleTransporte']['transportista'] &&
    data['detalleTransporte']['transportista']['agente'] &&
    data['detalleTransporte']['transportista']['agente']['ruc']
  ) {
    if (data['detalleTransporte']['transportista']['agente']['ruc'].indexOf('-') == -1) {
      errors.push('RUC debe contener dígito verificador en data.transporte.transportista.agente.ruc');
    }

    var regExpOnlyNumber = new RegExp(/^\d+$/);
    const rucCliente = data['detalleTransporte']['transportista']['agente']['ruc'].split('-');

    //Un RUC puede ser alphanumerico
    /*if (!regExpOnlyNumber.test((rucCliente[0] + '').trim())) {
     errors.push(
        "La parte del RUC del Cliente '" +
          data['detalleTransporte']['transportista']['agente']['ruc'] +
          "' en data.transporte.transportista.agente.ruc debe ser numérico",
      );
    }*/
    if (!regExpOnlyNumber.test((rucCliente[1] + '').trim())) {
      errors.push(
        "La parte del DV del RUC del Cliente '" +
        data['detalleTransporte']['transportista']['agente']['ruc'] +
        "' en data.transporte.transportista.agente.ruc debe ser numérico",
      );
    }

    if (!(rucCliente[0].length >= 3 && rucCliente[0].length <= 8)) {
      errors.push(
        "La parte del RUC '" +
        data['detalleTransporte']['transportista']['agente']['ruc'] +
        "' en data.transporte.transportista.agente.ruc debe contener de 3 a 8 caracteres",
      );
    }

    if (rucCliente[1] > 9) {
      errors.push(
        "La parte del DV del RUC '" +
        data['detalleTransporte']['transportista']['agente']['ruc'] +
        "' data.transporte.transportista.agente.ruc debe ser del 1 al 9",
      );
    }
  }

  if (data['detalleTransporte']['transportista'] && data['detalleTransporte']['transportista']['pais']) {
    if (
      constanteService.paises.filter(
        (pais) => pais.codigo === data['detalleTransporte']['transportista']['pais'],
      ).length == 0
    ) {
      errors.push(
        "Pais '" +
        data['detalleTransporte']['transportista']['pais'] +
        "' del Cliente en data.transporte.transportista.pais no encontrado. Valores: " +
        constanteService.paises.map((a) => a.codigo + '-' + a.descripcion),
      );
    }
  }
}

const generateDatosTotalesValidate = (data) => {
 

  if (data['moneda'] != 'PYG' && data['condicionTipoCambio'] == 1) {
    if (!data['cambio']) {
      errors.push(
        'Debe especificar el valor del Cambio en data.cambio cuando moneda != PYG y la Cotización es Global',
      );
    }
  }

  if (data.moneda == 'PYG') {
    if ((data['descuentoGlobal'] + '').split('.')[1]?.length > 0) {
      errors.push(
        'El Descuento Global "' +
        data['descuentoGlobal'] +
        '" en "PYG" en data.descuentoGlobal, no puede contener decimales',
      );
    }
  } else {
    if ((data['descuentoGlobal'] + '').split('.')[1]?.length > 8) {
      errors.push(
        'El Descuento Global "' +
        data['descuentoGlobal'] +
        '" en data.descuentoGlobal, no puede contener mas de 8 decimales',
      );
    }
  }

  if (data.moneda == 'PYG') {
    if ((data['anticipoGlobal'] + '').split('.')[1]?.length > 0) {
      errors.push(
        'El Anticipo Global "' +
        data['anticipoGlobal'] +
        '" en "PYG" en data.anticipoGlobal, no puede contener decimales',
      );
    }
  } else {
    if ((data['anticipoGlobal'] + '').split('.')[1]?.length > 8) {
      errors.push(
        'El Anticipo Global "' +
        data['anticipoGlobal'] +
        '" en data.anticipoGlobal, no puede contener mas de 8 decimales',
      );
    }
  }
}


const generateDatosComercialesUsoGeneralValidate = (data) => {
  const jsonResult = {
    //dOrdCompra : data['complementarios']['ordenCompra'],
    //dOrdVta : data['complementarios']['ordenVenta'],
    //dAsiento : data['complementarios']['numeroAsiento']
  };

  if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 7) {
    //Opcional si 1 o 7
    if (
      (data['complementarios'] &&
        data['complementarios']['carga'] &&
        data['complementarios']['carga']['volumenTotal']) ||
      (data['complementarios'] && data['complementarios']['carga'] && data['complementarios']['carga']['pesoTotal'])
    ) {
      generateDatosCargaValidate(data);
    }
  }
}


const generateDatosCargaValidate = (data) => {
  //TODO ALL
  /*const jsonResult = {
    cUniMedTotVol : data['complementarios']['carga']['unidadMedida'], 
          dDesUniMedTotVol : data['complementarios']['carga']['ordenVenta'],
          dTotVolMerc : data['complementarios']['carga']['totalVolumenMercaderia'],
          cUniMedTotPes : data['complementarios']['carga']['numeroAsiento'],
          dDesUniMedTotPes : data['complementarios']['carga']['numeroAsiento'],
          dTotPesMerc : data['complementarios']['carga']['numeroAsiento'],
          iCarCarga : data['complementarios']['carga']['numeroAsiento'],
          dDesCarCarga : data['complementarios']['carga']['numeroAsiento'],
  };*/

  if (
    data['complementarios'] &&
    data['complementarios']['carga'] &&
    data['complementarios']['carga']['unidadMedidaVolumenTotal']
  ) {
    if (
      unidadesMedidas.filter(
        (um) => um.codigo === data['complementarios']['carga']['unidadMedidaVolumenTotal'],
      ).length == 0
    ) {
      errors.push(
        "Unidad de Medida '" +
        data['complementarios']['carga']['unidadMedidaVolumenTotal'] +
        "' en data.complementarios.carga.unidadMedidaVolumenTotal no válido. Valores: " +
        unidadesMedidas.map((a) => a.codigo + '-' + a.descripcion.trim()),
      );
    }
  }

  if (
    data['complementarios'] &&
    data['complementarios']['carga'] &&
    data['complementarios']['carga']['unidadMedidaPesoTotal']
  ) {
    if (
      unidadesMedidas.filter(
        (um) => um.codigo === data['complementarios']['carga']['unidadMedidaPesoTotal'],
      ).length == 0
    ) {
      errors.push(
        "Unidad de Medida '" +
        data['complementarios']['carga']['unidadMedidaPesoTotal'] +
        "' en data.complementarios.carga.unidadMedidaPesoTotal no válido. Valores: " +
        unidadesMedidas.map((a) => a.codigo + '-' + a.descripcion.trim()),
      );
    }
  }

  if (
    data['complementarios'] &&
    data['complementarios']['carga'] &&
    data['complementarios']['carga']['caracteristicaCarga']
  ) {
    if (
      caracteristicasCargas.filter(
        (um) => um.codigo === data['complementarios']['carga']['caracteristicaCarga'],
      ).length == 0
    ) {
      errors.push(
        "Característica de Carga '" +
        data['complementarios']['carga']['caracteristicaCarga'] +
        "' en data.complementarios.carga.caracteristicaCarga no válido. Valores: " +
        caracteristicasCargas.map((a) => a.codigo + '-' + a.descripcion),
      );
    }

    if (data['complementarios']['carga']['caracteristicaCarga'] == 3) {
      if (!data['complementarios']['carga']['caracteristicaCargaDescripcion']) {
        errors.push(
          'Para data.complementarios.carga.caracteristicaCarga = 3 debe informar el campo data.complementarios.carga.caracteristicaCargaDescripcion',
        );
      }
    }
  }
}


const generateDatosDocumentoAsociadoValidate = (dataDocumentoAsociado, data) => {
  if (data['tipoTransaccion'] == 11 && !dataDocumentoAsociado['resolucionCreditoFiscal']) {
    errors.push('Obligatorio informar data.documentoAsociado.resolucionCreditoFiscal');
  }

  //Validaciones
  if (
    tiposDocumentosAsociados.filter((um) => um.codigo === +dataDocumentoAsociado['formato'])
      .length == 0
  ) {
    errors.push(
      "Formato de Documento Asociado '" +
      dataDocumentoAsociado['formato'] +
      "' en data.documentoAsociado.formato no encontrado. Valores: " +
      tiposDocumentosAsociados.map((a) => a.codigo + '-' + a.descripcion),
    );
  }

  if (dataDocumentoAsociado['tipo'] == 2) {
    if (
      tiposDocumentosImpresos.filter(
        (um) => um.codigo === dataDocumentoAsociado['tipoDocumentoImpreso'],
      ).length == 0
    ) {
      errors.push(
        "Tipo de Documento impreso '" +
        dataDocumentoAsociado['tipoDocumentoImpreso'] +
        "' en data.documentoAsociado.tipoDocumentoImpreso no encontrado. Valores: " +
        tiposDocumentosImpresos.map((a) => a.codigo + '-' + a.descripcion),
      );
    }
  }

  if (dataDocumentoAsociado['formato'] == 1) {
    //H002 = Electronico
    if (!(dataDocumentoAsociado['cdc'] && dataDocumentoAsociado['cdc'].length >= 44)) {
      errors.push('Debe indicar el CDC asociado en data.documentoAsociado.cdc');
    }
    if (dataDocumentoAsociado['rucFusionado']) {
      if (!(dataDocumentoAsociado['rucFusionado'] >= 3 && dataDocumentoAsociado['rucFusionado'].length <= 8)) {
        errors.push('El RUC fusionado debe estar entre 3 y 8 caracteres');
      }
    }
  }
  if (dataDocumentoAsociado['formato'] == 2) {
    //H002 = Impreso
    if (!dataDocumentoAsociado['timbrado']) {
      errors.push(
        'Debe especificar el Timbrado del Documento impreso Asociado en data.documentoAsociado.timbrado',
      );
    }
    if (!dataDocumentoAsociado['establecimiento']) {
      errors.push(
        'Debe especificar el Establecimiento del Documento impreso Asociado en data.documentoAsociado.establecimiento',
      );
    }
    if (!dataDocumentoAsociado['punto']) {
      errors.push('Debe especificar el Punto del Documento impreso Asociado en data.documentoAsociado.punto');
    }

    if (!dataDocumentoAsociado['numero']) {
      errors.push('Debe especificar el Número del Documento impreso Asociado en data.documentoAsociado.numero');
    }

    if (!dataDocumentoAsociado['tipoDocumentoImpreso']) {
      errors.push(
        'Debe especificar el Tipo del Documento Impreso Asociado en data.documentoAsociado.tipoDocumentoImpreso',
      );
    }

    if (dataDocumentoAsociado['fecha']) {
      if ((dataDocumentoAsociado['fecha'] + '').length != 10) {
        errors.push(
          'La Fecha del Documento impreso Asociado en data.documentoAsociado.fecha debe tener una longitud de 10 caracteres',
        );
      }
    } else {
      errors.push('Debe especificar la Fecha del Documento impreso Asociado en data.documentoAsociado.fecha');
    }
  }

  if (dataDocumentoAsociado['formato'] == 3) {
    //H002 = Constancia electronica
    if (!dataDocumentoAsociado['constanciaTipo']) {
      errors.push('Debe especificar el Tipo de Constancia data.documentoAsociado.constanciaTipo');
    } else {
      if (
        tiposConstancias.filter((um) => um.codigo === dataDocumentoAsociado['constanciaTipo'])
          .length == 0
      ) {
        errors.push(
          "Tipo de Constancia '" +
          dataDocumentoAsociado['constanciaTipo'] +
          "' en data.documentoAsociado.constanciaTipo no encontrado. Valores: " +
          tiposConstancias.map((a) => a.codigo + '-' + a.descripcion),
        );
      }
    }
  }
}
module.exports = {
  validateValues
};
