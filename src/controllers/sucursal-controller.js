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
    const condiciones = empresaId ? { empresaId } : {};
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

module.exports = {
  getById,
  findAll, 
  disable, 
};
