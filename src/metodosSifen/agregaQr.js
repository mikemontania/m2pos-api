const { parseStringPromise, Builder } = require("xml2js");
const crypto = require("crypto");
require("dotenv").config();

// Función para generar un código QR a partir de un XML
const agregaQr = async (xml, idCSC, CSC) => {
  try {
    let qr = ""; // Inicializa la cadena para almacenar el contenido del código QR
   // console.log("Original XML:", xml); // Muestra el XML original para depuración

    // Convierte el XML a un objeto JavaScript utilizando xml2js
    const obj = await parseStringPromise(xml);
    console.log("Parsed XML Object:", obj); // Muestra el objeto XML convertido para depuración

    // Verifica si el XML contiene una firma digital
    if (
      !(obj && obj["rDE"] && obj["rDE"]["Signature"] && obj["rDE"]["Signature"])
    ) {
      throw new Error("XML debe estar firmado digitalmente");
    }
    obj["rDE"]["gCamFuFD"] = {};
    qr += process.env.EKUATIA_URL || "";
    qr += "nVersion=" + (process.env.EKUATIA_VERSION || "") + "&amp;";

    // Obtiene el ID del documento electrónico
    const id = obj["rDE"]["DE"][0]["$"]["Id"];
    qr += "Id=" + id + "&amp;"; // Agrega el ID al contenido del QR

    // Obtiene la fecha de emisión y la convierte a formato hexadecimal
    let dFeEmiDE = obj["rDE"]["DE"][0]["gDatGralOpe"][0]["dFeEmiDE"][0];
    dFeEmiDE = Buffer.from(dFeEmiDE, "utf8").toString("hex");
    qr += "dFeEmiDE=" + dFeEmiDE + "&amp;"; // Agrega la fecha de emisión al contenido del QR

    // Determina el tipo de receptor y agrega el número de identificación
    let dRucRec = "";
    if (
      obj["rDE"]["DE"][0]["gDatGralOpe"][0]["gDatRec"][0]["iNatRec"][0] == 1
    ) {
      // Si el receptor es un contribuyente
      dRucRec =
        obj["rDE"]["DE"][0]["gDatGralOpe"][0]["gDatRec"][0]["dRucRec"][0];
      qr += "dRucRec=" + dRucRec + "&amp;"; // Agrega el RUC del receptor al contenido del QR
    } else {
      // Si el receptor no es un contribuyente
      dRucRec =
        obj["rDE"]["DE"][0]["gDatGralOpe"][0]["gDatRec"][0]["dNumIDRec"][0];
      qr += "dNumIDRec=" + dRucRec + "&amp;"; // Agrega el número de identificación del receptor al contenido del QR
    }

    // Obtiene el total general de operaciones, si está disponible
    let dTotGralOpe = 0;
    if (
      obj["rDE"]["DE"][0]["gTotSub"] &&
      obj["rDE"]["DE"][0]["gTotSub"][0] &&
      obj["rDE"]["DE"][0]["gTotSub"][0]["dTotGralOpe"] &&
      obj["rDE"]["DE"][0]["gTotSub"][0]["dTotGralOpe"][0]
    ) {
      dTotGralOpe = obj["rDE"]["DE"][0]["gTotSub"][0]["dTotGralOpe"][0];
    }
    qr += "dTotGralOpe=" + dTotGralOpe + "&amp;"; // Agrega el total general de operaciones al contenido del QR

    // Obtiene el total de IVA, si está disponible
    let dTotIVA = 0;
    if (
      obj["rDE"]["DE"][0]["gTotSub"] &&
      obj["rDE"]["DE"][0]["gTotSub"][0] &&
      obj["rDE"]["DE"][0]["gTotSub"][0]["dTotIVA"] &&
      obj["rDE"]["DE"][0]["gTotSub"][0]["dTotIVA"][0]
    ) {
      dTotIVA = obj["rDE"]["DE"][0]["gTotSub"][0]["dTotIVA"][0];
    }
    qr += "dTotIVA=" + dTotIVA + "&amp;"; // Agrega el total de IVA al contenido del QR

    // Obtiene la cantidad de ítems en el documento
    let cItems = 0;
    if (
      obj["rDE"]["DE"][0]["gDtipDE"][0] &&
      obj["rDE"]["DE"][0]["gDtipDE"][0]["gCamItem"] &&
      obj["rDE"]["DE"][0]["gDtipDE"][0]["gCamItem"].length > 0
    ) {
      cItems = obj["rDE"]["DE"][0]["gDtipDE"][0]["gCamItem"].length;
    }
    qr += "cItems=" + cItems + "&amp;"; // Agrega la cantidad de ítems al contenido del QR

    // Obtiene el valor del digest de la firma digital y lo convierte a hexadecimal
    let digestValue =
      obj["rDE"]["Signature"][0]["SignedInfo"][0]["Reference"][0][
        "DigestValue"
      ][0];
    digestValue = Buffer.from(digestValue, "utf8").toString("hex");
    qr += "DigestValue=" + digestValue + "&amp;"; // Agrega el digest de la firma digital al contenido del QR

    // Agrega el ID de CSC y el CSC al contenido del QR
    qr += "IdCSC=" + idCSC;

    const valueForHash = qr;
    const valueHashed = crypto
      .createHash("sha256")
      .update(valueForHash + CSC)
      .digest("hex");
    qr += "&amp;cHashQR=" + valueHashed;

    const qrEncoded = qr; //.replace(/&/g, '&amp;');
    obj["rDE"]["gCamFuFD"]["dCarQR"] = qrEncoded;

    // Construye el nuevo XML con el código QR incluido
    const builder = new Builder();
    const newXMlConQr = builder.buildObject(obj); 
const resultado = cargarQr(xml,qr)
console.log(resultado)
    return resultado; // Devuelve el nuevo XML
  } catch (error) {
    console.error("Error generating QR:", error.message); // Muestra el error si ocurre alguno
    throw new Error("Error generating QR: " + error.message); // Lanza una excepción con el mensaje de error
  }
};


const cargarQr = (xmlString, qr) =>{ 
  const qrvacio = "****************************************************************************************************"
  // Realizar el reemplazo usando la expresión regular 
  return xmlString.replace(qrvacio, qr);
}
 

module.exports = { agregaQr};
