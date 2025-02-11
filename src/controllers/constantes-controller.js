 
const {  tiposEmisiones,tiposTransacciones,tiposImpuestos,obligaciones,monedas,tipoReceptor,
  departamentos,distritos,ciudades,paises, tasasIsc,tipoContribuyente,
  codigosAfectaciones,unidadesMedidas,notasCreditosMotivos,condicionesTiposPagos 
} = require('../constantes/Constante.constant');

const getByTypeAndGroupId = async (req, res) => {
  try {
    const { type, grupoId } = req.params; // `grupoId` es el ID para filtrar

    let data;
    switch (type) {
      case 'distritos':
        data = distritos.filter(distrito => distrito.departamento === parseInt(grupoId));
        break;
      case 'ciudades':
        data = ciudades.filter(ciudad => ciudad.distrito === parseInt(grupoId));
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
        data = tiposEmisiones;
        break;
      case 'tiposTransacciones':
        data = tiposTransacciones;
        break;
      case 'monedas':
        data = monedas;
        break;
      case 'tipoReceptor':
        data = tipoReceptor;
        break;
      case 'departamentos':
        data = departamentos;
        break;
      case 'distritos':
        data = distritos;
        break;
      case 'ciudades':
        data = ciudades;
        break;
      case 'paises':
        data = paises;
        break;
        case 'tipoContribuyente':
          data = tipoContribuyente;
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
