const { defaultConfig } = require("./config");
const { 
  paises,
  relevanciasMercaderias,
  codigosAfectaciones
} = require("./constants.service");
const { leftZero } = require("./util");
 

const generateDatosItemsOperacion = (data, items) => {
  const jsonResult = [];

  //Recorrer array de infoCuotas e informar en el JSON
  if (items && items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      console.log(item);
      const gCamItem = {
        dCodInt: item.codigo
      };

      if (item["partidaArancelaria"]) {
        gCamItem["dParAranc"] = item["partidaArancelaria"];
      }

      if (item["ncm"]) {
        gCamItem["dNCM"] = item["ncm"];
      }

      if (data.tipoOperacion && data.tipoOperacion === 3) {
        gCamItem["dDncpG"] = leftZero(item["dncp"]["codigoNivelGeneral"], 8);
        gCamItem["dDncpE"] = item["dncp"]["codigoNivelEspecifico"];
      }

      if (data.tipoOperacion && data.tipoOperacion === 3) {
        if (item["dncp"]["codigoGtinProducto"]) {
          gCamItem["dGtin"] = item["dncp"]["codigoGtinProducto"];
        }
        if (item["dncp"]["codigoNivelPaquete"]) {
          gCamItem["dGtinPq"] = item["dncp"]["codigoNivelPaquete"];
        }
      }

      gCamItem["dDesProSer"] = item["descripcion"]; // RG 24/2019
      gCamItem["cUniMed"] = 77;
      gCamItem["dDesUniMed"] = "UNI";
      gCamItem["dCantProSer"] = item.cantidad;

      if (item["pais"]) {
        gCamItem["cPaisOrig"] = "PRY";
        gCamItem["dDesPaisOrig"] = paises.filter(
          pais => pais.codigo === "PRY"
        )[0]["descripcion"];
      }

      if (item["observacion"] && (item["observacion"] + "").trim().length > 0) {
        gCamItem["dInfItem"] = (item["observacion"] + "").trim();
      }

      if (data.tipoDocumento === 7) {
        if (item["tolerancia"]) {
          gCamItem["cRelMerc"] = item["tolerancia"];
          gCamItem["dDesRelMerc"] = relevanciasMercaderias.filter(
            um => um.codigo === item["tolerancia"]
          )[0]["descripcion"];
          if (item["toleranciaCantidad"]) {
            gCamItem["dCanQuiMer"] = item["toleranciaCantidad"];
          }

          if (item["toleranciaPorcentaje"]) {
            gCamItem["dPorQuiMer"] = item["toleranciaPorcentaje"];
          }
        }
      }

      //Tratamiento E719. Tiene relacion con generateDatosGeneralesInherentesOperacion
      if (data.tipoDocumento == 1 || data.tipoDocumento == 4) {
        //if (data['tipoTransaccion'] === 9) {
        if (item["cdcAnticipo"]) {
          gCamItem["dCDCAnticipo"] = item["cdcAnticipo"];
        }
        //}
      }

      if (data.tipoDocumento != 7) {
        //Oblitatorio informar
        gCamItem[
          "gValorItem"
        ] = generateDatosItemsOperacionPrecioTipoCambioTotal(data, item);
      }

      if (
        data["tipoImpuesto"] == 1 ||
        data["tipoImpuesto"] == 3 ||
        data["tipoImpuesto"] == 4 ||
        data["tipoImpuesto"] == 5
      ) {
        if (data.tipoDocumento != 4 && data.tipoDocumento != 7) {
          gCamItem["gCamIVA"] = generateDatosItemsOperacionIVA(item, {
            ...gCamItem
          });
        }
      }
 
      jsonResult.push(gCamItem);
    } //end-for

    //Verificacion de Totales de Descuento Global y Anticipo
    //Con los prorrateos pueden haber diferencias
    //Las diferencias se corrigen en el ultimo item

    let totalDescuentoGlobal = 0;
    let totalAnticipoGlobal = 0;
    if (data.descuentoGlobal > 0 || data.anticipoGlobal > 0) {
      for (let i = 0; i < jsonResult.length; i++) {
        const gCamItem = jsonResult[i];

        if (data.descuentoGlobal) {
          totalDescuentoGlobal +=
            gCamItem["dCantProSer"] *
            gCamItem["gValorItem"]["gValorRestaItem"]["dDescGloItem"];
        }

        if (data.anticipoGlobal) {
          totalAnticipoGlobal +=
            gCamItem["dCantProSer"] *
            gCamItem["gValorItem"]["gValorRestaItem"]["dAntGloPreUniIt"];
        }
      }

      if (data.descuentoGlobal > 0) {
        if (data.descuentoGlobal != totalDescuentoGlobal) {
          console.log(
            "hay una diferencia",
            data.descuentoGlobal,
            totalDescuentoGlobal
          );
        }
      }
      if (data.anticipoGlobal > 0) {
        if (data.anticipoGlobal != totalDescuentoGlobal) {
          console.log(
            "hay una diferencia",
            data.anticipoGlobal,
            totalAnticipoGlobal
          );
        }
      }
    }
  }
  let detalle = {};
  detalle["gCamItem"] = jsonResult;
  return detalle;
};

