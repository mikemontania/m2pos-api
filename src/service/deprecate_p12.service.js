"use strict";

const fs = require("fs");
const forge = require("node-forge");

/**
 * Lee un archivo .p12 y lo convierte a formato ASN.1
 * @param {string} file Ruta al archivo .p12
 * @returns {Object} ASN.1 del archivo .p12
 */
const  readP12File = (file) => {
    const pkcs12 = fs.readFileSync(file);
    return forge.asn1.fromDer(pkcs12.toString("binary"));
}

/**
 * Abre un archivo .p12 y obtiene el contenido en formato PKCS#12
 * @param {string} file Ruta al archivo .p12
 * @param {string} passphrase Contraseña para el archivo .p12
 * @returns {Object} Contenido del archivo .p12
 */
const openFileP12 = (file, passphrase) => {
    const p12Asn1 = readP12File(file);
    return forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, passphrase);
}

/**
 * Obtiene la clave privada del archivo .p12
 * @param {Object} p12 Contenido del archivo .p12
 * @returns {string|null} Clave privada en formato PEM o null si no se encuentra
 */
const getPrivateKey = (p12) =>{
    for (let i = 0; i < p12.safeContents.length; i++) {
        if ( p12.safeContents[i].safeBags[0].key) {
            return forge.pki.privateKeyToPem( p12.safeContents[i].safeBags[0].key);
         }
    }
    return null; 
}

/**
 * Obtiene el certificado del archivo .p12
 * @param {Object} p12 Contenido del archivo .p12
 * @returns {string|null} Certificado en formato PEM o null si no se encuentra
 */
const getCertificate = (p12) =>{
    for (let i = 0; i < p12.safeContents.length; i++) {
        if (p12.safeContents[i].safeBags[0].cert) {
            const b64 = forge.pki.certificateToPem(p12.safeContents[i].safeBags[0].cert);
            return b64;
        }
    }
    return null;
}

/**
 * Firma un mensaje XML usando una clave privada
 * @param {string} xml Mensaje XML a firmar
 * @param {string} privateKey Clave privada en formato PEM
 * @returns {string} Firma del mensaje en formato base64
 */
const signXml = (xml, privateKey) => {
    const md = forge.md.sha256.create();
    md.update(xml, "utf8");
    const key = forge.pki.privateKeyFromPem(privateKey);
    return key.sign(md);
}

module.exports = {
    readP12File,
    openFileP12,
    getPrivateKey,
    getCertificate,
    signXml,
};
