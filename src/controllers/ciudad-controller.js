const { Op } = require('sequelize');
const Ciudad = require('../models/ciudad.model');
const { sequelize } = require('../../dbconfig');


const getBycodDepartamento = async (req, res) => {
  try {
    const { codDepartamento } = req.params;  
    if (!codDepartamento)  
      res.status(200).json([]);
   
    const condiciones ={codDepartamento} 
    const ciudades = await Ciudad.findAll({ where: condiciones });
   
      res.status(200).json(ciudades);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar el ciudad por departamento ID' });
  }
};



const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const ciudad = await Ciudad.findByPk(id);
    if (ciudad) {
      res.status(200).json(ciudad);
    } else {
      res.status(404).json({ error: 'ciudad no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar el ciudad por ID' });
  }
};

const findAll = async (req, res) => {
  try { 
    const ciudades = await Ciudad.findAll(); 
    res.status(200).json(ciudades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar Ciudads' });
  }
};

const create= async (req, res) => {
  try {
    const { id, descripcion, codigo, codDepartamento } = req.body;
    const Ciudad = await Ciudad.create({ id, descripcion, codigo ,codDepartamento} );
    res.status(201).json(Ciudad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al crear el Ciudad' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, descripcion,codDepartamento  } = req.body;
    const ciudad = await Ciudad.findByPk(id);
    if (ciudad) {
      await ciudad.update({ codigo, descripcion, codDepartamento  });
      res.status(200).json(Ciudad);
    } else {
      res.status(404).json({ error: 'Ciudad no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al actualizar el Ciudad' });
  }
};
 

module.exports = {
  getBycodDepartamento,
  getById,
  findAll ,
  create ,
  update , 
};
