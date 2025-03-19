const DocumentoXml = require('../models/documentoXml.model');

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const xml = await DocumentoXml.findByPk(id);
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


const crearDocumentoXml = async (empresaId, documentoId, xml, orden  , estado  ) => {
  try {
    const registro = await DocumentoXml.create({
      id: null,  // Sequelize maneja automáticamente el ID si es autoincremental
      orden,
      empresaId,
      documentoId,
      estado,
      xml
    });

    return registro; // Devuelve el registro creado
  } catch (error) {
    console.error('❌ Error al crear registro en DocumentoXml:', error);
    throw new Error('No se pudo registrar la documento XML');
  }
};


const create = async (req, res) => {
  const { empresaId } = req.usuario;

  try {
    const { documentoId,   xml, estado } = req.body;
    const nuevaFactura = await DocumentoXml.create({
      documentoId,
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
    const xmlRecord = await DocumentoXml.findByPk(id);
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

const findByDocumentoId = async (req, res) => {
  try {
    const { documentoId } = req.params;
    const xmls = await DocumentoXml.findAll({ 
      where: { documentoId },
      order: [['orden', 'ASC']] // Ordena por createdAt en orden ascendente
    });
    res.status(200).json(xmls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar XMLs por documentoId" });
  }
};



module.exports = {
  getById,
  create,
  update,
  findByDocumentoId,
  crearDocumentoXml
};
