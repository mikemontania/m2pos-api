const NumeroALetra = {
  UNIDADES: [
    "",
    "un ",
    "dos ",
    "tres ",
    "cuatro ",
    "cinco ",
    "seis ",
    "siete ",
    "ocho ",
    "nueve "
  ],
  DECENAS: [
    "diez ",
    "once ",
    "doce ",
    "trece ",
    "catorce ",
    "quince ",
    "dieciseis ",
    "diecisiete ",
    "dieciocho ",
    "diecinueve",
    "veinte ",
    "treinta ",
    "cuarenta ",
    "cincuenta ",
    "sesenta ",
    "setenta ",
    "ochenta ",
    "nodocumento "
  ],
  CENTENAS: [
    "",
    "ciento ",
    "doscientos ",
    "trecientos ",
    "cuatrocientos ",
    "quinientos ",
    "seiscientos ",
    "setecientos ",
    "ochocientos ",
    "novecientos "
  ],

  convertir: function(valor, mayusculas) {
    let literal = "";
    let parteDecimal;
    let numero = valor.toString();
    numero = numero.replace(".", ",");
    if (numero.indexOf(",") === -1) {
      numero = numero + ",00";
    }

    if (/^\d{1,9},\d{1,2}$/.test(numero)) {
      const Num = numero.split(",");
      parteDecimal = "";

      if (parseInt(Num[0]) === 0) {
        literal = "cero ";
      } else if (parseInt(Num[0]) > 999999) {
        literal = this.getMillones(Num[0]);
      } else if (parseInt(Num[0]) > 999) {
        literal = this.getMiles(Num[0]);
      } else if (parseInt(Num[0]) > 99) {
        literal = this.getCentenas(Num[0]);
      } else if (parseInt(Num[0]) > 9) {
        literal = this.getDecenas(Num[0]);
      } else {
        literal = this.getUnidades(Num[0]);
      }

      if (mayusculas) {
        return (literal + parteDecimal).toUpperCase();
      } else {
        return literal + parteDecimal;
      }
    } else {
      return literal;
    }
  },

  getUnidades: function(numero) {
    let num = numero.substring(numero.length - 1);
    return this.UNIDADES[parseInt(num)];
  },

  getDecenas: function(num) {
    let n = parseInt(num);
    if (n < 10) {
      return this.getUnidades(num);
    } else if (n > 19) {
      let u = this.getUnidades(num);
      if (u === "") {
        return this.DECENAS[parseInt(num.substring(0, 1)) + 8];
      } else {
        return this.DECENAS[parseInt(num.substring(0, 1)) + 8] + "y " + u;
      }
    } else {
      return this.DECENAS[n - 10];
    }
  },

  getCentenas: function(num) {
    if (parseInt(num) > 99) {
      if (parseInt(num) === 100) {
        return " cien ";
      } else {
        return (
          this.CENTENAS[parseInt(num.substring(0, 1))] +
          this.getDecenas(num.substring(1))
        );
      }
    } else {
      return this.getDecenas(parseInt(num) + "");
    }
  },

  getMiles: function(numero) {
    let c = numero.substring(numero.length - 3);
    let m = numero.substring(0, numero.length - 3);
    let n = "";

    if (parseInt(m) > 0) {
      n = this.getCentenas(m);
      return n + "mil " + this.getCentenas(c);
    } else {
      return "" + this.getCentenas(c);
    }
  },

  getMillones: function(numero) {
    let miles = numero.substring(numero.length - 6);
    let millon = numero.substring(0, numero.length - 6);
    let n = "";
    let millonValue = parseInt(millon);

    if (millonValue > 1) {
      n = this.getCentenas(millon) + "millones ";
    } else {
      n = this.getUnidades(millon) + "millon ";
    }

    return n + this.getMiles(miles);
  }
};

module.exports = { NumeroALetra };
