const Usuario = require("../models/usuario.model");
const Variante = require("../models/variante.model");
const Empresa = require("../models/empresa.model");
const fs = require("fs");
const Certificado = require("../models/certificado.model");

const borrarPath = path => {
  console.log('borrarPath() ',path)
  if (fs.existsSync(path)) {
    // borrar la imagen anterior
    fs.unlinkSync(path);
  }
};

const actualizarImagen = async (tipo, id, nombreArchivo) => {
  let pathViejo = "";

  switch (tipo) {
    case "productos":
      const variante = await Variante.findByPk(id);
      if (!variante) {
        console.log("No es un productos por id");
        return false;
      }

      pathViejo = `./uploads/productos/${variante.img}`;
      borrarPath(pathViejo);

      variante.img = nombreArchivo;
      const newdataa = await variante.save();
      return newdataa;

      break;

    case "empresas":
      const empresa = await Empresa.findByPk(id);
      if (!empresa) {
        console.log("No es un empresa por id");
        return false;
      }

      pathViejo = `./uploads/empresas/${empresa.img}`;
      borrarPath(pathViejo);

      empresa.img = nombreArchivo;
      const newdatab = await empresa.save();
      console.log(newdatab);
      return newdatab;

      break;

    case "usuarios":
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        console.log("No es un usuario por id");
        return false;
      }

      pathViejo = `./uploads/usuarios/${usuario.img}`;
      borrarPath(pathViejo);

      usuario.img = nombreArchivo;
      const newdatac = await usuario.save();
      return newdatac;

      break;
  }
};
const actualizarP12 = async (id, nombreArchivo) => {
  const certificado = await Certificado.findByPk(id);
  if (!certificado) {
    console.log("No es un certificado por id");
    return false;
  }

  pathViejo = `./src/certificado/${certificado.path}`;
  if (certificado.path && certificado.path.length >5) {
    borrarPath(pathViejo);
  }

  certificado.path = nombreArchivo;
  const newdataa = await certificado.save();
};

module.exports = {
  actualizarImagen,
    actualizarP12
};
