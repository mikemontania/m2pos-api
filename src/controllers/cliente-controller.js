const { Op } = require('sequelize')
const Cliente = require('../models/cliente.model') // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require('../../dbconfig')
const CondicionPago = require('../models/condicionPago.model')
const ListaPrecio = require('../models/listaPrecio.model')
const ClienteSucursal = require('../models/ClienteSucursal.model')
const Departamento = require('../models/departamento.model')
const Ciudad = require('../models/ciudad.model')
const Barrio = require('../models/barrio.model')

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params
    const clienteInstance = await Cliente.findByPk(id)

    if (clienteInstance) {
      const cliente = clienteInstance.toJSON() // Convertir a objeto plano

      const clienteSucursales = await ClienteSucursal.findAll({
        where: { clienteId: id },
        include: [
          {
            model: CondicionPago,
            as: 'condicionPago',
            attributes: ['descripcion']
          },
          {
            model: ListaPrecio,
            as: 'listaPrecio',
            attributes: ['descripcion']
          },
          {
            model: Departamento,
            as: 'departamento',
            attributes: ['codigo', 'descripcion']
          },
          {
            model: Ciudad,
            as: 'ciudad',
            attributes: ['codigo', 'descripcion']
          },
          {
            model: Barrio,
            as: 'barrio',
            attributes: ['codigo', 'descripcion']
          }
        ]
      })

      cliente.clienteSucursales = clienteSucursales

      res.status(200).json(cliente)
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' })
    }
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        error: error?.original?.detail || 'Error al buscar el cliente por ID'
      })
  }
}

const findPredeterminado = async (req, res) => {
  try {
    const { empresaId } = req.usuario

    // Buscar cliente predeterminado
    const clientePredeterminado = await Cliente.findOne({
      where: {
        empresaId,
        predeterminado: true
      },
      raw: true
    })

    if (!clientePredeterminado) {
      return res
        .status(404)
        .json({ error: 'Cliente predeterminado no encontrado' })
    }

    // Buscar sucursal principal del cliente predeterminado
    const sucursalPrincipal = await ClienteSucursal.findOne({
      where: {
        clienteId: clientePredeterminado.id,
        empresaId,
        principal: true
      },
      raw: true
    })

    // Moldear respuesta como lo hacías antes
    const respuestaMoldeada = {
      clienteId: clientePredeterminado.id,
      nombre:
        clientePredeterminado.nombreFantasia ||
        clientePredeterminado.razonSocial,
      razonSocial: clientePredeterminado.razonSocial,
      nombreFantasia: clientePredeterminado.nombreFantasia,
      nroDocumento: clientePredeterminado.nroDocumento,
      tipoOperacionId: clientePredeterminado.tipoOperacionId,
      excentoIva: clientePredeterminado.excentoIva,
      naturalezaReceptor: clientePredeterminado.naturalezaReceptor,
      codigoPais: clientePredeterminado.codigoPais,
      tipoContribuyente: clientePredeterminado.tipoContribuyente,
      tipoDocIdentidad: clientePredeterminado.tipoDocIdentidad,
      email: clientePredeterminado.email,
      clienteSucursalId: sucursalPrincipal.id,
      nombre: sucursalPrincipal.nombre,
      direccion: sucursalPrincipal.direccion,
      telefono: sucursalPrincipal.telefono,
      cel: sucursalPrincipal.cel,
      latitud: sucursalPrincipal.latitud,
      longitud: sucursalPrincipal.longitud,
      listaPrecioId: sucursalPrincipal.listaPrecioId,
      condicionPagoId: sucursalPrincipal.condicionPagoId
    }

    res.status(200).json(respuestaMoldeada)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: error?.original?.detail || 'Error al buscar cliente predeterminado'
    })
  }
}

