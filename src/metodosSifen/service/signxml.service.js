const xml2js = require("xml2js");

const { SignedXml } = require("xml-crypto");



const cleanCertificate = cert =>
    cert
      .replace(/-----BEGIN CERTIFICATE-----/g, "")
      .replace(/-----END CERTIFICATE-----/g, "")
      .replace(/(?:\r\n|\r|\n)/g, ""); 



const signXMLEvento = (xml, certificado) => {
    return signEvento(xml, "rEve", certificado);
  };
const signEvento = (xmlString, tag, certificado) => {
  return new Promise(async (resolve, reject) => {
    var dsig = null;
    try {
      const { cert, key, password } = certificado;
      let xmlFirmado = "";

      const sig = new SignedXml({
        publicKey: cert,
        privateKey: key,
        passphrase: password,
        getKeyInfoContent: (publicKey, prefix) => {
          const certContent = cleanCertificate(cert); // Limpiar el certificado
          return `<X509Data><X509Certificate>${certContent}</X509Certificate></X509Data>`;
        }
      });
      console.log(xmlString )
      const jsonXML = await xml2js.parseStringPromise(xmlString, {
        explicitArray: false, // Evita que los valores sean arrays innecesarios
        ignoreAttrs: false // Conserva los atributos XML
      });
      console.log(JSON.stringify(jsonXML, null, 2));

      const idAtributo = jsonXML["env:Envelope"]["env:Body"]["rEnviEventoDe"]["dEvReg"]
      ["gGroupGesEve"]["rGesEve"]["rEve"].$.Id;

      sig.addReference(
        /*"#" + idAtributo, */ {
          xpath: "//*[local-name()='" + tag + "']",
          digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
          transforms: [
            "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
            "http://www.w3.org/2001/10/xml-exc-c14n#"
          ]
        }
      );
      sig.signatureAlgorithm =
        "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"; // Algoritmo de firma RSA con SHA-256
      sig.canonicalizationAlgorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";

      // Calcular la firma
      sig.computeSignature(xmlString, {
        location: {
          reference: "//*[local-name()='" + tag + "']",
          action: "after"
        }
      });

      // Obtener la firma en formato XML
      const xmlWithSignature = sig.getSignedXml();

      xmlFirmado += xmlWithSignature;

      resolve(xmlFirmado);
    } catch (e) {
      console.error(e);
      reject(e);
    } finally {
      if (dsig != null) {
        //dsig.closeSession();
      }
    }
  });
};
const signXML = (xml, certificado) => {
  return signDocument(xml, "DE", certificado);
};
 
const signDocument = (xmlString, tag, certificado) => {
  return new Promise(async (resolve, reject) => {
    var dsig = null;
    try {
      const { cert, key, password } = certificado;
 
      let xmlFirmado = "";

      const sig = new SignedXml({
        publicKey: cert,
        privateKey: key,
        passphrase: password,
        getKeyInfoContent: (publicKey, prefix) => {
          const certContent = cleanCertificate(cert); // Limpiar el certificado
          return `<X509Data><X509Certificate>${certContent}</X509Certificate></X509Data>`;
        }
      });

      const jsonXML = await xml2js.parseStringPromise(xmlString);
      const idAtributo = jsonXML.rDE[tag][0].$.Id;

      sig.addReference(
        /*"#" + idAtributo, */ {
          xpath: "//*[local-name()='" + tag + "']",
          digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
          transforms: [
            "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
            "http://www.w3.org/2001/10/xml-exc-c14n#"
          ]
        }
      );
      sig.signatureAlgorithm =
        "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"; // Algoritmo de firma RSA con SHA-256
      sig.canonicalizationAlgorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";

      // Calcular la firma 
      sig.computeSignature(xmlString, {
        location: {
          reference: `//*[local-name()='${tag}']`,
          action: "after", 
        },
      });


      // Obtener la firma en formato XML
      const xmlWithSignature = sig.getSignedXml();

      xmlFirmado += xmlWithSignature;

      resolve(xmlFirmado);
    } catch (e) {
      console.error(e);
      reject(e);
    } finally {
      if (dsig != null) {
        //dsig.closeSession();
      }
    }
  });
};

 

module.exports = {
    signXML,signXMLEvento ,cleanCertificate
  };
