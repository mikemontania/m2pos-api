const { Op } = require("sequelize");
const MedioPago = require("../models/medioPago.model");
const { sequelize } = require("../../dbconfig");

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const medioPago = await MedioPago.findByPk(id);
    if (medioPago) {
      res.status(200).json(medioPago);
    } else {
      res.status(404).json({ error: "Medio de pago no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar el medio de pago por ID" });
  }
};
const findPredeterminado = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones = { empresaId, predeterminado: true };
    const medioPago = await MedioPago.findOne({ where: condiciones });

    if (medioPago) {
      res.status(200).json(medioPago);
    } else {
      res.status(404).json({ error: "MedioPago predeterminado no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar MedioPago predeterminado" });
  }
};
const findAll = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones = { empresaId ,normal:true};
    const mediosPago = await MedioPago.findAll({ where: condiciones });

    res.status(200).json(mediosPago);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar medios de pago" });
  }
};

const create = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const {
      descripcion,
      esCheque,
      tieneBanco,
      tieneRef,
      tieneTipo,
      esObsequio
    } = req.body;
    const medioPago = await MedioPago.create({
      empresaId,
      descripcion,
      esCheque,
      tieneBanco,
      tieneRef,
      tieneTipo,
      esObsequio
    });
    res.status(201).json(medioPago);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al crear el medio de pago" });
  }
};

const update = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { id } = req.params;
    const {
      descripcion,
      esCheque,
      tieneBanco,
      tieneRef,
      tieneTipo,
      esObsequio
    } = req.body;
    const medioPago = await MedioPago.findByPk(id);
    if (medioPago) {
      await medioPago.update({
        empresaId,
        descripcion,
        esCheque,
        tieneBanco,
        tieneRef,
        tieneTipo,
        esObsequio
      });
      res.status(200).json(medioPago);
    } else {
      res.status(404).json({ error: "Medio de pago no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al actualizar el medio de pago" });
  }
};

const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const medioPago = await MedioPago.findByPk(id);
    if (medioPago) {
      await medioPago.update({ activo: false });
      res
        .status(200)
        .json({ message: "Medio de pago desactivado exitosamente" });
    } else {
      res.status(404).json({ error: "Medio de pago no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al desactivar el medio de pago" });
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
