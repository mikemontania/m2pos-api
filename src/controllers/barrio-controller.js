const { Op } = require('sequelize');
const Barrio = require('../models/barrio.model');
const { sequelize } = require('../../dbconfig');
const Ciudad = require('../models/ciudad.model');

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const barrio = await Barrio.findByPk(id);
    if (barrio) {
      res.status(200).json(barrio);
    } else {
      res.status(404).json({ error: 'barrio no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar el barrio por ID' });
  }
};

const getBycodCiudad = async (req, res) => {
  try {
    const { codCiudad } = req.params;  
    if (!codCiudad)  
      res.status(200).json([]);
   
    const condiciones ={codCiudad} 
    const barrios = await Barrio.findAll({ where: condiciones });
   
      res.status(200).json(barrios);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar el barrios por ciudad ID' });
  }
};


const findAll = async (req, res) => {
  try { 
    const barrios = await Barrio.findAll(); 
    res.status(200).json(barrios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar Barrios' });
  }
};

const create= async (req, res) => {
  try {
    const { id, descripcion, codigo, codCiudad } = req.body;
    const Barrio = await Barrio.create({ id, descripcion, codigo ,codCiudad} );
    res.status(201).json(Barrio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al crear el Barrio' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, descripcion,codCiudad  } = req.body;
    const barrio = await Barrio.findByPk(id);
    if (barrio) {
      await barrio.update({ codigo, descripcion, codCiudad  });
      res.status(200).json(Barrio);
    } else {
      res.status(404).json({ error: 'Barrio no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al actualizar el Barrio' });
  }
};
 

module.exports = {
  getById,
  getBycodCiudad,
  findAll ,
  create ,
  update , 
};
