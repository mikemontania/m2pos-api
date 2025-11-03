const { Op } = require('sequelize');
const Empresa = require('../models/empresa.model');
const { sequelize } = require('../../dbconfig');
const Actividad = require('../models/actividad.model');
const EmpresaActividad = require('../models/empresaActividad.model');
const { encryptPassphrase, decryptPassphrase } = require('../helpers/encript-helper');

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findByPk(id);
    if (empresa) {
     
    // 🧹 Eliminar la contraseña antes de enviar la respuesta
    const empresaSafe = empresa.toJSON();
    // Indicar si existe contraseña sin enviarla
    empresaSafe.hasEmailPass = !!empresa.emailPass;
    delete empresaSafe.emailPass;

    res.status(200).json(empresaSafe);
    } else {
      res.status(404).json({ error: 'empresa no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar el empresa por ID' });
  }
};
const getData = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const empresa = await Empresa.findByPk(empresaId);
    if (empresa) {
      
    const empresaSafe = empresa.toJSON();
     if (empresa.emailPass)  
       empresaSafe.emailPass = await decryptPassphrase(empresa.emailPass);  

    res.status(200).json(empresaSafe);
    } else {
      res.status(404).json({ error: 'empresa no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al buscar el empresa por ID' });
  }
};
 
 

const update= async (req, res) => {
  try {
    const { id } = req.params;
    const { razonSocial,  ruc, telefono, email,emailEnvio, nombreFantasia,
      moneda,
      codMoneda,
      simboloMoneda,
      tipoContId,
      numCasa,
      codDepartamento,
      codCiudad,
      codBarrio, 
      web,produccion,
      envioKude,
       emailUser,
      emailPass,
      modoSifen } = req.body;

    // Buscar la empresa por su ID
    const empresa = await Empresa.findByPk(id);
 
    // Verificar si la empresa existe
    if (empresa) {


      if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    // 🔐 Encriptar la contraseña solo si viene en el body
    let encryptedPass = empresa.emailPass; // mantener la actual si no viene nueva
    if (emailPass &&  emailPass.length>0 ) {
      encryptedPass = encryptPassphrase(emailPass);
    }
    else{
      encryptedPass = empresa.emailPass ;
    }
      // Actualizar los campos de la empresa
      await empresa.update({ razonSocial, ruc, telefono, email,emailEnvio,nombreFantasia,
        moneda,
        codMoneda,
        simboloMoneda,
        tipoContId,
        numCasa,
        codDepartamento,
        codCiudad,produccion,
        codBarrio,  
        web,envioKude,
        modoSifen , 
      emailUser,
      emailPass: encryptedPass});

      // Responder con la empresa actualizada
      res.status(200).json(empresa);
    } else {
      // Si la empresa no se encuentra, responder con un error 404
      res.status(404).json({ error: 'Empresa no encontrada' });
    }
  } catch (error) {
    // Si ocurre un error durante el proceso, responder con un error 500
    console.error(error);
    res.status(500).json({ error: error?.original?.detail ||   'Error al actualizar la empresa' });
  }
};
 // Agregar actividades a una empresa
const agregarActividadAEmpresa  = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const {   codigo, descripcion } = req.body; // Recibe un array de IDs de actividades

    const empresa = await Empresa.findByPk(empresaId);
    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }
 
      let  actividad = await Actividad.create({ codigo, descripcion });
      
      await EmpresaActividad.create({ empresaId, actividadId: actividad.id });
   

    return res.json({ message: "Actividad agregada correctamente", actividad });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const obtenerActividadesPorEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.usuario;

    const data = await EmpresaActividad.findAll({
      where: {   empresaId },
      include: [{ model: Actividad, as: 'actividades' }]
    });
 
    
    if (!data) {
      return res.status(200).json([]);
    }


    const actividades = data.map(d => ({
     ...d.actividades['dataValues']
    }))
 
    return res.json(actividades);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


// Eliminar actividad de una empresa
const eliminarActividadDeEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const {  actividadId } = req.params;

    await EmpresaActividad.destroy({
      where: { empresaId, actividadId }
    });
    await Actividad.destroy({
      where: { id:actividadId }
    }); 
    return res.json({ message: "Actividad eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
 
module.exports = {
  getById,getData,
  update ,
  agregarActividadAEmpresa,
  obtenerActividadesPorEmpresa,
  eliminarActividadDeEmpresa
};
