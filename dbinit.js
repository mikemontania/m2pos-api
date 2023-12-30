 
const Bcryptjs = require('bcryptjs');
const Usuario = require('./src/models/usuario.model');
const Empresa = require('./src/models/empresa.model');
const Sucursal = require('./src/models/sucursal.model');
const Unidad = require('./src/models/unidad.model');
const Marca = require('./src/models/marca.model');
const Categoria = require('./src/models/categoria.model');
const SubCategoria = require('./src/models/subCategoria.model');
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
 
 
           const categoria1 =await Categoria.create( { descripcion: 'Higiene Personal', activo: true, empresaId: empresa.id });
           const categoria2 =await Categoria.create( { descripcion: 'Cuidado de las Prendas', activo: true, empresaId: empresa.id });
           const categoria3 =await Categoria.create( { descripcion: 'Limpieza y Desinfección del Hogar', activo: true, empresaId: empresa.id });
       
         const subCategoria1 =await SubCategoria.create(   { descripcion: 'Coco tocador', activo: true, empresaId: empresa.id  });
         const subCategoria2 =await SubCategoria.create(   { descripcion: 'Suavizante', activo: true, empresaId: empresa.id  });
         const subCategoria3 =await SubCategoria.create(   { descripcion: 'Combos', activo: true, empresaId: empresa.id  });
         const subCategoria4 =await SubCategoria.create(   { descripcion: 'Desodorante de ambiente', activo: true, empresaId: empresa.id  });
         const subCategoria5 =await SubCategoria.create(   { descripcion: 'Detergente lavavajilla', activo: true, empresaId: empresa.id  });
         const subCategoria6 =await SubCategoria.create(   { descripcion: 'Lavandina', activo: true, empresaId: empresa.id  });
         const subCategoria7 =await SubCategoria.create(   { descripcion: 'Coco Puro', activo: true, empresaId: empresa.id  });
         const subCategoria8 =await SubCategoria.create(   { descripcion: 'Polvo para lavar la ropa', activo: true, empresaId: empresa.id });
         const subCategoria9 =await SubCategoria.create(   { descripcion: 'Coco multiuso', activo: true, empresaId: empresa.id  });
         const subCategoria10 =await SubCategoria.create(   { descripcion: 'Bolsas para residuos', activo: true, empresaId: empresa.id  });
         const subCategoria11 =await SubCategoria.create(   { descripcion: 'Trapo de piso', activo: true, empresaId: empresa.id  });
         const subCategoria12 =await SubCategoria.create(   { descripcion: 'Limpiador', activo: true, empresaId: empresa.id  });
         const subCategoria13 =await SubCategoria.create(   { descripcion: 'Jabón en pan / Barra para lavar la ropa', activo: true, empresaId: empresa.id  });
         const subCategoria14 =await SubCategoria.create(   { descripcion: 'Jabón hotelero', activo: true, empresaId: empresa.id  });


        // Inserta las unidades en la base de datos
       const unidad1 =await Unidad.create({ unidad_cod: 'UN', unidad: 'Unidad', empresaId: empresa.id, activo: true });
       const unidad2 =await Unidad.create({ unidad_cod: 'CJ', unidad: 'Caja', empresaId: empresa.id, activo: true });
       const unidad3 =await Unidad.create({ unidad_cod: 'DSP', unidad: 'Display', empresaId: empresa.id, activo: true });
       const unidad4 =await Unidad.create({ unidad_cod: 'ROL', unidad: 'Rollo', empresaId: empresa.id, activo: true });
       const unidad5 =await Unidad.create({ unidad_cod: 'PCK', unidad: 'Pack', empresaId: empresa.id, activo: true });

 
        const marca1 =await Marca.create({ descripcion: 'Cavallaro', activo: true, empresaId: empresa.id });
        const marca2 =await Marca.create({ descripcion: 'Pixol', activo: true, empresaId: empresa.id });
        const marca3 =await Marca.create({ descripcion: 'Agricultor', activo: true, empresaId: empresa.id });
        const marca4 =await Marca.create({ descripcion: 'C Glicerina', activo: true, empresaId: empresa.id });
        const marca5 =await Marca.create({ descripcion: 'C2', activo: true, empresaId: empresa.id });
        const marca6 =await Marca.create({ descripcion: 'Guairá Extra', activo: true, empresaId: empresa.id });
        const marca7 =await Marca.create({ descripcion: 'Guairá Deluxe', activo: true, empresaId: empresa.id });
        const marca8 =await Marca.create({ descripcion: 'Insuperable', activo: true, empresaId: empresa.id });
        const marca9 =await Marca.create({ descripcion: 'Guairá Profesional', activo: true, empresaId: empresa.id });
        const marca10 =await Marca.create({ descripcion: 'IO', activo: true, empresaId: empresa.id });
        const marca11 =await Marca.create({ descripcion: 'Guairá Opti-Fiber', activo: true, empresaId: empresa.id });
        const marca12 =await Marca.create({ descripcion: 'Tropical', activo: true, empresaId: empresa.id });
        const marca13 =await Marca.create({ descripcion: 'Mio', activo: true, empresaId: empresa.id });
    
        console.log('Registros creados exitosamente!');
    }
};

module.exports = { populateDB };