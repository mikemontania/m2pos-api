const fs = require("fs");
const forge = require("node-forge"); 
const { decryptPassphrase } = require("../helpers/encript-helper");
const { SignedXml } = require("xml-crypto");
const agregarFirmaXml = async (xmlData, certificado) => {
  try {
    const { cert, key, password } = certificado;



    console.log('xmlData =',xmlData )
    console.log('certificado =',{ cert, key, password } )
    // Función para limpiar el certificado (eliminar delimitadores y saltos de línea)
    const cleanCertificate = cert =>
      cert
        .replace(/-----BEGIN CERTIFICATE-----/g, "")
        .replace(/-----END CERTIFICATE-----/g, "")
        .replace(/(?:\r\n|\r|\n)/g, ""); // Eliminar saltos de línea

    const sig = new SignedXml({
      publicKey: cert,
      privateKey: key,
      passphrase: password,
      getKeyInfoContent: (publicKey, prefix) => {
        const certContent = cleanCertificate(cert); // Limpiar el certificado
        return `<X509Data><X509Certificate>${certContent}</X509Certificate></X509Data>`;
      }
    });

    // Verifica que el XML de entrada es el correcto
    //console.log("XML de entrada:", xmlData);


    sig.addReference(
      /*"#" + idAtributo, */ {
        xpath: "//*[local-name()='DE']",
        digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
        transforms: [
          "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
          "http://www.w3.org/2001/10/xml-exc-c14n#"
          //"http://www.w3.org/2000/09/xmldsig#enveloped-signature",
         // "http://www.w3.org/2001/10/xml-exc-c14n#",
        ],
      });
      sig.canonicalizationAlgorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
     // sig.canonicalizationAlgorithm = "http://www.w3.org/2001/10/xml-exc-c14n#WithComments";
      sig.signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";  
    // Calcular la firma
    sig.computeSignature(xmlData, {
      location: {
        reference: "//*[local-name()='DE']",
        action: "after",
      },
    });
    
    // Obtener el XML firmado 
    return sig.getSignedXml();
  } catch (error) {
    console.error("Error al firmar el XML:", error);
    throw error;
  }
};
module.exports = { agregarFirmaXml};
