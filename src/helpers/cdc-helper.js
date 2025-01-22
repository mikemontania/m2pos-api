const generarCDC = (iTiDE, dRucEm , comprobante,iTipCont, dFeEmiDE, iTipEmi, dCodSeg) => {
  console.log("iTiDE, dRucEm , comprobante,iTipCont, dFeEmiDE, iTipEmi, dCodSeg")
  console.log(iTiDE, dRucEm , comprobante,iTipCont, dFeEmiDE, iTipEmi, dCodSeg)
    const cdcBase = '0' + iTiDE + dRucEm.replaceAll("-", "") + comprobante.replaceAll("-", "") +  iTipCont+ dFeEmiDE.substring(0, 10).replaceAll("-", "") + iTipEmi + dCodSeg;
    const dDVId = calcularDV(cdcBase);
    return cdcBase + dDVId;
}
const calcularDV = (numero ) =>{
    console.log('CALCULANDO DIGITO');
    const BASEMAX = 11;
    let codigo;
    let numeroAl = '';
    let caracterHasta = 0;
    let k = 2;
    let total = 0;
    // Cambia la ultima letra por ascii en caso que la cedula termine en letra
    for (let index = 0; index < numero.length; index++) {
      caracterHasta = (index + 1);
      let caracter = numero.substring(index, caracterHasta);
      codigo = caracter.toLocaleUpperCase().charCodeAt(0);
      if (!(codigo >= 48 && codigo <= 57)) {
        numeroAl = numeroAl.concat(codigo.toString());
      } else {
        numeroAl = numeroAl.concat(caracter.toString());
      } 
    }
    for (let i = numeroAl.length - 1; i >= 0; i--) {
      if (k > BASEMAX) {
        k = 2;
      }
      let numeroAux = +numeroAl.substr(i, 1);
      total = total + (numeroAux * k);
      k = k + 1;
    }

    const resto = (total % BASEMAX);
    if (resto > 1) {
      console.log('DIGITO:', (BASEMAX - resto));
      return (11 - resto);
    } else {
      console.log('DIGITO:', 0);
      return 0;
    }
  }
  const  generarCodigoSeguridad = () => {
    // Genera un número aleatorio entre 1 y 999999999
    let codigoSeguridad = Math.floor(Math.random() * 999999999) + 1;

    // Convierte el número a una cadena y completa con ceros a la izquierda si tiene menos de 9 dígitos
    return codigoSeguridad.toString().padStart(9, '0');
}
module.exports = {
    generarCDC,
    generarCodigoSeguridad
};
