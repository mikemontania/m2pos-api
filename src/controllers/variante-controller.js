const { Op } = require("sequelize");
const Variante = require("../models/variante.model"); // Asegúrate de que la importación del modelo sea correcta
const { sequelize } = require("../../dbconfig");
const Unidad = require("../models/unidad.model");
const Variedad = require("../models/variedad.model");
const Presentacion = require("../models/presentacion.model");
const Producto = require("../models/producto.model");

// Método para buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const variante = await Variante.findByPk(id);
    if (variante) {
      res.status(200).json(variante);
    } else {
      res.status(404).json({ error: "Variante no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar la Variante por ID" });
  }
};

const findDescripcion = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const query = ` 
    select 
    x.id as id , 
    concat(x.cod_erp,' ',INITCAP(p.nombre) , ' ',v.descripcion ,' ',p2.descripcion  ) as concat  
    from  variantes x join productos p 
    on x.producto_id = p.id join variedades v 
    on x.variedad_id = v.id join presentaciones p2 
    on x.presentacion_id = p2.id 
    where x.empresa_id =:empresaId  
    `;
    const resultados = await sequelize.query(query, {
      replacements: { empresaId },
      type: sequelize.QueryTypes.SELECT
    });

    // Estructurar y enviar la respuesta
    res.status(200).json({
      resultados: resultados
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al obtener descripciones" });
  }
};

const findAllDesc = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { page = 1, pageSize = 10, descripcion } = req.params;

    let condiciones = {
      empresaId
    };
    if (descripcion) {
      condiciones[Op.or] = [
        { codErp: { [Op.iLike]: `%${descripcion.toLowerCase()}%` } },
        {
          "$producto.nombre$": {
            [Op.iLike]: `%${descripcion.toLowerCase()}%`
          }
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

    const { rows: variantes, count } = await Variante.findAndCountAll({
      where: condiciones,
      attributes: ["id", "codErp"],
      include: [
        {
          model: Presentacion,
          as: "presentacion",
          attributes: ["descripcion"]
        },
        {
          model: Variedad,
          as: "variedad",
          attributes: ["descripcion"]
        },
        {
          model: Producto,
          as: "producto",
          attributes: ["nombre"]
        }
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize
    });
    const variantesMap = variantes.map(variante => ({
      id: variante.id,
      concat: `${variante.codErp} - ${variante.producto.nombre} ${variante
        .variedad.descripcion} ${variante.presentacion.descripcion}`
    }));

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page: Number(page),
      pageSize: Number(pageSize),
      variantes: variantesMap
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al listar los productos" });
  }
};

const findAllByProducto = async (req, res) => {
  try {
    const { productoId } = req.params;
    const condiciones = {};
    condiciones.productoId = productoId;
    const variantes = await Variante.findAll({
      where: condiciones,
      include: [
        {
          model: Presentacion,
          as: "presentacion"
        },
        {
          model: Variedad,
          as: "variedad"
        },
        {
          model: Unidad,
          as: "unidad"
        },
        {
          model: Producto,
          as: "producto",
          attributes: ["id", "nombre"]
        }
      ]
    });

    res.status(200).json(variantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar Variantes" });
  }
};
// Método para buscar todas las Variantes
const findAll = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const condiciones = {};
    if (empresaId) condiciones.empresaId = empresaId;

    const variantes = await Variante.findAll({ where: condiciones });
    res.status(200).json(variantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al buscar Variantes" });
  }
};

// Método para crear una nueva Variante
const create = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const {
      porcIva,
      codBarra,
      codErp,
      presentacionId,
      variedadId,
      productoId,
      unidadId,
      activo
    } = req.body;
    const nuevaVariante = await Variante.create({
      porcIva,
      empresaId,
      codBarra,
      codErp,
      presentacionId,
      variedadId,
      productoId,
      unidadId,
      activo
    });
    res.status(201).json(nuevaVariante);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al crear la Variante" });
  }
};

// Método para actualizar una Variante por ID
const update = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { id } = req.params;
    const {
      porcIva,
      codBarra,
      codErp,
      presentacionId,
      variedadId,
      productoId,
      unidadId,
      activo
    } = req.body;
    const varianteActualizada = await Variante.findByPk(id);
    if (varianteActualizada) {
      await varianteActualizada.update({
        porcIva,
        codBarra,
        codErp,
        empresaId,
        presentacionId,
        variedadId,
        productoId,
        unidadId,
        activo
      });
      res.status(200).json(varianteActualizada);
    } else {
      res.status(404).json({ error: "Variante no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al actualizar la Variante" });
  }
};

// Método para desactivar una Variante (marcar como inactivo)
const disable = async (req, res) => {
  try {
    const { id } = req.params;
    const variante = await Variante.findByPk(id);
    if (variante) {
      await variante.update({ activo: false });
      res.status(200).json({ message: "Variante desactivada exitosamente" });
    } else {
      res.status(404).json({ error: "Variante no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   "Error al desactivar la Variante" });
  }
};

module.exports = {
  getById,
  findAllByProducto,
  findAll,
  create,
  update,
  disable,
  findAllDesc,
  findDescripcion
};
