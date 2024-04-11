const { Op } = require("sequelize");
const Sucursal = require("../models/sucursal.model"); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require("../../dbconfig");

// Método para buscar por ID
 
const getById = async (req, res) => {
  try {
    const { id} = req.params; 
     const sucursal  = await Sucursal.findByPk(id);
 
      res.status(200).json(sucursal);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar sucursal  " });
  }
};

  
 
// Método para buscar todos los sucursales
const findAll = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones =  { empresaId , activo: true } ;
    const sucursales = await Sucursal.findAll({ where: condiciones });
    res.status(200).json(sucursales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar sucursales" });
  }
};
 
// Método para desactivar un sucursal (marcar como inactivo)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const sucursal = await Sucursal.findByPk(id);
    if (sucursal) {
      await sucursal.update({ activo: false });
      res.status(200).json({ message: "Sucursal desactivado exitosamente" });
    } else {
      res.status(404).json({ error: "Sucursal no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al desactivar el sucursal" });
  }
};


// Método para crear una nueva sucursal
const create = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { descripcion, direccion, telefono, cel,   email, activo  } = req.body;
    const sucursal = await Sucursal.create({ descripcion, direccion, telefono, cel, empresaId, email, activo  });
    res.status(201).json(sucursal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la sucursal' });
  }
};

// Método para actualizar una sucursal por ID
const update = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { id } = req.params;
    const { descripcion, direccion, telefono, cel,   email, activo } = req.body;
    const sucursal = await Sucursal.findByPk(id);
    if (sucursal) {
      await sucursal.update({ descripcion, direccion, telefono, cel, empresaId, email, activo });
      res.status(200).json(sucursal);
    } else {
      res.status(404).json({ error: 'Sucursal no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la sucursal' });
  }
};


module.exports = {
  getById,
  findAll, 
  disable, 
  create,
  update
};
