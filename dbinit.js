 
const Bcryptjs = require('bcryptjs');
const Usuario = require('./src/models/usuario.model');
const Empresa = require('./src/models/empresa.model');
const Sucursal = require('./src/models/sucursal.model');
const Unidad = require('./src/models/unidad.model');
const Marca = require('./src/models/marca.model');
const Categoria = require('./src/models/categoria.model');
const SubCategoria = require('./src/models/subCategoria.model');
const Variedad = require('./src/models/variedad.model');
const Presentacion = require('./src/models/presentacion.model');
const Producto = require('./src/models/producto.model');
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
         const subCategoria15 =await SubCategoria.create(   { descripcion: 'Jabón de tocador', activo: true, empresaId: empresa.id  });
         const subCategoria16 =await SubCategoria.create(   { descripcion: 'Líquido para lavar la ropa', activo: true, empresaId: empresa.id  });


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
    
 
   const producto1 =await Producto.create(     { nombre:'BOLSA PARA RESIDUOS PIXOL' ,descripcion:'', categoriaId : categoria3.id, subCategoriaId: subCategoria10.id, marcaId:marca2.id, activo: true, empresaId: empresa.id }                                          );
   const producto2 =await Producto.create(             { nombre:'COMBO NAVIDEÑO 1' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria3.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto3 =await Producto.create(     { nombre:'COMBO NAVIDEÑO 2' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria3.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto4 =await Producto.create(     { nombre:'COMBO NAVIDEÑO 3' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria3.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto5 =await Producto.create(     { nombre:'COMBO NAVIDEÑO 4' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria3.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto6 =await Producto.create(     { nombre:'DESODORANTE DE AMBIENTE CAVALLARO' ,descripcion:'', categoriaId : categoria3.id, subCategoriaId: subCategoria4.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto7 =await Producto.create(       { nombre:'DETERGENTE LAVAVAJILLAS CAVALLARO' ,descripcion:'', categoriaId : categoria3.id, subCategoriaId: subCategoria5.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto8 =await Producto.create(       { nombre:'DETERGENTE LAVAVAJILLAS PIXOL FORMULA CONCENTRADA' ,descripcion:'', categoriaId : categoria3.id, subCategoriaId: subCategoria5.id, marcaId:marca2.id, activo: true, empresaId: empresa.id });
   const producto9 =await Producto.create(     { nombre:'JABON DE COCO PURO COCO CAVALLARO' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria7.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto10 =await Producto.create(           { nombre:'JABON DE TOCADOR C' ,descripcion:'', categoriaId : categoria1.id, subCategoriaId: subCategoria14.id, marcaId:marca4.id, activo: true, empresaId: empresa.id });
   const producto11 =await Producto.create(     { nombre:'JABON DE TOCADOR C GLICERINA' ,descripcion:'', categoriaId : categoria1.id, subCategoriaId: subCategoria15.id, marcaId:marca4.id, activo: true, empresaId: empresa.id });
   const producto12 =await Producto.create(        { nombre:'JABON DE TOCADOR C2' ,descripcion:'', categoriaId : categoria1.id, subCategoriaId: subCategoria15.id, marcaId:marca5.id, activo: true, empresaId: empresa.id });
   const producto13 =await Producto.create(     { nombre:'JABON DE TOCADOR C2' ,descripcion:'', categoriaId : categoria1.id, subCategoriaId: subCategoria15.id, marcaId:marca5.id, activo: true, empresaId: empresa.id });
   const producto14 =await Producto.create(        { nombre:'JABON DE TOCADOR C2 HUMECTANTE ' ,descripcion:'', categoriaId : categoria1.id, subCategoriaId: subCategoria15.id, marcaId:marca5.id, activo: true, empresaId: empresa.id });
   const producto15 =await Producto.create(       { nombre:'JABON DE TOCADOR CAVALLARO' ,descripcion:'', categoriaId : categoria1.id, subCategoriaId: subCategoria14.id, marcaId:marca13.id, activo: true, empresaId: empresa.id });
   const producto16 =await Producto.create(     { nombre:'JABON DE TOCADOR COCO CAVALLARO' ,descripcion:'', categoriaId : categoria1.id, subCategoriaId: subCategoria1.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto17 =await Producto.create(           { nombre:'JABON DE TOCADOR IO' ,descripcion:'', categoriaId : categoria1.id, subCategoriaId: subCategoria15.id, marcaId:marca10.id, activo: true, empresaId: empresa.id });
   const producto18 =await Producto.create(        { nombre:'JABON DE TOCADOR NATURAL COCO CAVALLARO CON ACEITE ESENCIAL' ,descripcion:'', categoriaId : categoria1.id, subCategoriaId: subCategoria1.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto19 =await Producto.create(     { nombre:'JABON EN POLVO COCO CAVALLARO' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria8.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto20 =await Producto.create(        { nombre:'JABON LIQUIDO "MULTIUSO" COCO CAVALLARO' ,descripcion:'', categoriaId : categoria1.id, subCategoriaId: subCategoria9.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto21 =await Producto.create(     { nombre:'JABON LIQUIDO PARA LAVAR LA ROPA COCO CAVALLARO' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria7.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto22 =await Producto.create(        { nombre:'JABON PARA LAVAR LA ROPA AGRICULTOR' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria13.id, marcaId:marca3.id, activo: true, empresaId: empresa.id });
   const producto23 =await Producto.create(     { nombre:'JABON PARA LAVAR LA ROPA AGRICULTOR' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria13.id, marcaId:marca3.id, activo: true, empresaId: empresa.id });
   const producto24 =await Producto.create(    { nombre:'JABÓN PARA LAVAR LA ROPA GUAIRA DELUXE CON AZUL BLANQUEADOR' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria13.id, marcaId:marca7.id, activo: true, empresaId: empresa.id });
   const producto25 =await Producto.create(     { nombre:'JABON PARA LAVAR LA ROPA GUAIRA DELUXE CON COCO y GLICERINA' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria13.id, marcaId:marca7.id, activo: true, empresaId: empresa.id });
   const producto26 =await Producto.create(        { nombre:'JABÓN PARA LAVAR LA ROPA GUAIRA DELUXE CON GLICERINA Y LIMÓN' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria13.id, marcaId:marca7.id, activo: true, empresaId: empresa.id });
   const producto27 =await Producto.create(     { nombre:'JABON PARA LAVAR LA ROPA TROPICAL' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria13.id, marcaId:marca12.id, activo: true, empresaId: empresa.id });
   const producto28 =await Producto.create(      { nombre:'LAVANDINA CAVALLARO' ,descripcion:'', categoriaId : categoria3.id, subCategoriaId: subCategoria6.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto29 =await Producto.create(     { nombre:'LIMPIADOR CONCENTRADO DESINFECTANTE PIXOL' ,descripcion:'', categoriaId : categoria3.id, subCategoriaId: subCategoria12.id, marcaId:marca2.id, activo: true, empresaId: empresa.id });
   const producto30 =await Producto.create(        { nombre:'LÍQUIDO PARA LAVAR ROPA INSUPERABLE' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria16.id, marcaId:marca8.id, activo: true, empresaId: empresa.id });
   const producto31 =await Producto.create(      { nombre:'POLVO PARA LAVAR LA ROPA GUAIRA DELUXE' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria8.id, marcaId:marca7.id, activo: true, empresaId: empresa.id });
   const producto32 =await Producto.create(        { nombre:'POLVO PARA LAVAR LA ROPA GUAIRA EXTRA' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria8.id, marcaId:marca6.id, activo: true, empresaId: empresa.id });
   const producto33 =await Producto.create(     { nombre:'POLVO PARA LAVAR LA ROPA GUAIRA EXTRA' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria8.id, marcaId:marca6.id, activo: true, empresaId: empresa.id });
   const producto34 =await Producto.create(      { nombre:'POLVO PARA LAVAR LA ROPA GUAIRA OPTI SYSTEM' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria8.id, marcaId:marca11.id, activo: true, empresaId: empresa.id });
   const producto35 =await Producto.create(       { nombre:'POLVO PARA LAVAR LA ROPA GUAIRA PROFESIONAL' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria8.id, marcaId:marca9.id, activo: true, empresaId: empresa.id });
   const producto36 =await Producto.create(       { nombre:'POLVO PARA LAVAR LA ROPA INSUPERABLE' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria8.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto37 =await Producto.create(     { nombre:'POLVO PARA LAVAR LA ROPA INSUPERABLE' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria8.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto38 =await Producto.create(       { nombre:'SUAVIZANTE CAVALLARO EDICION ESPECIAL' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria2.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto39 =await Producto.create(     { nombre:'SUAVIZANTE CAVALLARO EDICION ESPECIAL' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria2.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto40 =await Producto.create(          { nombre:'SUAVIZANTE CAVALLARO PREMIUM' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria2.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto41 =await Producto.create(     { nombre:'SUAVIZANTE CAVALLARO PREMIUM' ,descripcion:'', categoriaId : categoria2.id, subCategoriaId: subCategoria2.id, marcaId:marca1.id, activo: true, empresaId: empresa.id });
   const producto42 =await Producto.create(      { nombre:'TRAPO  DE PISO PIXOL' ,descripcion:'', categoriaId : categoria3.id, subCategoriaId: subCategoria11.id, marcaId:marca2.id, activo: true, empresaId: empresa.id });
     
 
      
            const variedad0 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Lavanda' });
            const variedad1 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Clásico' });
            const variedad2 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Delicado' });
            const variedad3 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Intenso' });
            const variedad4 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Neutro' });
            const variedad5 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Azul Blanqueador' });
            const variedad6 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Glicerina y Limón' });
            const variedad7 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Coco y Glicerina' });
            const variedad8 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Verde' });
            const variedad9 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Marrón' });
            const variedad10 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Blanco' });
            const variedad11 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Limón' });
            const variedad12 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Manzana' });
            const variedad13 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Ropa delicada y Elastizada' });
            const variedad14 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Floral' });
            const variedad15 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Almendras' });
            const variedad16 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Opti-Fiber' });
            const variedad17 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Tropical' });
            const variedad18 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Super Resistente' });
            const variedad19 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Ropa Color' });
            const variedad20 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Ropa Diaria' });
            const variedad21 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Natural' });
            const variedad22 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Citrus' });
            const variedad23 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Oriental' });
            const variedad24 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Marina' });
            const variedad25 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Premium' });
            const variedad26 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Economico' });
            const variedad27 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Baño' });
            const variedad28 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Mango & Mburucuya' });
            const variedad29 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Durazno & Frutos Rojos' });
            const variedad30 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Manzana verde & Pera' });
            const variedad31 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Ropa Delicada' });
            const variedad32 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Ropa Blanca' });
            const variedad33 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Clásico Natural' });
            const variedad34 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Natural Fresh' });
            const variedad35 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Surtido' });
            const variedad36 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Coco Clásico' });
            const variedad37 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Deluxe' });
            const variedad38 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Extra' });
            const variedad39 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Profesional' });
            const variedad40 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Concentrado' });
            const variedad41 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Antibacterial Fantasía' });
            const variedad42 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Antibacterial Azahar' });
            const variedad43 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Antibacterial Lavanda' });
            const variedad44 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Antibacterial Marina' });
            const variedad45 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Antibacterial Uva' });
            const variedad46 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Dulce Pasión' });
            const variedad47 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Calma Mistica' });
            const variedad48 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Equilibrio Natural' });
            const variedad49 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Frescura Infinita' });
            const variedad50 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Mágica Energía' });
            const variedad51 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Armonia Pura' });
            const variedad52 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Leche de Almendras' });
            const variedad53 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Vainilla y Frutos Rojos' });
            const variedad54 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Naranja y Jazmín' });
            const variedad55 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Coco Floral' });
            const variedad56 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Verbena' });
            const variedad57 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Petit Grain' });
            const variedad58 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'PREMIUM' });
            const variedad59 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'ECONOMICO' });
            const variedad60 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'COCO PURO' });
            const variedad61 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Berries' });
            const variedad62 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Bouquet Floral' });
            const variedad63 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Frescura Herbal' });
            const variedad64 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'SURTIDO' });
            const variedad65 =await Variedad.create({ activo: true, empresaId: empresa.id, descripcion: 'Citronella' });



          
                const presentacion1 =await Presentacion.create({ id: 1, presentacion: 'Bidón de 4L', activo: true, empresaId: empresa.id });
                const presentacion2 =await Presentacion.create({ id: 2, presentacion: 'Bolsa de 80g', activo: true, empresaId: empresa.id });
                const presentacion3 =await Presentacion.create({ id: 3, presentacion: 'Bolsa de 200g', activo: true, empresaId: empresa.id });
                const presentacion4 =await Presentacion.create({ id: 4, presentacion: 'Bolsa de 400g', activo: true, empresaId: empresa.id });
                const presentacion5 =await Presentacion.create({ id: 5, presentacion: 'Bolsa de 600g', activo: true, empresaId: empresa.id });
                const presentacion6 =await Presentacion.create({ id: 6, presentacion: 'Bolsa de 800g', activo: true, empresaId: empresa.id });
                const presentacion7 =await Presentacion.create({ id: 7, presentacion: 'Bolsa de 2Kg', activo: true, empresaId: empresa.id });
                const presentacion8 =await Presentacion.create({ id: 9, presentacion: 'Bolsa de 5Kg', activo: true, empresaId: empresa.id });
                const presentacion9 =await Presentacion.create({ id: 10, presentacion: 'Bolsa de 10Kg', activo: true, empresaId: empresa.id });
                const presentacion10 =await Presentacion.create({ id: 11, presentacion: 'Bolsa de 150g', activo: true, empresaId: empresa.id });
                const presentacion11 =await Presentacion.create({ id: 12, presentacion: 'Bolsa de 1Kg', activo: true, empresaId: empresa.id });
                const presentacion12 =await Presentacion.create({ id: 13, presentacion: 'Bolsa de 3Kg', activo: true, empresaId: empresa.id });
                const presentacion13 =await Presentacion.create({ id: 15, presentacion: 'Pan de 100g', activo: true, empresaId: empresa.id });
                const presentacion14 =await Presentacion.create({ id: 16, presentacion: 'Pan de 200g', activo: true, empresaId: empresa.id });
                const presentacion15 =await Presentacion.create({ id: 17, presentacion: 'Pack 10 x 40g', activo: true, empresaId: empresa.id });
                const presentacion16 =await Presentacion.create({ id: 18, presentacion: 'Barra de 500g', activo: true, empresaId: empresa.id });
                const presentacion17 =await Presentacion.create({ id: 19, presentacion: 'Barra de 1000g', activo: true, empresaId: empresa.id });
                const presentacion18 =await Presentacion.create({ id: 20, presentacion: 'Pan de 180g', activo: true, empresaId: empresa.id });
                const presentacion19 =await Presentacion.create({ id: 21, presentacion: 'Pan de 130g', activo: true, empresaId: empresa.id });
                const presentacion20 =await Presentacion.create({ id: 22, presentacion: 'Pack de 5 x 180g', activo: true, empresaId: empresa.id });
                const presentacion21 =await Presentacion.create({ id: 23, presentacion: 'Pan de 250g', activo: true, empresaId: empresa.id });
                const presentacion22 =await Presentacion.create({ id: 24, presentacion: 'Pan de 230g', activo: true, empresaId: empresa.id });
                const presentacion23 =await Presentacion.create({ id: 26, presentacion: 'Bidón de 5L', activo: true, empresaId: empresa.id });
                const presentacion24 =await Presentacion.create({ id: 27, presentacion: 'Botella 900ml', activo: true, empresaId: empresa.id });
                const presentacion25 =await Presentacion.create({ id: 32, presentacion: 'Pack de 15 x 25g', activo: true, empresaId: empresa.id });
                const presentacion26 =await Presentacion.create({ id: 33, presentacion: 'Doypack 1600ml', activo: true, empresaId: empresa.id });
                const presentacion27 =await Presentacion.create({ id: 34, presentacion: 'Doypack 450ml', activo: true, empresaId: empresa.id });
                const presentacion28 =await Presentacion.create({ id: 35, presentacion: 'Sachet 70ml', activo: true, empresaId: empresa.id });
                const presentacion29 =await Presentacion.create({ id: 37, presentacion: 'Doypack 2L', activo: true, empresaId: empresa.id });
                const presentacion30 =await Presentacion.create({ id: 38, presentacion: 'Tripack 3 x 130g', activo: true, empresaId: empresa.id });
                const presentacion31 =await Presentacion.create({ id: 39, presentacion: 'Caja de 500 x 10g', activo: true, empresaId: empresa.id });
                const presentacion32 =await Presentacion.create({ id: 40, presentacion: 'Pastilla 130g', activo: true, empresaId: empresa.id });
                const presentacion33 =await Presentacion.create({ id: 41, presentacion: 'Pastilla 85g', activo: true, empresaId: empresa.id });
                const presentacion34 =await Presentacion.create({ id: 43, presentacion: 'Pastilla 100g', activo: true, empresaId: empresa.id });
                const presentacion35 =await Presentacion.create({ id: 45, presentacion: 'Pastilla 125g', activo: true, empresaId: empresa.id });
                const presentacion36 =await Presentacion.create({ id: 46, presentacion: 'Caja de 300 x 20g', activo: true, empresaId: empresa.id });
                const presentacion37 =await Presentacion.create({ id: 47, presentacion: 'Tripack 3 x 80g', activo: true, empresaId: empresa.id });
                const presentacion38 =await Presentacion.create({ id: 48, presentacion: '1 Unidad', activo: true, empresaId: empresa.id });
                const presentacion39 =await Presentacion.create({ id: 49, presentacion: 'Rollo x 100 Unidades', activo: true, empresaId: empresa.id });
                const presentacion40 =await Presentacion.create({ id: 50, presentacion: 'Rollo x 30 Unidades', activo: true, empresaId: empresa.id });
                const presentacion41 =await Presentacion.create({ id: 51, presentacion: 'Bolsa de 100L', activo: true, empresaId: empresa.id });
                const presentacion42 =await Presentacion.create({ id: 52, presentacion: 'Bolsa de 150L', activo: true, empresaId: empresa.id });
                const presentacion43 =await Presentacion.create({ id: 53, presentacion: 'Bolsa de 200L', activo: true, empresaId: empresa.id });
                const presentacion44 =await Presentacion.create({ id: 56, presentacion: 'Doypack 900ml', activo: true, empresaId: empresa.id });
                const presentacion45 =await Presentacion.create({ id: 57, presentacion: 'Caja de 250 x 25g', activo: true, empresaId: empresa.id });
                const presentacion46 =await Presentacion.create({ id: 59, presentacion: 'Caja de 20 x 250g', activo: true, empresaId: empresa.id });
                const presentacion47 =await Presentacion.create({ id: 61, presentacion: 'Botella 500ml', activo: true, empresaId: empresa.id });
                const presentacion48 =await Presentacion.create({ id: 62, presentacion: 'Botella 500ml.', activo: true, empresaId: empresa.id });
                const presentacion49 =await Presentacion.create({ id: 64, presentacion: 'Estuche de 125g', activo: true, empresaId: empresa.id });
                const presentacion50 =await Presentacion.create({ id: 65, presentacion: 'Estuche de 100 g', activo: true, empresaId: empresa.id });
                const presentacion51 =await Presentacion.create({ id: 66, presentacion: 'Sachet 1600ml', activo: true, empresaId: empresa.id });
                const presentacion52 =await Presentacion.create({ id: 67, presentacion: 'Doypack 200ml', activo: true, empresaId: empresa.id });
                const presentacion53 =await Presentacion.create({ id: 68, presentacion: 'Doypack 400ml', activo: true, empresaId: empresa.id });
                const presentacion54 =await Presentacion.create({ id: 69, presentacion: 'Doypack 800ml', activo: true, empresaId: empresa.id });
                const presentacion55 =await Presentacion.create({ id: 70, presentacion: 'Doypack 500ml', activo: true, empresaId: empresa.id });
                const presentacion56 =await Presentacion.create({ id: 71, presentacion: 'KIT', activo: true, empresaId: empresa.id });
                const presentacion57 =await Presentacion.create({ id: 72, presentacion: 'Caja de 20 x 150g', activo: true, empresaId: empresa.id });
                const presentacion58 =await Presentacion.create({ id: 73, presentacion: 'Pastilla 90g', activo: true, empresaId: empresa.id });
                const presentacion59 =await Presentacion.create({ id: 74, presentacion: 'Pack Promocional 1400ml', activo: true, empresaId: empresa.id });
           




   console.log('Registros creados exitosamente!');
    }
};

module.exports = { populateDB };