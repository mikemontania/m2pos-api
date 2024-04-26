const { Op } = require('sequelize');
const Banco = require('../models/banco.model');
const { sequelize } = require('../../dbconfig');

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const banco = await Banco.findByPk(id);
    if (banco) {
      res.status(200).json(banco);
    } else {
      res.status(404).json({ error: 'Banco no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al buscar el banco por ID' });
  }
};

const findAll = async (req, res) => {
  try {

    const { empresaId  } = req.usuario;
    const condiciones =   { empresaId }  ;
    const bancos = await Banco.findAll({ where: condiciones }); 
    res.status(200).json(bancos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al buscar bancos' });
  }
};

const create= async (req, res) => {
  try {
    const { empresaId, descripcion, activo } = req.body;
    const banco = await Banco.create({ empresaId, descripcion, activo });
    res.status(201).json(banco);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al crear el banco' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId, descripcion, activo } = req.body;
    const banco = await Banco.findByPk(id);
    if (banco) {
      await banco.update({ empresaId, descripcion, activo });
      res.status(200).json(banco);
    } else {
      res.status(404).json({ error: 'Banco no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al actualizar el banco' });
  }
};

const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const banco = await Banco.findByPk(id);
    if (banco) {
      await banco.update({ activo: false });
      res.status(200).json({ message: 'Banco desactivado exitosamente' });
    } else {
      res.status(404).json({ error: 'Banco no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || error?.errors[0].message  ||  'Error al desactivar el banco' });
  }
};

module.exports = {
  getById,
  findAll ,
  create ,
  update ,
  disable,
};
