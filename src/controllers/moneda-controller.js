const { Op } = require('sequelize');
const Moneda = require('../models/moneda.model');
const { sequelize } = require('../../dbconfig');

const getById = async (req, res) => {
  try {
    const { codigo } = req.params;
    const moneda = await Moneda.findByPk(codigo);
    if (moneda) {
      res.status(200).json(moneda);
    } else {
      res.status(404).json({ error: 'moneda no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar el moneda por ID' });
  }
};

const findAll = async (req, res) => {
  try { 
    const monedas = await Moneda.findAll(); 
    res.status(200).json(monedas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar Monedas' });
  }
};
 
 
 

module.exports = {
  getById,
  findAll , 
};
