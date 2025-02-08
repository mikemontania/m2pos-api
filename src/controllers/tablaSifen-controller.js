const { Op } = require('sequelize');
const TablaSifen = require('../models/tablaSifen.model');
const { sequelize } = require('../../dbconfig');

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const tablaSifen = await TablaSifen.findByPk(id);
    if (tablaSifen) {
      res.status(200).json(tablaSifen);
    } else {
      res.status(404).json({ error: 'TablaSifen no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar el tablaSifen por ID' });
  }
};
 const findAllRecords = async (req, res) => {
  try {
    const { tabla } = req.params;
    const { empresaId  } = req.usuario;
    const condiciones =   { tabla }  ;
    const tablasSifen = await TablaSifen.findAll({ where: condiciones }); 
    res.status(200).json(tablasSifen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar tabla en sifen' });
  }
};
const findAll = async (req, res) => {
  try {

    const { empresaId  } = req.usuario;
    const tablasSifen = await TablaSifen.findAll(); 
    res.status(200).json(tablasSifen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar tablasSifen' });
  }
};

const create= async (req, res) => {
  try { 

    const {  codigo, tabla, descripcion, activo } = req.body;
    const tablaSifen = await TablaSifen.create({  codigo, tabla, descripcion, activo });
    res.status(201).json(tablaSifen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al crear el tablaSifen' });
  }
};

const update = async (req, res) => {
  try {
 

    const { id } = req.params;
    const { codigo, tabla, descripcion, activo} = req.body;
    const tablaSifen = await TablaSifen.findByPk(id);
    if (tablaSifen) {
      await tablaSifen.update({  codigo, tabla, descripcion, activo});
      res.status(200).json(tablaSifen);
    } else {
      res.status(404).json({ error: 'TablaSifen no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al actualizar el tablaSifen' });
  }
};

const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const tablaSifen = await TablaSifen.findByPk(id);
    if (tablaSifen) {
      await tablaSifen.update({ activo: false });
      res.status(200).json({ message: 'TablaSifen desactivado exitosamente' });
    } else {
      res.status(404).json({ error: 'TablaSifen no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al desactivar el tablaSifen' });
  }
};

module.exports = {
  getById,
  findAll ,
  create ,
  update ,
  disable,
  findAllRecords
};
