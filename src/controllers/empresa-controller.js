const { Op } = require('sequelize');
const Empresa = require('../models/empresa.model');
const { sequelize } = require('../../dbconfig');

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findByPk(id);
    if (empresa) {
      res.status(200).json(empresa);
    } else {
      res.status(404).json({ error: 'empresa no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar el empresa por ID' });
  }
};
 

const update= async (req, res) => {
  try {
    const { id } = req.params;
    const { razonSocial, actividad1, actividad2, actividad3, ruc, telefono, email,  web } = req.body;

    // Buscar la empresa por su ID
    const empresa = await Empresa.findByPk(id);

    // Verificar si la empresa existe
    if (empresa) {
      // Actualizar los campos de la empresa
      await empresa.update({ razonSocial, actividad1, actividad2, actividad3, ruc, telefono, email,  web });

      // Responder con la empresa actualizada
      res.status(200).json(empresa);
    } else {
      // Si la empresa no se encuentra, responder con un error 404
      res.status(404).json({ error: 'Empresa no encontrada' });
    }
  } catch (error) {
    // Si ocurre un error durante el proceso, responder con un error 500
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al actualizar la empresa' });
  }
};
 

module.exports = {
  getById,
  update ,
 
};
