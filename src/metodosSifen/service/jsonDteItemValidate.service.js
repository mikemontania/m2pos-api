const { tiposCombustibles, tiposOperacionesVehiculos, codigosAfectaciones, paises, unidadesMedidas, relevanciasMercaderias } = require("./constants.service");
const { leftZero } = require("./util");
 
  
  const generateDatosItemsOperacionValidate = ( data,   errors )  => {
   errors = errors;
    const regExpOnlyNumber = new RegExp(/^\d+$/);

    const jsonResult = [];

    //Recorrer array de items e informar en el JSON
    if (data['items'] && data['items'].length > 0) {
      for (let i = 0; i < data['items'].length; i++) {
        const item = data['items'][i];

        let unidadMedida = +item['unidadMedida'];

        //Validaciones
        if (!((item['codigo'] + '').length >= 1 && (item['codigo'] + '').length <= 50)) {
         errors.push(
            'El código del item (' +
              item['codigo'] +
              ') en data.items[' +
              i +
              '].codigo debe tener una longitud de 1 a 50 caracteres',
          );
        }

        if (!item['ncm']) {
          //this.errors.push('La descripción del item en data.items[' + i + '].ncm no puede ser null');
        } else {
          if (!(item['ncm'].length >= 6 && item['ncm'].length <= 8)) {
           errors.push(
              'El valor del campo NCM (' +
                item['ncm'] +
                ') en data.items[' +
                i +
                '].ncm debe tener una longitud de 6 a 8 caracteres',
            );
          }
        }

        if (unidadesMedidas.filter((um) => um.codigo === +unidadMedida).length == 0) {
         errors.push(
            "Unidad de Medida '" +
              unidadMedida +
              "' en data.items[" +
              i +
              '].unidadMedida no encontrado. Valores: ' +
              unidadesMedidas.map((a) => a.codigo + '-' + a.descripcion.trim()),
          );
        }
        if (data['tipoDocumento'] === 7) {
          if (!item['tolerancia']) {
            /*this.errors.push(
              'La Tolerancia es opcional para el Tipo de Documento = 7 en data.items[' + i + '].tolerancia',
            );*/
            //No es obligatorio
          } else {
            //Si tiene tolerancia, entonces valida
            if (relevanciasMercaderias.filter((um) => um.codigo === +item['tolerancia']).length == 0) {
             errors.push(
                "Tolerancia de Mercaderia '" +
                  item['tolerancia'] +
                  "' en data.items[" +
                  i +
                  '].tolerancia no encontrado. Valores: ' +
                  relevanciasMercaderias.map((a) => a.codigo + '-' + a.descripcion),
              );
            }

            if (!(item['toleranciaCantidad'] && item['toleranciaPorcentaje'])) {
             errors.push(
                'La Tolerancia require especificar la cantidad y porcentaje de quiebra o merma en data.items[' +
                  i +
                  '].toleranciaCantidad y data.items[' +
                  i +
                  '].toleranciaPorcenaje',
              );
            }
          }
        }

        let regexp = new RegExp('<[^>]*>'); //HTML/XML TAGS

        if (!item['descripcion']) {
         errors.push('La descripción del item en data.items[' + i + '].descripcion no puede ser null');
        } else {
          if (!((item['descripcion'] + '').length >= 1 && (item['descripcion'] + '').length <= 2000)) {
           errors.push(
              'La descripción del item (' +
                item['descripcion'] +
                ') en data.items[' +
                i +
                '].descripcion debe tener una longitud de 1 a 2000 caracteres',
            );
          }

          if (regexp.test(item['descripcion'])) {
           errors.push(
              'La descripción del item (' +
                item['descripcion'] +
                ') en data.items[' +
                i +
                '].descripcion contiene valores inválidos',
            );
          }
        }

        if ((item['cantidad'] + '').split('.')[1]?.length > 8) {
         errors.push(
            'La Cantidad del item "' +
              item['cantidad'] +
              '" en data.items[' +
              i +
              '].cantidad, no puede contener mas de 8 decimales',
          );
        }

        if (data.moneda == 'PYG') {
     
          if ((item['precioUnitario'] + '').split('.')[1]?.length > 8) {
           errors.push(
              'El Precio Unitario del item "' +
                item['precioUnitario'] +
                '" en "PYG" en data.items[' +
                i +
                '].precioUnitario, no puede contener más de 8 decimales',
            );
          }
        } else {
          if ((item['precioUnitario'] + '').split('.')[1]?.length > 8) {
           errors.push(
              'El Precio Unitario del item "' +
                item['precioUnitario'] +
                '" en data.items[' +
                i +
                '].precioUnitario, no puede contener más de 8 decimales',
            );
          }
        }

        if (data.moneda == 'PYG') {
       
          if ((item['descuento'] + '').split('.')[1]?.length > 8) {
           errors.push(
              'El Descuento del item "' +
                item['descuento'] +
                '" en "PYG" en data.items[' +
                i +
                '].descuento, no puede contener más de 8 decimales',
            );
          }
        } else {
          if ((item['descuento'] + '').split('.')[1]?.length > 8) {
           errors.push(
              'El Descuento del item "' +
                item['descuento'] +
                '" en data.items[' +
                i +
                '].descuento, no puede contener más de 8 decimales',
            );
          }
        }

        //se comenta por que este tien problemas con los decimales regExpOnlyNumber
        /*if (
          !(item['cantidad'] != null && (item['cantidad'] + '').length > 0 && regExpOnlyNumber.test(item['cantidad']))
        ) {
         errors.push('Debe especificar la cantidad del item en data.items[' + i + '].cantidad');
        } else {*/
        if (+item['cantidad'] <= 0) {
         errors.push('La cantidad del item en data.items[' + i + '].cantidad debe ser mayor a cero');
        }
        //}

        /*if (
          !(
            item['precioUnitario'] != null &&
            (item['precioUnitario'] + '').length > 0 &&
            regExpOnlyNumber.test(item['precioUnitario'])
          )
        ) {
         errors.push('Debe especificar la precio unitario del item en data.items[' + i + '].precioUnitario');
        } else {*/
        if (+item['precioUnitario'] < 0) {
         errors.push(
            'El precio unitario del item en data.items[' + i + '].precioUnitario debe ser mayor o igual a cero',
          );
        }
        //}

        if (item['descuento']) {
          if (+item['descuento'] < 0) {
           errors.push(
              'El Descuento del item en data.items[' + i + '].descuento debe ser mayor o igual Anticipo cero',
            );
          }
        }
        if (item['anticipo']) {
          if (+item['anticipo'] < 0) {
           errors.push('El Anticipo del item en data.items[' + i + '].anticipo debe ser mayor o igual a cero');
          }
        }

        if (item['cambio']) {
          if (+item['cambio'] < 0) {
           errors.push('El Cambio del item en data.items[' + i + '].cambio debe ser mayor o igual a cero');
          }
        }

        if (item['cdcAnticipo']) {
          if (item['cdcAnticipo'].length != 44) {
           errors.push(
              'El Valor (' +
                item['cdcAnticipo'] +
                ') del CDC del Anticipo en data.items[' +
                i +
                '].cdcAnticipo debe tener 44 caracteres',
            );
          }
        }

        if (item['pais']) {
          if (paises.filter((pais) => pais.codigo === item['pais']).length == 0) {
           errors.push(
              "Pais '" +
                item['pais'] +
                "' del Producto en data.items[" +
                i +
                '].pais no encontrado. Valores: ' +
                paises.map((a) => a.codigo + '-' + a.descripcion),
            );
          }
        }

        if (item['observacion'] && (item['observacion'] + '').trim().length > 0) {
          if (!((item['observacion'] + '').trim().length >= 1 && (item['observacion'] + '').trim().length <= 500)) {
           errors.push(
              'La observación del item (' +
                item['observacion'] +
                ') en data.items[' +
                i +
                '].observacion debe tener una longitud de 1 a 500 caracteres',
            );
          }
          if (regexp.test(item['observacion'])) {
           errors.push(
              'La observación del item (' +
                item['observacion'] +
                ') en data.items[' +
                i +
                '].observacion contiene valores inválidos',
            );
          }
        }

        //Tratamiento E719. Tiene relacion con generateDatosGeneralesInherentesOperacion
        if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 4) {
          if (data['tipoTransaccion'] !== 9) {
            /*if (data['documentoAsociado'] != null && tiene que ser tipo 9) {
              if (!item['cdcAnticipo']) {
               errors.push('Debe informar data.items*.cdcAnticipo');
              }              
            }*/
          }
        }

        if (data['tipoDocumento'] != 7) {
          //Oblitatorio informar
         generateDatosItemsOperacionDescuentoAnticipoValorTotalValidate(  item, i);
        }

        if (
          data['tipoImpuesto'] == 1 ||
          data['tipoImpuesto'] == 3 ||
          data['tipoImpuesto'] == 4 ||
          data['tipoImpuesto'] == 5
        ) {
          if (data['tipoDocumento'] != 4 && data['tipoDocumento'] != 7) {
           generateDatosItemsOperacionIVAValidate(  item, i);
          }
        }

        //Rastreo
        if (
          item['lote'] ||
          item['vencimiento'] ||
          item['numeroSerie'] ||
          item['numeroPedido'] ||
          item['numeroSeguimiento']
        ) {
         generateDatosItemsOperacionRastreoMercaderiasValidate(  item, i);
        }

        //Automotores
        if (item['sectorAutomotor'] && item['sectorAutomotor']['tipo']) {
         generateDatosItemsOperacionSectorAutomotoresValidate(  item, i);
        }

        if (data['cliente']['tipoOperacion'] && data['cliente']['tipoOperacion'] === 3) {
          if (!item['dncp']) {
           errors.push(
              'Debe especificar los datos de la DNCP en ' +
                'data.items[' +
                i +
                '].dncp para el el tipo de operación 3-B2G',
            );
          } else {
            if (
              !(
                item['dncp']['codigoNivelGeneral'] &&
                (item['dncp']['codigoNivelGeneral'] + '').length > 0 &&
                (item['dncp']['codigoNivelGeneral'] + '').length <= 8
              )
            ) {
             errors.push(
                'Debe especificar los datos de la DNCP en ' +
                  'data.items[' +
                  i +
                  '].dncp.codigoNivelGeneral (hasta 8 digitos) para el el tipo de operación 3-B2G',
              );
            } else {
              item['dncp']['codigoNivelGeneral'] = leftZero(item['dncp']['codigoNivelGeneral'], 8);
            }

            if (
              !(
                item['dncp']['codigoNivelEspecifico'] &&
                (item['dncp']['codigoNivelEspecifico'] + '').length >= 3 &&
                (item['dncp']['codigoNivelEspecifico'] + '').length <= 4
              )
            ) {
             errors.push(
                'Debe especificar los datos de la DNCP en ' +
                  'data.items[' +
                  i +
                  '].dncp.codigoNivelEspecifico (3 o 4 digitos) para el el tipo de operación 3-B2G',
              );
            } else {
              //item['dncp']['codigoNivelEspecifico'] = leftZero( item['dncp']['codigoNivelEspecifico'], 8);
            }
          }
        }
      } //end-for
    }
    returnerrors;
  }

 
  const generateDatosItemsOperacionDescuentoAnticipoValorTotalValidate = (  item, i)  => {
    const jsonResult = {};

    if (item['descuento'] && +item['descuento'] > 0) {
      //Validar que si el descuento es mayor al precio
      if (+item['descuento'] > +item['precioUnitario']) {
       errors.push(
          "Descuento '" +
            item['descuento'] +
            "' del Producto en data.items[" +
            i +
            "].descuento supera al Precio Unitario '" +
            item['precioUnitario'],
        );
      }
     
    }
  }
 
  const generateDatosItemsOperacionIVAValidate = (  item, i)  => {
    if (codigosAfectaciones.filter((um) => um.codigo === +item['ivaTipo']).length == 0) {
     errors.push(
        "Tipo de IVA '" +
          item['ivaTipo'] +
          "' en data.items[" +
          i +
          '].ivaTipo no encontrado. Valores: ' +
          codigosAfectaciones.map((a) => a.codigo + '-' + a.descripcion),
      );
    }

    if (item['ivaTipo'] == 1) {
      if (item['ivaBase'] != 100) {
       errors.push(
          'Valor de "ivaBase"=' +
            item['ivaBase'] +
            ' debe ser igual a 100 para "ivaTipo" = 1 en data.items[' +
            i +
            '].ivaBase',
        );
      }
    }

    if (item['ivaTipo'] == 2 || item['ivaTipo'] == 3) {
      //Exento
      if (item['ivaBase'] != 0) {
       errors.push(
          'Valor de "ivaBase"=' +
            item['ivaBase'] +
            ' debe ser igual a 0 para "ivaTipo" = ' +
            item['ivaTipo'] +
            ' en data.items[' +
            i +
            '].ivaBase',
        );
      }

      if (item['iva'] != 0) {
       errors.push(
          'Valor de "iva"=' +
            item['iva'] +
            ' debe ser igual a 0 para "ivaTipo" = ' +
            item['ivaTipo'] +
            ' en data.items[' +
            i +
            '].iva',
        );
      }
    }

    if (item['iva'] == 0) {
      if (item['ivaTipo'] != 2 && item['ivaTipo'] != 3) {
       errors.push(
          '"Iva" = 0 no se admite para "ivaTipo"=' + item['ivaTipo'] + ' proporcionado en data.items[' + i + '].iva',
        );
      }
    }

    if (item['iva'] == 5) {
      if (item['ivaTipo'] != 1 && item['ivaTipo'] != 4) {
       errors.push(
          '"Iva" = 5 no se admite para "ivaTipo"=' + item['ivaTipo'] + ' proporcionado en data.items[' + i + '].iva',
        );
      }
    }

    if (item['iva'] == 10) {
      if (item['ivaTipo'] != 1 && item['ivaTipo'] != 4) {
       errors.push(
          '"Iva" = 10 no se admite para "ivaTipo"=' + item['ivaTipo'] + ' proporcionado en data.items[' + i + '].iva',
        );
      }
    }

    if (!(item['iva'] == 0 || item['iva'] == 5 || item['iva'] == 10)) {
     errors.push('Valor invalido "iva"=' + item['iva'] + ' proporcionado en data.items[' + i + '].iva');
    }

    if (!(item['ivaBase'] >= 0 && item['ivaBase'] <= 100)) {
     errors.push('Valor invalido "ivaBase"=' + item['iva'] + ' proporcionado en data.items[' + i + '].ivaBase');
    }
  }

 
  const  generateDatosItemsOperacionRastreoMercaderiasValidate = (  item, i)  => {
    let regexpXMLHTML = new RegExp('<[^>]*>'); //HTML/XML TAGS

    if (item['registroEntidadComercial'] && (item['registroEntidadComercial'] + '').trim().length > 0) {
      if (
        !(
          (item['registroEntidadComercial'] + '').trim().length >= 1 &&
          (item['registroEntidadComercial'] + '').trim().length <= 20
        )
      ) {
       errors.push(
          'El Número de Registro de la Entidad Comercial del item (' +
            item['registroEntidadComercial'] +
            ') en data.items[' +
            i +
            '].registroEntidadComercial debe tener una longitud entre 1 y 20 caracteres',
        );
      }
      if (regexpXMLHTML.test(item['registroEntidadComercial'])) {
       errors.push(
          'El Número de Registro de la Entidad Comercial del item (' +
            item['registroEntidadComercial'] +
            ') en data.items[' +
            i +
            '].registroEntidadComercial contiene valores inválidos',
        );
      }
    }
  }
 
  const  generateDatosItemsOperacionSectorAutomotoresValidate =(  item, i) => {
    if (!item['sectorAutomotor']) {
      //Como no indica que este campo es obligatorio, si no se informa sale con vacio
      return null;
    }

    if (
      tiposOperacionesVehiculos.filter((um) => um.codigo === item['sectorAutomotor']['tipo']).length ==
      0
    ) {
     errors.push(
        "Tipo de Operación de Documento de Automotor '" +
          item['sectorAutomotor']['tipo'] +
          "' en data.items[" +
          i +
          '].sectorAutomotor.tipo no encontrado. Valores: ' +
          tiposOperacionesVehiculos.map((a) => a.codigo + '-' + a.descripcion),
      );
    }
    if (
      tiposCombustibles.filter((um) => um.codigo === item['sectorAutomotor']['tipoCombustible'])
        .length == 0
    ) {
     errors.push(
        "Tipo de Combustible '" +
          item['sectorAutomotor']['tipoCombustible'] +
          "' en data.items[" +
          i +
          '].sectorAutomotor.tipoCombustible no encontrado. Valores: ' +
          tiposCombustibles.map((a) => a.codigo + '-' + a.descripcion),
      );
    }

    if (item['sectorAutomotor']['chasis']) {
      if (item['sectorAutomotor']['chasis'].length != 17) {
       errors.push(
          "El Chassis '" + item['sectorAutomotor']['chasis'] + "' en data.items[" + i + '] debe tener 17 caracteres',
        );
      }
    }

    if (item['sectorAutomotor']['cilindradas']) {
      if ((item['sectorAutomotor']['cilindradas'] + '').length != 4) {
       errors.push(
          "La Cilindradas '" +
            item['sectorAutomotor']['cilindradas'] +
            "' en data.items[" +
            i +
            '] debe tener 4 caracteres',
        );
      }
    }
  }
 


  module.exports = {
    generateDatosItemsOperacionValidate
  };
  