const findPropietario = async (req, res) => {
  try {
    const { empresaId } = req.usuario

    // Buscar cliente predeterminado
    const clientePropietario = await Cliente.findOne({
      where: {
        empresaId,
        propietario: true
      },
      raw: true
    })

    if (!clientePropietario) {
      return res
        .status(404)
        .json({ error: 'Cliente predeterminado no encontrado' })
    }

    // Buscar sucursal principal del cliente predeterminado
    const sucursalPrincipal = await ClienteSucursal.findOne({
      where: {
        clienteId: clientePropietario.id,
        empresaId,
        principal: true
      },
      raw: true
    })

    // Moldear respuesta como lo hacías antes
    const respuestaMoldeada = {
      clienteId: clientePropietario.id,
      nombre:
        clientePropietario.nombreFantasia || clientePropietario.razonSocial,
      razonSocial: clientePropietario.razonSocial,
      nombreFantasia: clientePropietario.nombreFantasia,
      nroDocumento: clientePropietario.nroDocumento,
      tipoOperacionId: clientePropietario.tipoOperacionId,
      excentoIva: clientePropietario.excentoIva,
      naturalezaReceptor: clientePropietario.naturalezaReceptor,
      codigoPais: clientePropietario.codigoPais,
      tipoContribuyente: clientePropietario.tipoContribuyente,
      tipoDocIdentidad: clientePropietario.tipoDocIdentidad,
      email: clientePropietario.email,
      clienteSucursalId: sucursalPrincipal.id,
      nombre: sucursalPrincipal.nombre,
      direccion: sucursalPrincipal.direccion,
      telefono: sucursalPrincipal.telefono,
      cel: sucursalPrincipal.cel,
      latitud: sucursalPrincipal.latitud,
      longitud: sucursalPrincipal.longitud,
      listaPrecioId: sucursalPrincipal.listaPrecioId,
      condicionPagoId: sucursalPrincipal.condicionPagoId
    }

    res.status(200).json(respuestaMoldeada)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: error?.original?.detail || 'Error al buscar cliente predeterminado'
    })
  }
}
const findClienteCentralPaginado = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { page = 1, pageSize = 10, searchTerm } = req.params;

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    const condiciones = {
      empresaId,
      activo: true
    };

    if (searchTerm) {
      condiciones[Op.or] = [
        { razonSocial: { [Op.iLike]: `%${searchTerm.toLowerCase()}%` } },
        { nombreFantasia: { [Op.iLike]: `%${searchTerm.toLowerCase()}%` } },
        { nroDocumento: { [Op.iLike]: `%${searchTerm.toLowerCase()}%` } }
      ];
    }

    const { count, rows } = await Cliente.findAndCountAll({
      where: condiciones,
      offset,
      limit
    });
 

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page: Number(page),
      pageSize: Number(pageSize),
      clientes:rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error?.original?.detail || 'Error al buscar clientes'
    });
  }
};
const findClientesPaginados = async (req, res) => {
  try {
    const { empresaId } = req.usuario
    const { page = 1, pageSize = 10, searchTerm } = req.params

    const offset = (page - 1) * pageSize
    const limit = parseInt(pageSize)

    let condiciones = {
      empresaId,
      activo: true
    }

    if (searchTerm) {
      condiciones[Op.or] = [
        { nombre: { [Op.iLike]: `%${searchTerm.toLowerCase()}%` } },

        {
          '$cliente.razon_social$': {
            [Op.iLike]: `%${searchTerm.toLowerCase()}%`
          }
        },
        {
          '$cliente.nro_documento$': {
            [Op.iLike]: `%${searchTerm.toLowerCase()}%`
          }
        }
      ]
    }

    const { count, rows } = await ClienteSucursal.findAndCountAll({
      where: condiciones,
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: [
            'id',
            'razonSocial',
            'nombreFantasia',
            'nroDocumento',
            'email',
            'excentoIva',
            'puntos',
            'naturalezaReceptor',
            'codigoPais',
            'tipoContribuyente',
            'tipoDocIdentidad'
          ]
        },
        {
          model: CondicionPago,
          as: 'condicionPago',
          attributes: ['descripcion']
        },
        {
          model: ListaPrecio,
          as: 'listaPrecio',
          attributes: ['descripcion']
        }
      ],
      offset,
      limit
    })

    const clientes = rows.map(row => ({
      clienteSucursalId: row.id,
      clienteId: row.cliente.id,
      empresaId: row.empresaId,
      nombre: row.nombre,
      tipoOperacionId: row.cliente.tipoOperacionId,
      listaPrecioId: row.listaPrecioId,
      condicionPagoId: row.condicionPagoId,
      usuarioCreacionId: row.usuarioCreacionId,
      usuarioModificacionId: row.usuarioModificacionId,
      fechaCreacion: row.fechaCreacion,
      fechaModificacion: row.fechaModificacion,
      razonSocial: row.cliente.razonSocial,
      nombreFantasia: row.cliente.nombreFantasia,
      nroDocumento: row.cliente.nroDocumento,
      direccion: row.direccion,
      telefono: row.telefono,
      cel: row.cel,
      email: row.cliente.email,
      excentoIva: row.cliente.excentoIva,
      latitud: row.latitud?.toString(),
      longitud: row.longitud?.toString(),
      predeterminado: row.principal,
      empleado: false,
      propietario: false,
      activo: row.activo,
      puntos: row.cliente.puntos?.toString(),
      naturalezaReceptor: row.cliente.naturalezaReceptor,
      codigoPais: row.cliente.codigoPais,
      tipoContribuyente: row.cliente.tipoContribuyente,
      tipoDocIdentidad: row.cliente.tipoDocIdentidad,
      condicionPago: row.condicionPago
        ? { descripcion: row.condicionPago.descripcion }
        : null,
      listaPrecio: row.listaPrecio
        ? { descripcion: row.listaPrecio.descripcion }
        : null
    }))

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page: Number(page),
      pageSize: Number(pageSize),
      clientes
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        error: error?.original?.detail || 'Error al buscar clientes paginados'
      })
  }
}
// Método para buscar todos los clientes
const findAll = async (req, res) => {
  try {
    const { empresaId } = req.usuario
    const condiciones = empresaId ? { empresaId } : {}
    const clientes = await Cliente.findAll({ where: condiciones })
    res.status(200).json(clientes)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: error?.original?.detail || 'Error al buscar clientes' })
  }
}

