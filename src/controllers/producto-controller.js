const { Op } = require("sequelize");
const Producto = require("../models/producto.model"); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require("../../dbconfig");
const Variante = require("../models/variante.model");
const Presentacion = require("../models/presentacion.model");
const Variedad = require("../models/variedad.model");
const Precio = require("../models/precio.model");

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (producto) {
      res.status(200).json(producto);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar el producto por ID" });
  }
};

// Método para buscar todos los productos
const findAll = async (req, res) => {
  try {
    const { empresaId, marcaId, categoriaId, subCategoriaId } = req.params;
    const condiciones = {};
    if (empresaId) condiciones.empresaId = empresaId;
    if (marcaId) condiciones.marcaId = marcaId;
    if (categoriaId) condiciones.categoriaId = categoriaId;
    if (subCategoriaId) condiciones.subCategoriaId = subCategoriaId;

    const productos = await Producto.findAll({ where: condiciones });
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar productos" });
  }
};

// Método para crear un nuevo producto
const create = async (req, res) => {
  try {
    const {
      empresaId,
      marcaId,
      categoriaId,
      subCategoriaId,
      nombre,
      descripcion,
      activo
    } = req.body;
    const producto = await Producto.create({
      empresaId,
      marcaId,
      categoriaId,
      subCategoriaId,
      nombre,
      descripcion,
      activo
    });
    res.status(201).json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

// Método para actualizar un producto por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      empresaId,
      marcaId,
      categoriaId,
      subCategoriaId,
      nombre,
      descripcion,
      activo
    } = req.body;
    const producto = await Producto.findByPk(id);
    if (producto) {
      await producto.update({
        empresaId,
        marcaId,
        categoriaId,
        subCategoriaId,
        nombre,
        descripcion,
        activo
      });
      res.status(200).json(producto);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

// Método para desactivar un producto (marcar como inactivo)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (producto) {
      await producto.update({ activo: false });
      res.status(200).json({ message: "Producto desactivado exitosamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al desactivar el producto" });
  }
};

const findProductosPaginados = async (req, res) => {
  const fechaActual = new Date();
  try {
    const { empresaId } = req.usuario;
    const {
      page = 1,
      pageSize = 10,
      descripcion,
      marcaId,
      categoriaId,
      subCategoriaId
    } = req.params;

    let condiciones = {
      empresaId,
      activo: true
    };
    if (descripcion) {
      condiciones[Op.or] = [
        { codErp: { [Op.iLike]: `%${descripcion.toLowerCase()}%` } },
        { codBarra: { [Op.iLike]: `%${descripcion.toLowerCase()}%` } },
        {
          "$producto.nombre$": { [Op.iLike]: `%${descripcion.toLowerCase()}%` }
        },
        {
          "$variedad.descripcion$": {
            [Op.iLike]: `%${descripcion.toLowerCase()}%`
          }
        },
        {
          "$presentacion.descripcion$": {
            [Op.iLike]: `%${descripcion.toLowerCase()}%`
          }
        }
      ];
    }

    if (marcaId && marcaId != 0) {
      condiciones["$producto.marcaId$"] = marcaId;
    }

    if (categoriaId && categoriaId != 0) {
      condiciones["$producto.categoriaId$"] = categoriaId;
    }

    if (subCategoriaId && subCategoriaId != 0) {
      condiciones["$producto.subCategoriaId$"] = subCategoriaId;
    }

    const { rows: productos, count } = await Variante.findAndCountAll({
      where: condiciones,
      include: [
        {
          model: Producto,
          as: "producto",
          attributes: [
            "id",
            "nombre",
            "activo",
            "marcaId",
            "categoriaId",
            "subCategoriaId"
          ],
          where: { activo: true }
          /*  include: [
          
            { model: Marca, as: 'marca', attributes: ['id', 'descripcion', 'activo'] },
            { model: Categoria, as: 'categoria', attributes: ['id', 'descripcion', 'activo'] },
            { model: SubCategoria, as: 'subCategoria', attributes: ['id', 'descripcion', 'activo'] },
          ], */
        },
        {
          model: Presentacion,
          as: "presentacion",
          attributes: ["id", "descripcion"]
        },
        {
          model: Variedad,
          as: "variedad",
          attributes: ["id", "descripcion", "color"]
        }
      ],
      attributes: ["id", "codBarra", "codErp", "img"],
      offset: (page - 1) * pageSize,
      limit: pageSize
    });

    const productosMapsPromises = productos.map(async producto => {
      const precio = await Precio.findOne({
        prodVarianteId: producto.get("id"),
        activo: true,
        fechaDesde: { [Op.lte]: fechaActual },
        fechaHasta: { [Op.gte]: fechaActual },
        listaPrecioId: 1
      });

      return {
        id: producto.get("id"),
        codBarra: producto.get("codBarra"),
        codErp: producto.get("codErp"),
        img: producto.get("img"),
        producto: producto.producto.get("nombre"),
        presentacion: producto.presentacion.get("descripcion"),
        variedad: producto.variedad.get("descripcion"),
        color: producto.variedad.get("color"),
        precio: precio ? precio.precio : undefined
      };
    });

    const productosMaps = await Promise.all(productosMapsPromises);
    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page: Number(page),
      pageSize: Number(pageSize),
      productos: productosMaps
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar los productos" });
  }
};

module.exports = {
  getById,
  findAll,
  create,
  update,
  disable,
  findProductosPaginados
};
