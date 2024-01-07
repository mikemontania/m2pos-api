const { Op } = require("sequelize");
 const { sequelize } = require("../../dbconfig");
const moment = require("moment");
const Valoracion = require("../models/valoracion.model");
 
//version correcta
const obtenerValoracionVigente = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { id, listaValoracionId } = req.params;
    const fechaActual = moment().format("YYYY-MM-DD");
    console.log(id);
    const condiciones = {
      activo: true,
      varianteId: id,
      fechaDesde: { [Op.lte]: fechaActual },
      fechaHasta: { [Op.gte]: fechaActual }
    };

    const Valoracion = await Valoracion.findOne({ where: condiciones });
    console.log(Valoracion);
    res.status(200).json(Valoracion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar cliente predeterminado" });
  }
};
 
 

// Método para desactivar un Valoracion (marcar como inactivo)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const Valoracion = await Valoracion.findByPk(id);
    if (Valoracion) {
      await Valoracion.update({ activo: false });
      res.status(200).json({ message: "Valoracion desactivado exitosamente" });
    } else {
      res.status(404).json({ error: "Valoracion no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al desactivar el Valoracion" });
  }
};

module.exports = {
  
 
  disable,
  obtenerValoracionVigente
};
