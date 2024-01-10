const { Op } = require("sequelize");
 const { sequelize } = require("../../dbconfig");
const moment = require("moment");
const Valoracion = require("../models/valoracion.model");
 
//version correcta
const obtenerValoracionVigente = async (req, res) => {
  try {
 
    const { id, sucursalId, listaPrecioId } = req.params;
    const fechaActual = moment().format("YYYY-MM-DD");

    const condicionesPrecio = {
      activo: true,
      varianteId: detalle.varianteId,
      fechaDesde: { [Op.lte]: fechaActual },
      fechaHasta: { [Op.gte]: fechaActual },
      cantDesde: { [Op.gte]: 1 },
      listaPrecioId:       listaPrecioId, 
      registro: 'PRECIO',
      tipo: 'IMPORTE',
      sucursalId: {
        [Op.or]: [
          { [Op.eq]: sucursalId },
          { [Op.eq]: null },
        ]}
    };
    const condicionesDescuento = {
      activo: true,
      varianteId: detalle.varianteId,
      fechaDesde: { [Op.lte]: fechaActual },
      fechaHasta: { [Op.gte]: fechaActual },
      listaPrecioId:       listaPrecioId, 
      registro: 'DESCUENTO',
      tipo: 'PRODUCTO',
      sucursalId: {
        [Op.or]: [
          { [Op.eq]: sucursalId },
          { [Op.eq]: null },
        ]}
    }; 
    const precio = await Valoracion.findOne({ where: condicionesPrecio }); 
   
    const descuento = await Valoracion.findOne({ where: condicionesDescuento });  
 
    res.status(200).json({
      descuento,
      precio
    });
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
