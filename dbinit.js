 
const Bcryptjs = require('bcryptjs');
const Usuario = require('./src/models/usuario.model');
const Empresa = require('./src/models/empresa.model');
const Sucursal = require('./src/models/sucursal.model');
const populateDB = async () => {
    console.log('populateDB');
    if (process.env.DB_INIT == 'true') {
        console.log('Inicializando registros en DB!');

        // Crear empresa
        const empresa = await Empresa.create({
            razonSocial: 'Cavallaro',
            nombreComercial: 'Cavallaro',
            ruc: '5555555-5', // RUC de ejemplo
            telefono: '123456789',
            email: 'cavallaro@example.com',
        });

        // Crear sucursal asociada a la empresa
        const sucursal = await Sucursal.create({
            descripcion: 'Sucursal Principal',
            direccion: 'Dirección de la Sucursal',
            telefono: '987654321',
            empresasId: empresa.id,
            email: 'sucursal@example.com',
        });

        // Crear usuario asociado a la empresa y sucursal
        const salt = Bcryptjs.genSaltSync();
        const userAdmin = await Usuario.create({
            empresaId: empresa.id,
            sucursalesId: sucursal.id,
            username: 'admin@admin.com',
            password: Bcryptjs.hashSync('123', salt),
            img: '',
            rol: 'admin', // Puedes ajustar el rol según tus necesidades
            intentos: 0,
            activo: true,
            bloqueado: false,
        });

        console.log('Registros creados exitosamente!');
    }
};

module.exports = { populateDB };