// Método para crear un nuevo cliente
const create = async (req, res) => {
  const t = await Cliente.sequelize.transaction()
  try {
    const { empresaId, id: usuarioId } = req.usuario
    const {
      razonSocial,
      nombreFantasia,
      nroDocumento,
      tipoOperacionId,
      email,
      excentoIva = false,
      predeterminado = false,
      propietario = false,
      activo = true,
      naturalezaReceptor,
      codigoPais,
      tipoContribuyente,
      tipoDocIdentidad,
      obs
    } = req.body

    // Validar unicidad de propietario
    if (propietario) {
      const existingPropietario = await Cliente.findOne({
        where: { empresaId, propietario: true }
      })
      if (existingPropietario) {
        return res
          .status(400)
          .json({ error: 'Ya existe un cliente propietario.' })
      }
    }

    // Validar unicidad de predeterminado
    if (predeterminado) {
      const existingPredeterminado = await Cliente.findOne({
        where: { empresaId, predeterminado: true }
      })
      if (existingPredeterminado) {
        return res
          .status(400)
          .json({ error: 'Ya existe un cliente predeterminado.' })
      }
    }
    // Convertir a mayúsculas solo si tienen valor (por si vienen undefined o null)
    const razonSocialUpper = razonSocial ? razonSocial.toUpperCase() : null
    const nombreFantasiaUpper = nombreFantasia
      ? nombreFantasia.toUpperCase()
      : null
    const direccionUpper = null
    // Crear cliente
    const cliente = await Cliente.create(
      {
        empresaId,
        razonSocial: razonSocialUpper,
        nombreFantasia: nombreFantasiaUpper,
        nroDocumento,
        tipoOperacionId,
        email,
        excentoIva,
        predeterminado,
        propietario,
        activo,
        naturalezaReceptor,
        codigoPais,
        tipoContribuyente,
        tipoDocIdentidad,
        usuarioCreacionId: usuarioId,
        usuarioModificacionId: usuarioId
      },
      { transaction: t }
    )

    // Obtener listaPrecioId y condicionPagoId si no se enviaron
    const listaPrecio = await ListaPrecio.findOne({ where: { empresaId } })

    const condicionPago = await CondicionPago.findOne({ where: { empresaId } })

    if (!listaPrecio || !condicionPago) {
      await t.rollback()
      return res
        .status(400)
        .json({ error: 'Faltan datos de lista de precio o condición de pago.' })
    }

    // Crear sucursal principal
    await ClienteSucursal.create(
      {
        clienteId: cliente.id,
        empresaId,
        nombre: razonSocialUpper, // usa la misma variable en mayúscula
        direccion: direccionUpper,
        telefono: null,
        cel: null,
        latitud: null,
        longitud: null,
        principal: true,
        activo: true,
        listaPrecioId: listaPrecio.id,
        condicionPagoId: condicionPago.id,
        codigoPais,
        usuarioCreacionId: usuarioId,
        usuarioModificacionId: usuarioId,
        obs
      },
      { transaction: t }
    )

    await t.commit()
    res.status(201).json(cliente)
  } catch (error) {
    await t.rollback()
    console.error(error)
    res.status(500).json({
      error: error?.original?.detail || 'Error al crear el cliente'
    })
  }
}
const update = async (req, res) => {
  const t = await Cliente.sequelize.transaction()
  try {
    const { empresaId, id: usuarioId } = req.usuario
    const {
      id,
      razonSocial,
      nombreFantasia,
      nroDocumento,
      tipoOperacionId,
      email,
      excentoIva = false,
      predeterminado = false,
      propietario = false,
      activo = true,
      naturalezaReceptor,
      codigoPais,
      tipoContribuyente,
      tipoDocIdentidad
    } = req.body

    // Verificar si el cliente existe
    let cliente = await Cliente.findByPk(id)
    if (!cliente) {
      await t.rollback()
      return res.status(404).json({ error: 'El cliente no existe.' })
    }

    // Validar unicidad de propietario
    if (propietario) {
      const existingPropietario = await Cliente.findOne({
        where: {
          empresaId,
          propietario: true,
          id: { [Op.ne]: id }
        }
      })
      if (existingPropietario) {
        await t.rollback()
        return res
          .status(400)
          .json({ error: 'Ya existe un cliente propietario.' })
      }
    }

    // Validar unicidad de predeterminado
    if (predeterminado) {
      const existingPredeterminado = await Cliente.findOne({
        where: {
          empresaId,
          predeterminado: true,
          id: { [Op.ne]: id }
        }
      })
      if (existingPredeterminado) {
        await t.rollback()
        return res
          .status(400)
          .json({ error: 'Ya existe un cliente predeterminado.' })
      }
    }

    // Convertir a mayúsculas si tienen valor
    const razonSocialUpper = razonSocial ? razonSocial.toUpperCase() : null
    const nombreFantasiaUpper = nombreFantasia
      ? nombreFantasia.toUpperCase()
      : null

    // Verificar existencia de listaPrecio y condiciónPago
    const listaPrecio = await ListaPrecio.findOne({ where: { empresaId } })
    const condicionPago = await CondicionPago.findOne({ where: { empresaId } })

    if (!listaPrecio || !condicionPago) {
      await t.rollback()
      return res
        .status(400)
        .json({ error: 'Faltan datos de lista de precio o condición de pago.' })
    }

    // Actualizar cliente
    await cliente.update(
      {
        razonSocial: razonSocialUpper,
        nombreFantasia: nombreFantasiaUpper,
        nroDocumento,
        tipoOperacionId,
        email,
        excentoIva,
        predeterminado,
        propietario,
        activo,
        naturalezaReceptor,
        codigoPais,
        tipoContribuyente,
        tipoDocIdentidad,
        usuarioModificacionId: usuarioId
      },
      { transaction: t }
    )

    await t.commit()
    res.status(200).json(cliente)
  } catch (error) {
    await t.rollback()
    console.error(error)
    res.status(500).json({
      error: error?.original?.detail || 'Error al actualizar el cliente.'
    })
  }
}
const crearClienteConSucursal = async (req, res) => {
  const { empresaId, id: usuarioId } = req.usuario

  const t = await sequelize.transaction()
  try {
    const {
      razonSocial, // Debe asignar valor válido al enviar
      nombreFantasia,
      nroDocumento,
      email,
      excentoIva,
      predeterminado,
      propietario,
      tipoOperacionId,
      naturalezaReceptor,
      codigoPais,
      tipoContribuyente,
      tipoDocIdentidad,
      nombre,
      direccion,
      telefono,
      cel,
      latitud,
      longitud,
      listaPrecioId,
      condicionPagoId,
      obs,
      codDepartamento,
      codCiudad,
      codBarrio
    } = req.body

    // Crear cliente
    const nuevoCliente = await Cliente.create(
      {
        empresaId,
        razonSocial,
        nombreFantasia,
        nroDocumento,
        tipoOperacionId,
        email,
        excentoIva,
        predeterminado,
        propietario,
        naturalezaReceptor,
        codigoPais,
        tipoContribuyente,
        tipoDocIdentidad,
        usuarioCreacionId: usuarioId,
        usuarioModificacionId: usuarioId
      },
      { transaction: t }
    )
    // Crear sucursal principal asociada
    const nuevaSucursal = await ClienteSucursal.create(
      {
        clienteId: nuevoCliente.id,
        empresaId,
        nombre,
        direccion,
        telefono,
        cel,
        latitud,
        longitud,
        listaPrecioId,
        condicionPagoId,
        usuarioCreacionId: usuarioId,
        usuarioModificacionId: usuarioId,
        codDepartamento,
        codCiudad,
        codBarrio,
        obs
      },
      { transaction: t }
    )

    await t.commit()
    const clientePlano = nuevoCliente.get({ plain: true })
    const sucursalPlano = nuevaSucursal.get({ plain: true })

    res.status(201).json({
      ...clientePlano,
      clienteId: clientePlano.id,
      ...sucursalPlano,
      clienteSucursalId: sucursalPlano.id
    })
  } catch (error) {
    await t.rollback()
    console.error(error)
    res
      .status(500)
      .json({ message: 'Error al crear cliente con sucursal', error })
  }
}

