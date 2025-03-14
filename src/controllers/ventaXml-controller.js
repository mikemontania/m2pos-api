const VentaXml = require('../models/ventaXml.model');

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const xml = await VentaXml.findByPk(id);
    if (xml) {
      res.status(200).json(xml);
    } else {
      res.status(404).json({ error: "XML no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar el XML por ID" });
  }
};


const crearVentaXml = async (empresaId, ventaId, xml, orden  , estado  ) => {
  try {
    const registro = await VentaXml.create({
      id: null,  // Sequelize maneja automáticamente el ID si es autoincremental
      orden,
      empresaId,
      ventaId,
      estado,
      xml
    });

    return registro; // Devuelve el registro creado
  } catch (error) {
    console.error('❌ Error al crear registro en VentaXml:', error);
    throw new Error('No se pudo registrar la venta XML');
  }
};


const create = async (req, res) => {
  const { empresaId } = req.usuario;

  try {
    const { ventaId,   xml, estado } = req.body;
    const nuevaFactura = await VentaXml.create({
      ventaId,
      empresaId,
      xml,
      estado,
    });
    res.status(201).json(nuevaFactura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el XML" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { xml, fechaFirma, estado } = req.body;
    const xmlRecord = await VentaXml.findByPk(id);
    if (xmlRecord) {
      await xmlRecord.update({ xml, fechaFirma, estado });
      res.status(200).json(xmlRecord);
    } else {
      res.status(404).json({ error: "XML no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el XML" });
  }
};

const findByVentaId = async (req, res) => {
  try {
    const { ventaId } = req.params;
    const xmls = await VentaXml.findAll({ 
      where: { ventaId },
      order: [['orden', 'ASC']] // Ordena por createdAt en orden ascendente
    });
    res.status(200).json(xmls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar XMLs por ventaId" });
  }
};



module.exports = {
  getById,
  create,
  update,
  findByVentaId,
  crearVentaXml
};
