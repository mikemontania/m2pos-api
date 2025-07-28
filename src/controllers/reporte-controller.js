const { Op } = require('sequelize');  
const Reporte = require('../models/reporte.model');
const { sequelize } = require('../../dbconfig');



const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const reporte = await Reporte.findByPk(id);
    if (!reporte) return res.status(404).json({ mensaje: 'Reporte no encontrado' });
    return res.json(reporte);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener reporte', error: error.message });
  }
};

const search = async (req, res) => {
  const { empresaId } = req.usuario;
  const search = req.params.search || ""; // valor vacío si no se envió

  try {
    const where = { empresaId };

    if (search) {
      where.reporte = {
        [Op.iLike]: `%${search}%`
      };
    }

    const reportes = await Reporte.findAll({ where });
    return res.json(reportes);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al obtener reportes',
      error: error.message
    });
  }
};
const obtenerParametrosDelQuery = (query) => {
  const regex = /:(\w+)/g;
  const params = new Set();
  let match;
  while ((match = regex.exec(query)) !== null) {
    if (match[1] !== 'empresaId') {  // omitimos empresaId
      params.add(match[1]);
    }
  }
  return Array.from(params);
};
 
 const obtenerTablasDelQuery = (query) => {
  // Expresión regular que busca las palabras FROM o JOIN seguidas de un nombre de tabla
  // También considera posibles alias después del nombre de tabla
  const regex = /\b(?:from|join)\s+([a-zA-Z0-9_\."]+)(?:\s+as)?\s+[a-zA-Z0-9_]+|\b(?:from|join)\s+([a-zA-Z0-9_\."]+)/gi;

  // Array donde se almacenarán los nombres de tablas encontrados
  const tablas = [];

  // Variable para almacenar las coincidencias encontradas por regex.exec()
  let match;

  // Ejecuta el regex sobre el query tantas veces como haya coincidencias
  while ((match = regex.exec(query)) !== null) {
    // match[1] o match[2] contienen el nombre de la tabla encontrada
    const tabla = match[1] || match[2];

    if (tabla) {
      // Remueve comillas dobles si las hubiera en el nombre de tabla y agrega a la lista
      tablas.push(tabla.replace(/"/g, ''));
    }
  }

  // Devuelve un array sin duplicados (convierte a Set y luego a array)
  return [...new Set(tablas)];
};

const tablaTieneEmpresaId = async (tablaCompleta) => {
  // Define esquema y tabla; si no se especifica esquema, se asume 'public'
  let [schema, tabla] = ['public', tablaCompleta];

  // Si el nombre de tabla incluye un esquema separado por '.', lo separa en schema y tabla
  if (tablaCompleta.includes('.')) {
    [schema, tabla] = tablaCompleta.split('.');
  }

  // Ejecuta consulta SQL para verificar si la tabla tiene una columna llamada 'empresa_id'
  const [result] = await sequelize.query(`
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = :schema 
      AND table_name = :tabla 
      AND column_name = 'empresa_id'
    LIMIT 1
  `, {
    // Reemplaza los parámetros para evitar inyección SQL
    replacements: { schema, tabla },

    // Indica que es una consulta SELECT y queremos los datos resultantes
    type: sequelize.QueryTypes.SELECT
  });

  // Devuelve true si se encontró la columna empresa_id, false si no
  return !!result;
};

const inyectarFiltroEmpresaId = (query) => {
  const lowerQuery = query.toLowerCase();

  // Detecta el alias principal en FROM
  const aliasMatch = query.match(/\bfrom\s+([a-zA-Z0-9_\."]+)(?:\s+(?:as\s+)?([a-zA-Z0-9_]+))?/i);
  if (!aliasMatch) return query;

  const alias = aliasMatch[2] || aliasMatch[1]; // Usa alias si hay, si no, el nombre de la tabla

  const filtro = `${alias}.empresa_id = :empresaId`;

  // Verifica si ya hay cláusula WHERE
  const whereMatch = query.match(/\bwhere\b/i);

  if (whereMatch) {
    return query.replace(/\bwhere\b/i, `WHERE ${filtro} AND`);
  } else {
    // Intenta inyectar antes del primer GROUP BY, ORDER BY o al final
    const insertPos = query.search(/\bgroup\s+by\b|\border\s+by\b/i);
    if (insertPos !== -1) {
      return `${query.slice(0, insertPos)} WHERE ${filtro} ${query.slice(insertPos)}`;
    } else {
      return `${query} WHERE ${filtro}`;
    }
  }
};
const esQuerySelect = (query) => {
  const lower = query.trim().toLowerCase();
  return lower.startsWith('select') && !/;\s*(update|delete|insert|drop|alter)/i.test(lower);
};
const create = async (req, res) => {
  const { empresaId } = req.usuario;
  const { reporte, query, parametros, createdBy } = req.body;

  if (!query || !esQuerySelect(query)) {
    return res.status(400).json({ error: 'El query debe ser una sentencia SELECT válida y segura' });
  }

  const tablas = obtenerTablasDelQuery(query);
  let algunaTieneEmpresaId = false;

  for (const tabla of tablas) {
    if (await tablaTieneEmpresaId(tabla)) {
      algunaTieneEmpresaId = true;
      break;
    }
  }

  let queryFinal = query;
  const queryLower = query.toLowerCase();

  if (algunaTieneEmpresaId && !queryLower.includes('empresa_id')) {
    queryFinal = inyectarFiltroEmpresaId(query);
  }

  if (!reporte?.trim()) {
    return res.status(400).json({ error: 'La descripción del reporte es obligatoria' });
  }

  // VALIDACIÓN DE PARÁMETROS:
  const parametrosEnQuery = obtenerParametrosDelQuery(queryFinal);
  const parametrosRecibidos = Object.keys(parametros || {});

  // Permitir 'empresaId' como excepción, ya que se inyecta desde el token
  const parametrosValidos = new Set([...parametrosEnQuery, 'empresaId']);

  const faltantes = parametrosEnQuery.filter(p => !parametrosRecibidos.includes(p));
  const extras = parametrosRecibidos.filter(p => !parametrosValidos.has(p));

  if (faltantes.length > 0) {
    return res.status(400).json({ error: `Faltan parámetros requeridos en el cuerpo: ${faltantes.join(', ')}` });
  }
  if (extras.length > 0) {
    return res.status(400).json({ error: `Parámetros no permitidos enviados: ${extras.join(', ')}` });
  }

  try {
    const nuevo = await Reporte.create({
      empresaId,
      reporte,
      query: queryFinal,
      parametros,
      createdBy
    });

    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear el reporte', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { id } = req.params;
    const { reporte, query, parametros } = req.body;

    if (!reporte?.trim()) {
      return res.status(400).json({ error: 'La descripción del reporte es obligatoria' });
    }

    if (!query || !esQuerySelect(query)) {
      return res.status(400).json({ error: 'El query debe ser una sentencia SELECT válida y segura' });
    }

    const reporteUp = await Reporte.findByPk(id);

    if (!reporteUp) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    const tablas = obtenerTablasDelQuery(query);
    let algunaTieneEmpresaId = false;

    for (const tabla of tablas) {
      if (await tablaTieneEmpresaId(tabla)) {
        algunaTieneEmpresaId = true;
        break;
      }
    }

    let queryFinal = query;
    const queryLower = query.toLowerCase();

    if (algunaTieneEmpresaId && !queryLower.includes('empresa_id')) {
      queryFinal = inyectarFiltroEmpresaId(query);
    }

    // VALIDACIÓN DE PARÁMETROS:
    const parametrosEnQuery = obtenerParametrosDelQuery(queryFinal);
    const parametrosRecibidos = Object.keys(parametros || {});

    const parametrosValidos = new Set([...parametrosEnQuery, 'empresaId']);

    const faltantes = parametrosEnQuery.filter(p => !parametrosRecibidos.includes(p));
    const extras = parametrosRecibidos.filter(p => !parametrosValidos.has(p));

    if (faltantes.length > 0) {
      return res.status(400).json({ error: `Faltan parámetros requeridos en el cuerpo: ${faltantes.join(', ')}` });
    }
    if (extras.length > 0) {
      return res.status(400).json({ error: `Parámetros no permitidos enviados: ${extras.join(', ')}` });
    }

    await reporteUp.update({
      empresaId,
      reporte,
      query: queryFinal,
      parametros
    });

    res.status(200).json(reporteUp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || 'Error al actualizar el reporte' });
  }
};




const ejecutarReporte = async (req, res) => {
  const { empresaId } = req.usuario;
  const { id } = req.params;
  const parametros = req.body; // { fecha_inicio: '2024-01-01', ... }

  try {
    const reporte = await Reporte.findByPk(id);

    if (!reporte) {
      return res.status(404).json({ mensaje: 'Reporte no encontrado' });
    }

    if (reporte.empresaId !== empresaId) {
      return res.status(403).json({ mensaje: 'No tienes acceso a este reporte' });
    }

    const resultados = await sequelize.query(reporte.query, {
      replacements: { ...parametros, empresaId },
      type: sequelize.QueryTypes.SELECT
    });

   const resultadosTransformados = resultados.map(fila => {
  const nuevo = {};
  for (const clave in fila) {
    const valor = fila[clave];

    // Verificamos si es string numérico con .00 y lo convertimos a número
    if (typeof valor === 'string' && /^\d+\.00$/.test(valor)) {
      nuevo[clave] = parseInt(valor); // O parseFloat(valor) si preferís mantener decimales
    } else {
      nuevo[clave] = valor;
    }
  }
  return nuevo;
});

return res.json(resultadosTransformados);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al ejecutar el reporte', error: error.message });
  }
};

module.exports = {
  getById,
  search,
  create,
  update,
  ejecutarReporte
};