const { Op } = require('sequelize');
const Producto = require('../models/producto.model'); // Asegúrate de tener la ruta correcta
const Variante = require('../models/variante.model'); // Asegúrate de tener la ruta correcta
const Presentacion = require('../models/presentacion.model'); // Asegúrate de tener la ruta correcta
const Variedad = require('../models/variedad.model'); // Asegúrate de tener la ruta correcta
const Unidad = require('../models/unidad.model'); // Asegúrate de tener la ruta correcta

const listarProductos = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, descripcion } = req.query;

    const condiciones = {
      empresaId: req.empresaId,
    };

    if (descripcion) {
      condiciones[Op.or] = [
        { '$producto.nombre$': { [Op.iLike]: `%${descripcion}%` } },
        { '$variedad.descripcion$': { [Op.iLike]: `%${descripcion}%` } },
        { '$presentacion.descripcion$': { [Op.iLike]: `%${descripcion}%` } },
        // Agrega otras condiciones de búsqueda según tus modelos (marca, categoría, subcategoría, etc.)
      ];
    }

    const { rows: productos, count } = await Producto.findAndCountAll({
      where: condiciones,
      include: [
        {
          model: Variante,
          as: 'variantes',
          attributes: ['id', 'porcIva', 'activo'],
          include: [
            { model: Presentacion, as: 'presentacion', attributes: ['id', 'descripcion', 'activo'] },
            { model: Variedad, as: 'variedad', attributes: ['id', 'descripcion', 'activo'] },
            { model: Unidad, as: 'unidad', attributes: ['id', 'descripcion', 'activo'] },
          ],
        },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page: Number(page),
      pageSize: Number(pageSize),
      productos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al listar los productos' });
  }
};

module.exports = {
  listarProductos,
};
