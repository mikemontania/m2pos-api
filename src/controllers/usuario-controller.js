const { Op } = require('sequelize');
const Usuario = require('../models/usuario.model'); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require('../../dbconfig');
const Sucursal = require('../models/sucursal.model');
const Numeracion = require('../models/numeracion.model');
const Bcryptjs = require("bcryptjs");

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
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar el Usuario por ID' });
  }
};

const findPaginados = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { page = 1, pageSize = 10, searchTerm } = req.params;
    const condiciones = { empresaId };
    // Añadir condiciones para búsqueda por nroDocumento o razonSocial
    if (searchTerm && searchTerm !== "") {
      condiciones[Op.or] = [
        {
          usuario: {
            [Op.iLike]: `%${searchTerm.toLowerCase()}%` // Convertir a minúsculas
          }
        },
        {
          username: {
            [Op.iLike]: `%${searchTerm.toLowerCase()}%` // Convertir a minúsculas
          }
        }
      ];
    }
    const offset = (page - 1) * pageSize;
    // Realizar la consulta paginada
    const { count, rows:usuarios } = await Usuario.findAndCountAll({
      where: condiciones,
      include: [
        { model: Sucursal, as: "sucursal"  },
        { model: Numeracion, as: "numeracion"  },
      ],
      limit: pageSize,
      offset,
    }); 
    // Calcular el número total de páginas
    const totalPages = Math.ceil(count / pageSize);

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page: Number(page),
      pageSize: Number(pageSize),
      usuarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar usuarios paginados" });
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
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar Usuarios' });
  }
};

// Método para crear un nuevo Usuario
const create = async (req, res) => {
  try {
    const { empresaId  } = req.usuario;
    const {   sucursalId, username, usuario, img, rol, activo, password ,numPrefId,numNcPrefId} = req.body;
    const salt = Bcryptjs.genSaltSync();
    const passwordEncode = Bcryptjs.hashSync(password, salt);
    const nuevoUsuario = await Usuario.create({ empresaId, sucursalId, username, usuario,numPrefId,numNcPrefId, img, rol, activo, password:passwordEncode  });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al crear el Usuario' });
  }
};


// Método para actualizar un Usuario por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.usuario;
    const { sucursalId, username, usuario,  rol, activo, bloqueado, password,numPrefId,numNcPrefId } = req.body;
    const usuarioActualizado = await Usuario.findByPk(id);
    
    if (usuarioActualizado) {
      if (password !== '' && password !== null) {
        // Solo actualiza el password si no es vacío ni nulo
        const salt = Bcryptjs.genSaltSync();
        const passwordEncode = Bcryptjs.hashSync(password, salt);
        await usuarioActualizado.update({ ...usuarioActualizado, empresaId, sucursalId, username, numPrefId,numNcPrefId,usuario,   rol, activo,intentos:0, bloqueado, password: passwordEncode });
      } else {
        // No actualiza el password si es vacío o nulo
        await usuarioActualizado.update({ ...usuarioActualizado, empresaId, sucursalId, username, numPrefId,numNcPrefId,usuario,   rol, activo,intentos:0, bloqueado });
      }
      
      res.status(200).json(usuarioActualizado);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al actualizar el Usuario' });
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
    res.status(500).json({ error: error?.original?.detail ||   'Error al desactivar el Usuario' });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
  findPaginados
};
