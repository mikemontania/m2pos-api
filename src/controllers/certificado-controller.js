const { Op } = require('sequelize');
const Certificado = require('../models/certificado.model');
const { sequelize } = require('../../dbconfig');
const Bcryptjs = require('bcryptjs');
const { encryptPassphrase, decryptPassphrase } = require('../helpers/encript-helper');

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const certificado = await Certificado.findByPk(id);
    if (certificado) {
      // Desencriptar el passphrase antes de enviarlo
      certificado.passphrase = decryptPassphrase(certificado.passphrase);
      res.status(200).json(certificado);
    } else {
      res.status(404).json({ error: 'Certificado no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || 'Error al buscar el Certificado por ID' });
  }
};

// Método para buscar todos los Certificados
const findAll = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones = {};
    if (empresaId) condiciones.empresaId = empresaId;

    const certificados = await Certificado.findAll({ where: condiciones });
    // Desencriptar el passphrase para cada certificado
    certificados.forEach(certificado => {
      certificado.passphrase = decryptPassphrase(certificado.passphrase);
    });
    res.status(200).json(certificados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || 'Error al buscar Certificados' });
  }
};

// Método para crear un nuevo Certificado
const create = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { path, passphrase, validoDesde, validoHasta, activo } = req.body;
    // Encriptar el passphrase antes de almacenarlo
    const encryptedPassphrase = encryptPassphrase(passphrase);
    const nuevoCertificado = await Certificado.create({
      empresaId,
      path,
      passphrase: encryptedPassphrase,
      validoDesde,
      validoHasta,
      activo
    });
    res.status(201).json(nuevoCertificado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || 'Error al crear el Certificado' });
  }
};

// Método para actualizar un Certificado por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { path, passphrase, validoDesde, validoHasta, activo } = req.body;
    const certificadoActualizado = await Certificado.findByPk(id);

    if (certificadoActualizado) {
      const updatedFields = {
        path,
        validoDesde,
        validoHasta,
        activo
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
  getById,
  findAll,
  create,
  update,
};