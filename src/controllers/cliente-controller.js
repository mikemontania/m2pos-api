const { Op } = require("sequelize");
const Cliente = require("../models/cliente.model"); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require("../../dbconfig");

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar el cliente por ID" });
  }
};

const findPredeterminado = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones =   { empresaId, predeterminado: true }
     const clientePredeterminado = await Cliente.findOne({ where: condiciones });

    if (clientePredeterminado) {
      res.status(200).json(clientePredeterminado);
    } else {
      res.status(404).json({ mensaje: "Cliente predeterminado no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar cliente predeterminado" });
  }
};

const findPropietario = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones = empresaId
      ? { empresaId, propietario: true }
      : { propietario: true };
    const clientePropietario = await Cliente.findOne({ where: condiciones });

    if (clientePropietario) {
      res.status(200).json(clientePropietario);
    } else {
      res.status(404).json({ mensaje: "Cliente propietario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar cliente propietario" });
  }
};

const findClientesPaginados = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { page = 1, pageSize = 10, searchTerm } = req.params;
    const condiciones = { empresaId };
    // Añadir condiciones para búsqueda por nroDocumento o razonSocial
    if (searchTerm && searchTerm !== "") {
      condiciones[Op.or] = [
        {
          nroDocumento: {
            [Op.iLike]: `%${searchTerm.toLowerCase()}%` // Convertir a minúsculas
          }
        },
        {
          razonSocial: {
            [Op.iLike]: `%${searchTerm.toLowerCase()}%` // Convertir a minúsculas
          }
        }
      ];
    }
    // Realizar la consulta paginada
    const { count, rows } = await Cliente.findAndCountAll({
      where: condiciones,
      limit: pageSize,
      offset: (page - 1) * pageSize
    });

    // Calcular el número total de páginas
    const totalPages = Math.ceil(count / pageSize);

    res
      .status(200)
      .json({ count, totalPages, currentPage: parseInt(page), rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar clientes paginados" });
  }
};
// Método para buscar todos los clientes
const findAll = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones = empresaId ? { empresaId } : {};
    const clientes = await Cliente.findAll({ where: condiciones });
    res.status(200).json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar clientes" });
  }
};

// Método para crear un nuevo cliente
const create = async (req, res) => {
  try {
    const {
      empresaId,
      listaPrecioId,
      usuarioCreacionId,
      razonSocial,
      nroDocumento,
      direccion,
      telefono,
      email,
      excentoIva,
      latitud,
      longitud,
      predeterminado,
      empleado,
      propietario,
      activo
    } = req.body;
    const cliente = await Cliente.create({
      empresaId,
      listaPrecioId,
      usuarioCreacionId,
      razonSocial,
      nroDocumento,
      direccion,
      telefono,
      email,
      excentoIva,
      latitud,
      longitud,
      predeterminado,
      empleado,
      propietario,
      activo
    });
    res.status(201).json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el cliente" });
  }
};

// Método para actualizar un cliente por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      empresaId,
      listaPrecioId,
      usuarioCreacionId,
      razonSocial,
      nroDocumento,
      direccion,
      telefono,
      email,
      excentoIva,
      latitud,
      longitud,
      predeterminado,
      empleado,
      propietario,
      activo
    } = req.body;
    const cliente = await Cliente.findByPk(id);
    if (cliente) {
      await cliente.update({
        empresaId,
        listaPrecioId,
        usuarioCreacionId,
        razonSocial,
        nroDocumento,
        direccion,
        telefono,
        email,
        excentoIva,
        latitud,
        longitud,
        predeterminado,
        empleado,
        propietario,
        activo
      });
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};

// Método para desactivar un cliente (marcar como inactivo)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);
    if (cliente) {
      await cliente.update({ activo: false });
      res.status(200).json({ message: "Cliente desactivado exitosamente" });
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al desactivar el cliente" });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
  findPredeterminado,
  findClientesPaginados,
  findPropietario
};