const createSucursal = async (req, res) => {
  const t = await ClienteSucursal.sequelize.transaction()
  try {
    const { empresaId, id: usuarioId } = req.usuario
    const {
      clienteId,
      nombre,
      direccion,
      telefono,
      cel,
      latitud = 0,
      longitud = 0,
      principal = false,
      activo = true,
      listaPrecioId,
      condicionPagoId,
      codigoPais,
      codDepartamento,
      codCiudad,
      codBarrio,
      obs
    } = req.body

    // Validar que no exista otra sucursal principal
    if (principal) {
      const existingPrincipal = await ClienteSucursal.findOne({
        where: { clienteId, principal: true }
      })
      if (existingPrincipal) {
        return res
          .status(400)
          .json({
            error: 'Ya existe una sucursal principal para este cliente.'
          })
      }
    }

    // Crear sucursal
    const sucursal = await ClienteSucursal.create(
      {
        clienteId,
        empresaId,
        nombre: nombre?.toUpperCase() || null,
        direccion: direccion?.toUpperCase() || null,
        telefono,
        cel,
        latitud,
        longitud,
        principal,
        activo,
        listaPrecioId,
        condicionPagoId,
        codigoPais,
        usuarioCreacionId: usuarioId,
        usuarioModificacionId: usuarioId,
        codDepartamento,
        codCiudad,
        codBarrio,
        obs
      },
      { transaction: t }
    )
    await t.commit()
    const sucursalCreada = await ClienteSucursal.findByPk(sucursal.id, {
      include: [
        { model: ListaPrecio, as: 'listaPrecio' },
        { model: CondicionPago, as: 'condicionPago' },
        {
          model: Departamento,
          as: 'departamento',
          attributes: ['codigo', 'descripcion']
        },
        {
          model: Ciudad,
          as: 'ciudad',
          attributes: ['codigo', 'descripcion']
        },
        {
          model: Barrio,
          as: 'barrio',
          attributes: ['codigo', 'descripcion']
        }
      ]
    })
    res.status(201).json(sucursalCreada)
  } catch (error) {
    await t.rollback()
    console.error(error)
    res
      .status(500)
      .json({ error: error?.original?.detail || 'Error al crear la sucursal.' })
  }
}