/**
   * E8.1. Campos que describen el precio, tipo de cambio y valor total de la operación por ítem (E720-E729)
   */
const generateDatosItemsOperacionPrecioTipoCambioTotal = (data, item) => {
  const jsonResult = {};

  //Mejor no tocar como el usuario envia desde el JSON
  jsonResult["dPUniProSer"] = item.importePrecio;

  jsonResult["dTotBruOpeItem"] =
    parseFloat(jsonResult["dPUniProSer"]) * parseFloat(item.cantidad);
  //console.log("dTotBruOpeItem 1", jsonResult['dTotBruOpeItem']);
  if (defaultConfig.sum0_000001SuffixBeforeToFixed == true) {
    jsonResult["dTotBruOpeItem"] += 0.000001;
  }
  jsonResult["dTotBruOpeItem"] = parseFloat(
    jsonResult["dTotBruOpeItem"].toFixed(defaultConfig.decimals)
  );
  //console.log("dTotBruOpeItem 2", jsonResult['dTotBruOpeItem']);

  if (data.moneda === "PYG") {
    jsonResult["dTotBruOpeItem"] = parseFloat(
      jsonResult["dTotBruOpeItem"].toFixed(defaultConfig.pygDecimals)
    );
  }

  jsonResult[
    "gValorRestaItem"
  ] = generateDatosItemsOperacionDescuentoAnticipoValorTotal(data, item);

  return jsonResult;
};

/**
   * E8.1.1 Campos que describen los descuentos, anticipos y valor total por ítem (EA001-EA050)
  
   */
