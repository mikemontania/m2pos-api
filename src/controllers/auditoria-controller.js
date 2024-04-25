const { Op } = require("sequelize");
const Auditoria = require("../models/auditoria.model");
const Usuario = require("../models/usuario.model");
const Sucursal = require("../models/sucursal.model");


const getListPaginado = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const {
      page = 1,
      pageSize = 10,
      searchTerm,
      fechaDesde,
      fechaHasta
    } = req.params;
    const condiciones = { empresaId };

    const desde = moment(fechaDesde).format("YYYY-MM-DD");
    const hasta = moment(fechaHasta).format("YYYY-MM-DD");
    console.log(fechaDesde);
    console.log(desde);
    if (desde && hasta) {
      condiciones.fechaVenta = {
        [Op.lte]: desde,
        [Op.gte]: hasta
      };
    }
    // Añadir condiciones para búsqueda por nroDocumento o razonSocial
    if (searchTerm && searchTerm !== "") {
      condiciones[Op.or] = [
        {
          path: {
            [Op.iLike]: `%${searchTerm.toLowerCase()}%` // Convertir a minúsculas
          }
        },
        {
          type: {
            [Op.iLike]: `%${searchTerm.toLowerCase()}%` // Convertir a minúsculas
          }
        },
        {
          detalles: {
            [Op.iLike]: `%${searchTerm.toLowerCase()}%` // Convertir a minúsculas
          }
        },
        {
          status: {
            [Op.iLike]: `%${searchTerm.toLowerCase()}%` // Convertir a minúsculas
          }
        },
        {
          mensaje: {
            [Op.iLike]: `%${searchTerm.toLowerCase()}%` // Convertir a minúsculas
          }
        },
        {
          "$usuario.username$": {
            [Op.iLike]: `%${descripcion.toLowerCase()}%`
          }
        },
        {
          "$usuario.usuario$": {
            [Op.iLike]: `%${descripcion.toLowerCase()}%`
          }
        }
      ];
    }
    const offset = (page - 1) * pageSize;
    // Realizar la consulta paginada
    const { count, rows: auditados } = await Auditoria.findAndCountAll({
      where: condiciones,
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "username", "usuario"]
        },
        {
          model: Sucursal,
          as: "sucursalUsuario",
          attributes: ["id", "descripcion"]
        }
      ],
      limit: pageSize,
      offset
    });

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page: Number(page),
      pageSize: Number(pageSize),
      auditados
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar clientes paginados" });
  }
};
const deletebyId = async (req, res) => {
  const { id } = req.params;
  try {
    const audit = await Auditoria.findByPk(id);

    if (!audit) {
      throw new Error("No se encontró la auditortia con el ID proporcionado");
    }

    await Auditoria.destroy();

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ ok: false, error: "Error al eliminar la auditoria." });
  }
};

module.exports = {
 
  getListPaginado,
  deletebyId
};
