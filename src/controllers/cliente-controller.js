const { Op } = require("sequelize");
const Cliente = require("../models/cliente.model"); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require("../../dbconfig");
const FormaVenta = require("../models/formaVenta.model");
const ListaPrecio = require("../models/listaPrecio.model");

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
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar el cliente por ID" });
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
      res.status(404).json({ error: "Cliente predeterminado no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar cliente predeterminado" });
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
      res.status(404).json({ error: "Cliente propietario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar cliente propietario" });
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
    const offset = (page - 1) * pageSize;
    // Realizar la consulta paginada
    const { count, rows:clientes } = await Cliente.findAndCountAll({
      where: condiciones,
      include: [
        { model: FormaVenta, as: "formaVenta", attributes: ["descripcion"] },
        { model: ListaPrecio, as: "listaPrecio", attributes: ["descripcion"] },
      ],
      limit: pageSize,
      offset,
    }); 
     
    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page: Number(page),
      pageSize: Number(pageSize),
      clientes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar clientes paginados" });
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
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar clientes" });
  }
};

// Método para crear un nuevo cliente
const create = async (req, res) => {
  try {
    const { empresaId,id } = req.usuario;
    const {
      
      listaPrecioId,
      formaVentaId, 
      razonSocial,nombreFantasia,
      nroDocumento,
      direccion,
      telefono,
      cel,
      tipoOperacionId,
      email,
      excentoIva,
      latitud,
      longitud,
      predeterminado,
      empleado,
      propietario,
      activo,naturalezaReceptor,codigoPais,tipoContribuyente,tipoDocIdentidad
    } = req.body;

    // Verificar si ya existe un cliente con predeterminado o propietario true
    if (propietario) {
      const existingClient = await Cliente.findOne({
        where: {
          empresaId,
          propietario: true,
       
        },
      });

      if (existingClient) {
        return res.status(400).json({ error: "Ya existe un cliente  propietario ." });
      }
    }

    if (predeterminado ) {
      const existingClient = await Cliente.findOne({
        where: {
          empresaId,
          predeterminado: true,
        },
      });

      if (existingClient) {
        return res.status(400).json({ error: "Ya existe un cliente predeterminado." });
      }
    }




    const cliente = await Cliente.create({
      usuarioCreacionId:id,
      usuarioModificacionId:id,
      empresaId,
      listaPrecioId, 
      razonSocial,nombreFantasia,
      nroDocumento,
      direccion,
      telefono,
      cel,
      tipoOperacionId,
      email,
      excentoIva,
      latitud,
      longitud,
      predeterminado,
      empleado,
      propietario,
      activo,
      formaVentaId, naturalezaReceptor,codigoPais,tipoContribuyente,tipoDocIdentidad
    });

    res.status(201).json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al crear el cliente" });
  }
};

const update = async (req, res) => {
  try {
    const { empresaId, id: usuarioId } = req.usuario;
    const {
      id,
      listaPrecioId,
      formaVentaId,
      razonSocial,
      nroDocumento,
      direccion,
      telefono,
      cel,
      tipoOperacionId,
      email,
      excentoIva,
      latitud,
      longitud,
      predeterminado,
      empleado,
      propietario,
      activo,naturalezaReceptor,codigoPais,tipoContribuyente,tipoDocIdentidad,nombreFantasia
    } = req.body;
  // Verificar si el cliente existe
  if (propietario || predeterminado) {
    const existingClient = await Cliente.findA({
      where: {
        empresaId,
        [propietario ? 'propietario' : 'predeterminado']: true,
       },
    });

    if (existingClient && existingClient.id != id) {
      return res.status(400).json({ error: `Ya existe un cliente ${propietario ? 'propietario' : 'predeterminado'}.` });
    }
  }
 
    // Verificar si el cliente existe
    let existingClient = await Cliente.findByPk(id);
    if (!existingClient) {
      return res.status(404).json({ error: "El cliente no existe." });
    }

    // Actualizar los datos del cliente
    existingClient.usuarioModificacionId=usuarioId;
    existingClient.listaPrecioId = listaPrecioId;
    existingClient.formaVentaId = formaVentaId;
    existingClient.razonSocial = razonSocial;
    existingClient.nroDocumento = nroDocumento;
    existingClient.direccion = direccion;
    existingClient.telefono = telefono;
    existingClient.cel = cel;
    existingClient.tipoOperacionId = tipoOperacionId; 
    existingClient.email = email;
    existingClient.excentoIva = excentoIva;
    existingClient.latitud = latitud;
    existingClient.longitud = longitud;
    existingClient.predeterminado = predeterminado;
    existingClient.empleado = empleado;
    existingClient.propietario = propietario;
    existingClient.activo = activo;

    existingClient.nombreFantasia = nombreFantasia;
    existingClient.naturalezaReceptor = naturalezaReceptor;
    existingClient.codigoPais = codigoPais;
    existingClient.tipoContribuyente = tipoContribuyente;
    existingClient.tipoDocIdentidad = tipoDocIdentidad; 
    // Guardar los cambios en la base de datos
    await existingClient.save();

    // Responder con el cliente actualizado
    res.status(200).json(existingClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al actualizar el cliente." });
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
    res.status(500).json({ error: error?.original?.detail ||   "Error al desactivar el cliente" });
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