const generateDatosItemsOperacionDescuentoAnticipoValorTotal = (data, item) => {
  const jsonResult = {};

  jsonResult["dDescItem"] = 0;
  if (item["importeDescuento"] && +item["importeDescuento"] > 0) {
    //El descuento por item se pasa asi mismo como viene en el JSON, sin redondeos, igual al precio
    jsonResult["dDescItem"] = item["importeDescuento"];
    //FacturaSend calcula solo el % Descuento, no hace falta informar
    jsonResult["dPorcDesIt"] = Math.round( parseFloat(item["importeDescuento"]) * 100 / parseFloat(item.importePrecio) );
  }
 
  jsonResult["dDescGloItem"] = 0;
  if (data.descuentoGlobal && +data.descuentoGlobal > 0) {
    let subtotal = item.cantidad * item.importePrecio;
    let pesoPorc = 100 * subtotal / data.importeSubtotal;
    let descuentoGlobalAplicado = data.descuentoGlobal * pesoPorc / 100;
    let descuentoGlobalUnitario = descuentoGlobalAplicado / item.cantidad;

    jsonResult["dDescGloItem"] = parseFloat(
      descuentoGlobalUnitario + 0
    ).toFixed(8); //Deja en el maximo permitido para que el calculo al final salga exacto
  }

  jsonResult["dAntPreUniIt"] = 0;
  if (item.anticipo && +item.anticipo > 0) {
    jsonResult["dAntPreUniIt"] = parseFloat(item.anticipo).toFixed(
      defaultConfig.decimals
    );
    if (data.moneda === "PYG") {
      jsonResult["dAntPreUniIt"] = parseFloat(
        jsonResult["dAntPreUniIt"]
      ).toFixed(defaultConfig.pygDecimals);
    }
  }

  jsonResult["dAntGloPreUniIt"] = 0;
  if (data.anticipoGlobal && +data.anticipoGlobal > 0) {
    let subtotal = item.cantidad * item.importePrecio;
    let pesoPorc = 100 * subtotal / totalGeneral;
    let anticipoGlobalAplicado = data.anticipoGlobal * pesoPorc / 100;
    let anticipoGlobalUnitario = anticipoGlobalAplicado / item.cantidad;

    jsonResult["dAntGloPreUniIt"] = parseFloat(
      anticipoGlobalUnitario + ""
    ).toFixed(8); //Analizar si no es mejor dejar defaultConfig.decimals

    if (data.moneda === "PYG") {
      jsonResult["dAntGloPreUniIt"] = parseFloat(
        jsonResult["dAntGloPreUniIt"]
      ).toFixed(defaultConfig.pygDecimals);
    }
  }

  if (
    data["tipoImpuesto"] == 1 ||
    data["tipoImpuesto"] == 3 ||
    data["tipoImpuesto"] == 4 ||
    data["tipoImpuesto"] == 5
  ) {
    const precioUnitarioConDescuentoAplicado =
      parseFloat(item.importePrecio) -
      parseFloat(jsonResult["dDescItem"] || 0) -
      parseFloat(jsonResult["dDescGloItem"] || 0) -
      parseFloat(jsonResult["dAntPreUniIt"] || 0) -
      parseFloat(jsonResult["dAntGloPreUniIt"] || 0);

    jsonResult["dTotOpeItem"] =
      parseFloat(precioUnitarioConDescuentoAplicado + "") *
      parseFloat(item.cantidad);

    if (defaultConfig.sum0_000001SuffixBeforeToFixed == true) {
      jsonResult["dTotOpeItem"] += 0.000001;
    }

    if (jsonResult["dDescGloItem"] == 0) {
      // Cuando no hay descuento Global por item, entonces utiliza los redondeos establecidos en config, para el dTotOpeItem
      jsonResult["dTotOpeItem"] = parseFloat(
        jsonResult["dTotOpeItem"].toFixed(defaultConfig.decimals)
      );

      if (data.moneda === "PYG") {
        jsonResult["dTotOpeItem"] = parseFloat(
          jsonResult["dTotOpeItem"].toFixed(defaultConfig.pygDecimals)
        );
      }
    } else {
      // Cuando hay descuento Global por item, entonces utiliza el maximo permitido para que el calculo al final salga exacto.
      jsonResult["dTotOpeItem"] = parseFloat(
        jsonResult["dTotOpeItem"].toFixed(8)
      );
    }
  }
  if (data.tipoDocumento == 4) {
    //Si es Autofactura
    jsonResult["dTotOpeItem"] =
      parseFloat(item.importePrecio) * parseFloat(item.cantidad);

    jsonResult["dTotOpeItem"] = parseFloat(
      jsonResult["dTotOpeItem"].toFixed(defaultConfig.decimals)
    );
    if (data.moneda === "PYG") {
      jsonResult["dTotOpeItem"] = parseFloat(
        jsonResult["dTotOpeItem"].toFixed(defaultConfig.pygDecimals)
      );
    }
  }

  return jsonResult;
};

/**
   * E8.2. Campos que describen el IVA de la operación por ítem (E730-E739) 
   */
