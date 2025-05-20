const { Op } = require("sequelize");
const ListaPrecio = require("../models/listaPrecio.model"); // Asegúrate de que la importación del modelo sea correcta

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const listaPrecio = await ListaPrecio.findByPk(id);
    if (listaPrecio) {
      res.status(200).json(listaPrecio);
    } else {
      res.status(404).json({ error: "listaPrecio no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error?.original?.detail ||   "Error al buscar la lista de precio por ID" });
  }
};
const findPredeterminado = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones = { empresaId, predeterminado: true };
    const predeterminado = await ListaPrecio.findOne({ where: condiciones });

    if (predeterminado) {
      res.status(200).json(predeterminado);
    } else {
      res
        .status(404)
        .json({ error: "Lista Precio predeterminado no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar cliente predeterminado" });
  }
};
// Método para buscar todas las listas de precio
const findAll = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones = { empresaId, activo: true };
    const listasPrecio = await ListaPrecio.findAll({ where: condiciones });
    res.status(200).json(listasPrecio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar listas de precio" });
  }
};

// Método para crear una nueva lista de precio
const create = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
 
    const { descripcion, activo,color , predeterminado,} = req.body;
    const listaPrecio = await ListaPrecio.create({
      empresaId,
      predeterminado, descripcion,color,
      activo
    });
    res.status(201).json(listaPrecio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al crear la lista de precio" });
  }
};

// Método para actualizar una lista de precio por ID
const update = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { id } = req.params;
    const {predeterminado, descripcion,color, activo } = req.body;
    const listaPrecio = await ListaPrecio.findByPk(id);
    if (listaPrecio) {
      await listaPrecio.update({ empresaId, color,predeterminado,descripcion, activo });
      res.status(200).json(listaPrecio);
    } else {
      res.status(404).json({ error: "Lista de precio no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al actualizar la lista de precio" });
  }
};

// Método para desactivar una lista de precio (marcar como inactiva)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const listaPrecio = await ListaPrecio.findByPk(id);
    if (listaPrecio) {
      await listaPrecio.update({ activo: false });
      res
        .status(200)
        .json({ message: "Lista de precio desactivada exitosamente" });
    } else {
      res.status(404).json({ error: "Lista de precio no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al desactivar la lista de precio" });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
  findPredeterminado
};
