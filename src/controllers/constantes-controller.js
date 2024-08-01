 
const {  const_tiposEmisiones,const_tiposTransacciones,const_tiposImpuestos,const_obligaciones,const_monedas,const_tipoReceptor,
  const_departamentos,const_distritos,const_ciudades,const_paises, const_tasasIsc,const_tipoContribuyente,
  const_codigosAfectaciones,const_unidadesMedidas,const_notasCreditosMotivos,const_condicionesTiposPagos 
} = require('../constantes/Constante.constant');

const getByTypeAndGroupId = async (req, res) => {
  try {
    const { type, grupoId } = req.params; // `grupoId` es el ID para filtrar

    let data;
    switch (type) {
      case 'distritos':
        data = const_distritos.filter(distrito => distrito.departamento === parseInt(grupoId));
        break;
      case 'ciudades':
        data = const_ciudades.filter(ciudad => ciudad.distrito === parseInt(grupoId));
        break;
      // Añadir más casos si es necesario
      default:
        return res.status(404).json({ error: 'Tipo de datos no encontrado' });
    }

    if (!data.length) {
      return res.status(404).json({ error: 'No se encontraron datos para el grupo especificado' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar datos' });
  }
};

const findAll = (req, res) => {
  try {
    const { type } = req.params; // El parámetro `type` define qué array devolver

    let data;
    switch (type) {
      case 'tiposEmisiones':
        data = const_tiposEmisiones;
        break;
      case 'tiposTransacciones':
        data = const_tiposTransacciones;
        break;
      case 'monedas':
        data = const_monedas;
        break;
      case 'tipoReceptor':
        data = const_tipoReceptor;
        break;
      case 'departamentos':
        data = const_departamentos;
        break;
      case 'distritos':
        data = const_distritos;
        break;
      case 'ciudades':
        data = const_ciudades;
        break;
      case 'paises':
        data = const_paises;
        break;
        case 'tipoContribuyente':
          data = const_tipoContribuyente;
          break;
      default:
        return res.status(404).json({ error: 'Tipo de datos no encontrado' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar datos' });
  }
};
 
module.exports = {
  getByTypeAndGroupId,
  findAll ,
   
};