const generateDatosItemsOperacionIVA = (item, gCamItem) => {
  console.log(item);
  const afectacion = codigosAfectaciones.find( ca => ca.codigo === +item.ivaTipo );
  console.log(afectacion);
  const jsonResult = {
    iAfecIVA: item.ivaTipo, //E731
    dDesAfecIVA: afectacion.descripcion,
    dPropIVA: item.ivaBase, //E733
    dTasaIVA: +item.porcIva //E734
  };

  /*  Calculo para E735
      Si E731 = 1 o 4 este campo es igual al resultado del cálculo 
          [EA008 * (E733/100)] / 1,1 si la tasa es del 10% 
          [EA008 * (E733/100)] / 1,05 si la tasa es del 5%
      Si E731 = 2 o 3 este campo es igual 0
  */

  jsonResult["dBasGravIVA"] = 0; //Valor por defecto
  if (item.ivaTipo == 1 || item.ivaTipo == 4) {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Antes de NT13 -- esta opcion esta deprecada, valida solo hasta el 21/05/2023
    if (item.porcIva == 10) {
      jsonResult["dBasGravIVA"] =
        gCamItem["gValorItem"]["gValorRestaItem"]["dTotOpeItem"] *
        (item.ivaBase / 100) /
        1.1;
    }
    if (item.porcIva == 5) {
      jsonResult["dBasGravIVA"] =
        gCamItem["gValorItem"]["gValorRestaItem"]["dTotOpeItem"] *
        (item.ivaBase / 100) /
        1.05;
    }

    if (defaultConfig.test == true) {
      // En ambiente de test desde 21/04/2023 hasta 21/05/2023
      // Aplicando NT13
      //-------------------------------------------------------------
      /**
      * Cambios en NT13
        Si E731 = 1 o 4 este campo es igual al resultado del cálculo:
          [100 * EA008 * E733] / [10000 + (E734 * E733)]

        Si E731 = 2 o 3 este campo es igual 0
      */
      if (new Date().getTime() >= new Date("2023-04-21").getTime()) {
        jsonResult["dBasGravIVA"] =
          100 *
          gCamItem["gValorItem"]["gValorRestaItem"]["dTotOpeItem"] *
          item.ivaBase /
          (10000 + item.porcIva * item.ivaBase);
      }
    }

    //Vigencia en Test y Produccion
    if (new Date().getTime() >= new Date("2023-06-17").getTime()) {
      //Si la fecha de hoy ya supera el plazo de entrada en vigor ya no importa, utiliza la nueva forma.
      /**
      * Cambios en NT13
        Si E731 = 1 o 4 este campo es igual al resultado del cálculo:
          [100 * EA008 * E733] / [10000 + (E734 * E733)]

        Si E731 = 2 o 3 este campo es igual 0
      */
      jsonResult["dBasGravIVA"] =
        100 *
        gCamItem["gValorItem"]["gValorRestaItem"]["dTotOpeItem"] *
        item.ivaBase /
        (10000 + item.porcIva * item.ivaBase);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Redondeo inicial a 2 decimales
    if (jsonResult["dBasGravIVA"]) {
      jsonResult["dBasGravIVA"] = parseFloat(
        jsonResult["dBasGravIVA"].toFixed(defaultConfig.partialTaxDecimals)
      ); //Calculo intermedio, usa max decimales de la SET.
    }
  }

  /* 
    Calculo para E736
    Corresponde al cálculo aritmético:
    E735 * ( E734 / 100 )
    Si E731 = 2 o 3 este campo es igual 0 
  */
  jsonResult["dLiqIVAItem"] = 0;
  if (item.ivaTipo == 1 || item.ivaTipo == 4) {
    jsonResult["dLiqIVAItem"] =
      jsonResult["dBasGravIVA"] * item.porcIva / 100;

    //Redondeo
    jsonResult["dLiqIVAItem"] = parseFloat(
      jsonResult["dLiqIVAItem"].toFixed(defaultConfig.partialTaxDecimals)
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (defaultConfig.test == true) {
    //Ambiente de test de la SET
    if (new Date().getTime() >= new Date("2023-04-21").getTime()) {
      //Esta parte debe entrar en vigor en produccion a partir de 21/05/2023
      //Calculo para E737, aparecio en la NT13
      jsonResult["dBasExe"] = 0; //Valor por defecto E737
      if (item.ivaTipo == 4) {
        //E731 == 4

        // Aplicando NT13
        //-------------------------------------------------------------
        /**
          Si E731 = 4 este campo es igual al resultado del cálculo:
          [100 * EA008 * (100 – E733)] / [10000 + (E734 * E733)]
          Si E731 = 1 , 2 o 3 este campo es igual 0 
        */

        jsonResult["dBasExe"] =
          100 *
          gCamItem["gValorItem"]["gValorRestaItem"]["dTotOpeItem"] *
          (100 - item.ivaBase) /
          (10000 + item.porcIva * item.ivaBase);

        //Redondeo inicial a 2 decimales
        if (jsonResult["dBasExe"]) {
          jsonResult["dBasExe"] = parseFloat(
            jsonResult["dBasExe"].toFixed(defaultConfig.partialTaxDecimals)
          ); //Calculo intermedio, usa max decimales de la SET.
        }
      }
    }
  }

  //Vigencia en test y produccion
  if (new Date().getTime() >= new Date("2023-06-17").getTime()) {
    //No importando si es test o produccion, luego del plazo de entrada en vigor en produccion ya aplica igualmente.
    jsonResult["dBasExe"] = 0; //Valor por defecto E737
    if (item.ivaTipo == 4) {
      //E731 == 4

      // Aplicando NT13
      //-------------------------------------------------------------
      /**
        Si E731 = 4 este campo es igual al resultado del cálculo:
        [100 * EA008 * (100 – E733)] / [10000 + (E734 * E733)]
        Si E731 = 1 , 2 o 3 este campo es igual 0 
      */

      jsonResult["dBasExe"] =
        100 *
        gCamItem["gValorItem"]["gValorRestaItem"]["dTotOpeItem"] *
        (100 - item.ivaBase) /
        (10000 + item.porcIva * item.ivaBase);

      //Redondeo inicial a 2 decimales
      if (jsonResult["dBasExe"]) {
        jsonResult["dBasExe"] = parseFloat(
          jsonResult["dBasExe"].toFixed(defaultConfig.partialTaxDecimals)
        ); //Calculo intermedio, usa max decimales de la SET.
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  return jsonResult;
};

module.exports = {
  generateDatosItemsOperacion
};
