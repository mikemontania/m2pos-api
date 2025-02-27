const Envio = require("../../models/envio.model");
const EnvioVenta = require("../../models/envioVenta");
const { extraerDatosRespuesta } = require("../xmlToJson");

const cargandoLote = async (empresaId) => {
    try {
      const envio = await Envio.create({
        estado: 'INIT',
        empresaId: empresaId,
        reintentar: true,  // Asumimos que se reintenta en caso de error
        tipo: 'LOTE',      // Tipo de envío (puedes cambiarlo según tu lógica)
        numeroLote: null,  // Se puede actualizar después
        respuestaId: null,
        respuestaConsultaId: null
      });
  
      console.log(`✅ Lote creado con ID: ${envio.id}`);
      return envio;
    } catch (error) {
      console.error('❌ Error al crear el lote:', error);
      throw error;
    }
  };
  
  const actualizarLote = async (loteId, respuesta, respuestaId) => {
    try {
  
      const json = await extraerDatosRespuesta(respuesta);
  
      console.log("json ", json)
      console.log("JSON.stringify ", JSON.stringify(json, null, 2));
      // Determinar estado basado en el código de respuesta
      const estado = json?.codigo === "0300" ? "RECIBIDO" : "RECHAZADO";
      const reintento = json?.codigo === "0300" ? false : true;
      const actualizado = await Envio.update(
        {
          estado: estado,
          numeroLote: json?.numeroLote,
          codigo:json?.codigo,
          obs:json?.observacion,
          respuestaId: respuestaId,
          reintentar: reintento
        },
        {
          where: { id: loteId }
        }
      );
      console.log(actualizado)
      console.log(`✅ Lote actualizado con ID: ${loteId}, Estado: ${estado}`);
      return {id:loteId,estado:estado,...json};
    } catch (error) {
      console.error("❌ Error al actualizar el lote:", error);
      throw error;
    }
  };
   

  const relacionarVentasConLote = async (loteId, ventasIds) => {
    try {
      const registros = ventasIds.map(ventaId => ({
        ventaId: ventaId,
        envioId: loteId
      }));
  
      await EnvioVenta.bulkCreate(registros);
  
      console.log(`🔗 Relación creada entre ${ventasIds.length} ventas y el lote ${loteId}`);
    } catch (error) {
      console.error("❌ Error al relacionar ventas con el lote:", error);
      throw error;
    }
  };
  


module.exports = {
    cargandoLote  ,actualizarLote,relacionarVentasConLote
};