const updateSucursal = async (req, res) => {
  const t = await ClienteSucursal.sequelize.transaction()
  try {
    const { empresaId, id: usuarioId } = req.usuario
    const {
      id,
      clienteId,
      nombre,
      direccion,
      telefono,
      cel,
      latitud = 0,
      longitud = 0,
      principal = false,
      activo = true,
      listaPrecioId,
      condicionPagoId,
      codDepartamento,
      codCiudad,
      codBarrio,
      obs
    } = req.body

    const sucursal = await ClienteSucursal.findByPk(id)
    if (!sucursal) {
      return res.status(404).json({ error: 'Sucursal no encontrada.' })
    }

    // Validar que no haya otra sucursal principal
    if (principal) {
      const existingPrincipal = await ClienteSucursal.findOne({
        where: {
          clienteId,
          principal: true
        }
      })

      if (existingPrincipal && existingPrincipal.id !== id) {
        return res
          .status(400)
          .json({
            error: 'Ya existe otra sucursal principal para este cliente.'
          })
      }
    }

    // Actualizar sucursal
    await sucursal.update(
      {
        nombre: nombre?.toUpperCase() || null,
        direccion: direccion?.toUpperCase() || null,
        telefono,
        cel,
        latitud,
        longitud,
        principal,
        activo,
        listaPrecioId,
        condicionPagoId,
        usuarioModificacionId: usuarioId,
        codDepartamento,
        codCiudad,
        codBarrio,
        obs
      },
      { transaction: t }
    )

    await t.commit()
    const sucursalActualizada = await ClienteSucursal.findByPk(sucursal.id, {
      include: [
        { model: ListaPrecio, as: 'listaPrecio' },
        { model: CondicionPago, as: 'condicionPago' }
      ]
    })
    res.status(200).json(sucursalActualizada)
  } catch (error) {
    await t.rollback()
    console.error(error)
    res
      .status(500)
      .json({
        error: error?.original?.detail || 'Error al actualizar la sucursal.'
      })
  }
}

// Método para desactivar un cliente (marcar como inactivo)
const disable = async (req, res) => {
  try {
    const { id } = req.params
    const cliente = await Cliente.findByPk(id)
    if (cliente) {
      await cliente.update({ activo: false })
      res.status(200).json({ message: 'Cliente desactivado exitosamente' })
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' })
    }
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        error: error?.original?.detail || 'Error al desactivar el cliente'
      })
  }
}

module.exports = {
  getById,
  findAll,
  create,
  update,
  createSucursal,
  updateSucursal,
  disable,
  findPredeterminado,
  findClientesPaginados,
  findClienteCentralPaginado,
  findPropietario,
  crearClienteConSucursal
}

