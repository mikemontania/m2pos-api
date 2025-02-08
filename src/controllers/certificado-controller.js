const { Op } = require('sequelize');
const Certificado = require('../models/certificado.model');
const { sequelize } = require('../../dbconfig');
const Bcryptjs = require('bcryptjs');
const { encryptPassphrase, decryptPassphrase } = require('../helpers/encript-helper');
const moment = require("moment");

// Método para buscar por ID
const getCertificado = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    console.log('**********codigo empresa:'+empresaId)
    // Buscar un único certificado para la empresa
    let certificado = await Certificado.findOne({ where: { empresaId } });

    if (certificado  )  {
      console.log("certificado",certificado)
      if (certificado?.passphrase.length > 4)  
        certificado.passphrase = decryptPassphrase(certificado.passphrase); 
      return res.status(200).json(certificado);
    } else{
      console.log("no se encontro certificado")
    }
   

    // Crear un nuevo certificado si no existe
    const fechaActual = moment().format("YYYY-MM-DD");
    certificado = await Certificado.create({
      empresaId,
      path: '',
      passphrase: '',
      validoDesde: fechaActual,
      validoHasta: fechaActual
    });
    console.log(" certificado creado")
    res.status(200).json(certificado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || 'Error al buscar el Certificado por ID' });
  }
};
 

// Método para actualizar un Certificado por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.usuario;
    const { path, passphrase, validoDesde, validoHasta } = req.body;
    console.log({ path, passphrase, validoDesde, validoHasta , id})
    const certificadoActualizado = await Certificado.findByPk(id);
    if (certificadoActualizado) {
      const updatedFields = {
        path,
        empresaId,
        validoDesde,
        validoHasta
      };

      if (passphrase) {
        // Encriptar el passphrase si está presente
        updatedFields.passphrase = encryptPassphrase(passphrase);
      }

      await certificadoActualizado.update(updatedFields);

      // Desencriptar el passphrase antes de devolver el certificado actualizado
      certificadoActualizado.passphrase = decryptPassphrase(certificadoActualizado.passphrase);
      res.status(200).json(certificadoActualizado);
    } else {
      res.status(404).json({ error: 'Certificado no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || 'Error al actualizar el Certificado' });
  }
};

module.exports = {
  getCertificado,
 
  update,
};