const Usuario = require('../models/usuario.model'); 
const Variante = require('../models/variante.model');
const Empresa = require('../models/empresa.model');
const fs = require('fs');

const borrarImagen = ( path ) => {
    if ( fs.existsSync( path ) ) {
        // borrar la imagen anterior
        fs.unlinkSync( path );
    }
}


const actualizarImagen = async(tipo, id, nombreArchivo) => {

    let pathViejo = '';
    
    switch( tipo ) {
        case 'productos':
            const variante = await Variante.findByPk(id);
            if ( !variante ) {
                console.log('No es un productos por id');
                return false;
            }

            pathViejo = `./uploads/productos/${ variante.img }`;
            borrarImagen( pathViejo );

            variante.img = nombreArchivo;
            await variante.save();
            return true;

        break;
        
        case 'empresas':
            const empresa = await Empresa.findByPk(id);
            if ( !empresa ) {
                console.log('No es un empresa por id');
                return false;
            }

            pathViejo = `./uploads/empresas/${ empresa.img }`;
            borrarImagen( pathViejo );

            empresa.img = nombreArchivo;
            await empresa.save();
            return true;

        break;
        
        case 'usuarios':

            const usuario = await Usuario.findByPk(id);
            if ( !usuario ) {
                console.log('No es un usuario por id');
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen( pathViejo );

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

        break;
    }


}



module.exports = { 
    actualizarImagen
}
