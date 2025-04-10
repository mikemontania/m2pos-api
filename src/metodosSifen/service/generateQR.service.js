const xml2js = require("xml2js");
const crypto = require("crypto");

const generateQR = (xml, idCSC, CSC) => {
  return xml2js.parseStringPromise(xml).then(obj => {
    if (
      !(obj && obj["rDE"] && obj["rDE"]["Signature"] && obj["rDE"]["Signature"])
    ) {
      throw new Error("XML debe estar firmado digitalmente");
    }
    obj["rDE"]["gCamFuFD"] = {};

    let qrLink = process.env.EKUATIA_URL;

    let qr = ""; 
    qr += "nVersion=" + process.env.EKUATIA_VERSION + "&";

    const id = obj["rDE"]["DE"][0]["$"]["Id"];
    qr += "Id=" + id + "&";

    let dFeEmiDE = obj["rDE"]["DE"][0]["gDatGralOpe"][0]["dFeEmiDE"][0];
    dFeEmiDE = Buffer.from(dFeEmiDE, "utf8").toString("hex");
    qr += "dFeEmiDE=" + dFeEmiDE + "&";

    let dRucRec = "";
    if (
      obj["rDE"]["DE"][0]["gDatGralOpe"][0]["gDatRec"][0]["iNatRec"][0] == 1
    ) {
      //Contribuyente
      dRucRec =
        obj["rDE"]["DE"][0]["gDatGralOpe"][0]["gDatRec"][0]["dRucRec"][0];
      qr += "dRucRec=" + dRucRec + "&";
    } else {
      //No contribuyente
      dRucRec =
        obj["rDE"]["DE"][0]["gDatGralOpe"][0]["gDatRec"][0]["dNumIDRec"][0];

      qr += "dNumIDRec=" + dRucRec + "&";
    }

    let dTotGralOpe = 0;
    if (
      obj["rDE"]["DE"][0]["gTotSub"] &&
      obj["rDE"]["DE"][0]["gTotSub"][0] &&
      obj["rDE"]["DE"][0]["gTotSub"][0]["dTotGralOpe"] &&
      obj["rDE"]["DE"][0]["gTotSub"][0]["dTotGralOpe"][0]
    ) {
      dTotGralOpe = obj["rDE"]["DE"][0]["gTotSub"][0]["dTotGralOpe"][0];
    }
    qr += "dTotGralOpe=" + dTotGralOpe + "&";

    let dTotIVA = 0;
    if (
      obj["rDE"]["DE"][0]["gTotSub"] &&
      obj["rDE"]["DE"][0]["gTotSub"][0] &&
      obj["rDE"]["DE"][0]["gTotSub"][0]["dTotIVA"] &&
      obj["rDE"]["DE"][0]["gTotSub"][0]["dTotIVA"][0]
    ) {
      dTotIVA = obj["rDE"]["DE"][0]["gTotSub"][0]["dTotIVA"][0];
    }
    qr += "dTotIVA=" + dTotIVA + "&";

    let cItems = 0;
    if (
      obj["rDE"]["DE"][0]["gDtipDE"][0] &&
      obj["rDE"]["DE"][0]["gDtipDE"][0]["gCamItem"] &&
      obj["rDE"]["DE"][0]["gDtipDE"][0]["gCamItem"].length > 0
    ) {
      cItems = obj["rDE"]["DE"][0]["gDtipDE"][0]["gCamItem"].length;
    }

    qr += "cItems=" + cItems + "&";

    let digestValue =
      obj["rDE"]["Signature"][0]["SignedInfo"][0]["Reference"][0][
        "DigestValue"
      ][0];
    digestValue = Buffer.from(digestValue, "utf8").toString("hex");
    qr += "DigestValue=" + digestValue + "&";

    qr += "IdCSC=" + idCSC;

    const valueForHash = qr;
 let valueHashed = crypto
      .createHash("sha256")
      .update(valueForHash + CSC)
      .digest("hex");


    qr += "&cHashQR=" + valueHashed;

    obj["rDE"]["gCamFuFD"]["dCarQR"] = {
      _: qrLink + qr
    };
    let builder = new xml2js.Builder({
        renderOpts: { pretty: false }, // Evita espacios innecesarios
        headless: true, // No agrega la declaración XML al inicio
        explicitArray: false, // Evita que los valores sean envueltos en arrays innecesarios
      });
      let xmlWithQR = builder.buildObject(obj);
    return xmlWithQR;
  });
};
module.exports = { generateQR };
