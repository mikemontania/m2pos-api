const Certificado = require("../models/certificado.model");
const fs = require("fs");
const moment = require("moment");
const forge = require("node-forge");
const { decryptPassphrase } = require("../helpers/encript-helper");
const { openFileP12, getPrivateKey, getCertificate } = require('./p12');
 

const abrirCertificado = (certificado, passphrase) => {
    const p12 = openFileP12(certificado, passphrase);
    return {
        cert: getCertificate(p12),
        key: getPrivateKey(p12),
    };
};

const loadCertificateAndKey = async (empresaId) => {
    try {
        let condiciones = { activo: true };
        if (empresaId) condiciones.empresaId = empresaId;

        // Buscar el certificado en la base de datos
        let certificado = await Certificado.findOne({ where: condiciones });
        certificado = { ...certificado?.dataValues }
        if (!certificado) {
            console.error("❌ No se encontró un certificado activo para la empresa");
            return null;
        }

        // Validar el path del certificado
        if (!certificado.path || certificado.path.length < 15) {
            console.error("❌ No se encontró un path de certificado válido");
            return null;
        }

        // Validar fechas del certificado
        let hoy = moment();
        if (!certificado.validoDesde || !certificado.validoHasta) {
            console.error("❌ Certificado sin fechas válidas");
            return null;
        }

        if (moment(certificado.validoHasta).isBefore(hoy, 'day')) {
            console.error("❌ Certificado vencido");
            return null;
        }

        if (moment(certificado.validoDesde).isAfter(certificado.validoHasta)) {
            console.error("❌ Rango de fechas inválido en el certificado");
            return null;
        }


 const password = decryptPassphrase(certificado.passphrase);

    const path = `./src/certificado/${certificado.path}`;
    console.log("password", password);
    console.log("path", path);
    const p12File = fs.readFileSync(path);
    const p12Asn1 = forge.asn1.fromDer(p12File.toString("binary"), true);
    let p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

    let cert = getCertificate(p12);
    let key = getPrivateKey(p12);
    if (!cert) {
      reject("Antes debe Autenticarse");
    }
    if (!key) {
      reject("Antes debe autenticarse");
    }
    return { cert, key, password };


        return certificado;
    } catch (error) {
        console.error("❌ Error al cargar el certificado:", error);
        return null;
    }
};


module.exports = {
    abrirCertificado,
    loadCertificateAndKey,

};