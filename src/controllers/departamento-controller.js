const { Op } = require('sequelize');
const Departamento = require('../models/departamento.model');
const { sequelize } = require('../../dbconfig');

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const departamento = await Departamento.findByPk(id);
    if (departamento) {
      res.status(200).json(departamento);
    } else {
      res.status(404).json({ error: 'departamento no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar el departamento por ID' });
  }
};

const findAll = async (req, res) => {
  try { 
    const departamentos = await Departamento.findAll(); 
    res.status(200).json(departamentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar Departamentos' });
  }
};

const create= async (req, res) => {
  try {
    const { id, descripcion, codigo } = req.body;
    const Departamento = await Departamento.create({ id, descripcion, codigo } );
    res.status(201).json(Departamento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al crear el Departamento' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, descripcion  } = req.body;
    const departamento = await Departamento.findByPk(id);
    if (departamento) {
      await departamento.update({ codigo, descripcion  });
      res.status(200).json(Departamento);
    } else {
      res.status(404).json({ error: 'Departamento no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al actualizar el Departamento' });
  }
};
 

module.exports = {
  getById,
  findAll ,
  create ,
  update , 
};
