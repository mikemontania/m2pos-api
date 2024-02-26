const { Op } = require('sequelize');
const Usuario = require('../models/usuario.model'); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require('../../dbconfig');

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, { attributes: { exclude: ['password', 'intentos'] } });
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar el Usuario por ID' });
  }
};

// Método para buscar todos los Usuarios
const findAll = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const condiciones = {};
    if (empresaId) condiciones.empresaId = empresaId;

    const usuarios = await Usuario.findAll({ where: condiciones, attributes: { exclude: ['password', 'intentos'] } });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar Usuarios' });
  }
};

// Método para crear un nuevo Usuario
const create = async (req, res) => {
  try {
    const { empresaId, sucursalId, username, usuario, img, rol, activo, bloqueado } = req.body;
    const nuevoUsuario = await Usuario.create({ empresaId, sucursalId, username, usuario, img, rol, activo,   });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el Usuario' });
  }
};

// Método para actualizar un Usuario por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId, sucursalId, username, usuario, img, rol, activo, bloqueado } = req.body;
    const usuarioActualizado = await Usuario.findByPk(id);
    if (usuarioActualizado) {
      await usuarioActualizado.update({ empresaId, sucursalId, username, usuario, img, rol, activo, bloqueado });
      res.status(200).json(usuarioActualizado);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el Usuario' });
  }
};

// Método para desactivar un Usuario (marcar como inactivo)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      await usuario.update({ activo: false });
      res.status(200).json({ message: 'Usuario desactivado exitosamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al desactivar el Usuario' });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
};
