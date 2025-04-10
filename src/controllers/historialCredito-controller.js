const HistorialCredito = require("../models/historialCredito.model");

 
 const  insertarHistorialCredito=async ( 
  empresaId,
  creditoId,
  fecha,
  importe,
  saldoAnterior,
  saldoNuevo,
  observacion,
  usuarioCreacionId,
  timbrado,
  nroComprobante
 ) =>{
  try {
    const historial = await HistorialCredito.create({
      empresaId,
      creditoId,
      fecha,
      importe,
      saldoAnterior,
      saldoNuevo,
      observacion,
      usuarioCreacionId,
      timbrado,
      nroComprobante,
      fechaCreacion: new Date(),
    });

    return historial;
  } catch (error) {
    console.error("Error al insertar historial de crédito:", error);
    throw error;
  }
}


const getHistorial = async (req, res) => {
  const { creditoId } = req.params;

  try {
    const historial = await HistorialCredito.findAll({
      where: { creditoId },
      order: [["fecha", "DESC"]],
    });

    res.json(historial);
  } catch (error) {
    console.error("Error al obtener historial por creditoId:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


module.exports = {
  insertarHistorialCredito,
  getHistorial
};