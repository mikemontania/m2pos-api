const Bcryptjs = require("bcryptjs");
const Usuario = require("./src/models/usuario.model");
const Empresa = require("./src/models/empresa.model");
const Sucursal = require("./src/models/sucursal.model");
const Unidad = require("./src/models/unidad.model");
const Marca = require("./src/models/marca.model");
const Categoria = require("./src/models/categoria.model");
const SubCategoria = require("./src/models/subCategoria.model");
const Variedad = require("./src/models/variedad.model");
const Presentacion = require("./src/models/presentacion.model");
const Producto = require("./src/models/producto.model");
const Variante = require("./src/models/variante.model");
const ListaPrecio = require("./src/models/listaPrecio.model");
const Cliente = require("./src/models/cliente.model");
const Valoracion = require("./src/models/valoracion.model");
const FormaVenta = require("./src/models/formaVenta.model");
const Numeracion = require("./src/models/numeracion.model");
const Banco = require("./src/models/banco.model");
const MedioPago = require("./src/models/medioPago.model");
const populateDB = async () => {
  console.log("populateDB");
  if (process.env.DB_INIT == "true") {
    console.log("Inicializando registros en DB!");

    // Crear empresa
    const empresa = await Empresa.create({
      razonSocial: "CAVALLARO S.A.C.e.I", 
      ruc: "5555555-5", // RUC de ejemplo
      telefono: "123456789",
      email: "cavallaro@example.com",
      web: "www.cavallaro.com.py",
      actividad1:'Fabricación de plásticos y caucho sintético en formas primarias',
      actividad2:'Fabricación de jabones, detergentes y preparados de limpieza',
      actividad3:'Fabricación y transformación de productos diversos por cuenta de terceros.',
      img:'grupocavallaro3.png'
    });
     
    
    // Crear sucursal asociada a la empresa
    const sucursal = await Sucursal.create({
      descripcion: "Cavallaro Express - Capiatá",
      direccion: "Ruta 1 Km. 18 - Capiatá.",
      cel:'0981 627 369',
      telefono: "987654321",
      empresaId: empresa.id,
      email: "sucursal@example.com"
    });
    const sucursal2 = await Sucursal.create({
      descripcion: "Sucursal dos",
      direccion: "Dirección de la Sucursal",
      telefono: "987654321",
      empresaId: empresa.id,
      email: "sucursal@example.com"
    });
    const sucursal3 = await Sucursal.create({
      descripcion: "Sucursal tres",
      direccion: "Dirección de la Sucursal",
      telefono: "987654321",
      empresaId: empresa.id,
      email: "sucursal@example.com"
    });
    const sucursal4 = await Sucursal.create({
      descripcion: "Sucursal cuatro",
      direccion: "Dirección de la Sucursal",
      telefono: "987654321",
      empresaId: empresa.id,
      email: "sucursal@example.com"
    });


    const banco1 = await Banco.create({descripcion: 'Banco Rio S.A.E.C.A', activo: true, empresaId: empresa.id });
    const banco2 = await Banco.create({descripcion: 'Solar Banco S.A.E.', activo: true, empresaId: empresa.id });
    const banco3 = await Banco.create({descripcion: 'Banco Nacional de Fomento (BNF)', activo: true, empresaId: empresa.id });
    const banco4 = await Banco.create({descripcion: 'Interfisa Banco', activo: true, empresaId: empresa.id });
    const banco5 = await Banco.create({descripcion: 'Banco Atlas S.A.', activo: true, empresaId: empresa.id });
    const banco6 = await Banco.create({descripcion: 'BANCOP S.A.', activo: true, empresaId: empresa.id });
    const banco7 = await Banco.create({descripcion: 'Visión Banco S.A.E.C.A.', activo: true, empresaId: empresa.id });
    const banco8 = await Banco.create({descripcion: 'Sudameris Bank S.A.E.C.A.', activo: true, empresaId: empresa.id });
    const banco9 = await Banco.create({descripcion: 'Banco GNB - Paraguay', activo: true, empresaId: empresa.id });
    const banco10 = await Banco.create({descripcion: 'Banco Itaú Paraguay S.A.', activo: true, empresaId: empresa.id });
    const banco11 = await Banco.create({descripcion: 'Banco Familiar S.A.E.C.A.', activo: true, empresaId: empresa.id });
    const banco12 = await Banco.create({descripcion: 'Banco Continental S.A.E.C.A.', activo: true, empresaId: empresa.id });
    const banco13 = await Banco.create({descripcion: 'Banco BASA', activo: true, empresaId: empresa.id });
    const banco14 = await Banco.create({descripcion: 'Finexpar S.A.E.C.A.', activo: true, empresaId: empresa.id });
    const banco15 = await Banco.create({descripcion: 'FINANCIERA FIC S.A.E.C.A.', activo: true, empresaId: empresa.id });
    const banco16 = await Banco.create({descripcion: 'Tu Financiera', activo: true, empresaId: empresa.id });
    const banco17 = await Banco.create({descripcion: 'Financiera Paraguayo Japonesa S.A.E.C.A', activo: true, empresaId: empresa.id });
    const banco18 = await Banco.create({descripcion: 'Financiera Ueno', activo: true, empresaId: empresa.id });
    const banco19 = await Banco.create({descripcion: 'Coop. del Sur Ltda.', activo: true, empresaId: empresa.id });
    const banco20 = await Banco.create({descripcion: 'Coop. 21 de Setiembre', activo: true, empresaId: empresa.id });
    const banco21 = await Banco.create({descripcion: 'Coop. San Ignacio', activo: true, empresaId: empresa.id });
    const banco22 = await Banco.create({descripcion: 'Coop. Alemán Concordia Ltda.', activo: true, empresaId: empresa.id });
    const banco23 = await Banco.create({descripcion: 'Coop. Mborayhu Ltda.', activo: true, empresaId: empresa.id });
    const banco24 = await Banco.create({descripcion: 'Coop. Nazareth Ltda.', activo: true, empresaId: empresa.id });
    const banco25 = await Banco.create({descripcion: 'Coop. Coodeñe Ltda.', activo: true, empresaId: empresa.id });
    const banco26 = await Banco.create({descripcion: 'Coop. Ñemby Ltda.', activo: true, empresaId: empresa.id });
    const banco27 = await Banco.create({descripcion: 'Coop. Judicial Ltda.', activo: true, empresaId: empresa.id });
    const banco28 = await Banco.create({descripcion: 'Coop. Mercado 4 Ltda.', activo: true, empresaId: empresa.id });
    const banco29 = await Banco.create({descripcion: 'Coop. Multiactiva 8 de Marzo Ltda.', activo: true, empresaId: empresa.id });
    const banco30 = await Banco.create({descripcion: 'Coop. San Juan Bautista Ltda.', activo: true, empresaId: empresa.id });
    const banco31 = await Banco.create({descripcion: 'Coop. Universitaria Ltda.', activo: true, empresaId: empresa.id });
    const banco32 = await Banco.create({descripcion: 'Coop. Coomecipar Ltda.', activo: true, empresaId: empresa.id });
    const banco33 = await Banco.create({descripcion: 'COPACONS Ltda.', activo: true, empresaId: empresa.id });
    const banco34 = await Banco.create({descripcion: 'Coop. Medalla Milagrosa Ltda.', activo: true, empresaId: empresa.id });
    const banco35 = await Banco.create({descripcion: 'Coop. Mburicao Ltda.', activo: true, empresaId: empresa.id });
    const banco36 = await Banco.create({descripcion: 'Coop. Lambaré Ltda.', activo: true, empresaId: empresa.id });
    const banco37 = await Banco.create({descripcion: 'C.O.F.A.N.', activo: true, empresaId: empresa.id });
    const banco38 = await Banco.create({descripcion: 'Coop. Chortitzer Ltda.', activo: true, empresaId: empresa.id });
    const banco39 = await Banco.create({descripcion: 'Coop. Neuland Ltda.', activo: true, empresaId: empresa.id });
    const banco40 = await Banco.create({descripcion: 'Coop. Raúl Peña Ltda.', activo: true, empresaId: empresa.id });
    const banco41 = await Banco.create({descripcion: 'Coop. Naranjal Ltda.', activo: true, empresaId: empresa.id });
    const banco42 = await Banco.create({descripcion: 'Coop. Colonias Unidas Ltda.', activo: true, empresaId: empresa.id });
    const banco43 = await Banco.create({descripcion: 'Coop. Fernheim Ltda.', activo: true, empresaId: empresa.id });
    
    const medioPago1 = await MedioPago.create({descripcion: 'EFECTIVO', activo: true,predeterminado:true, empresaId: empresa.id ,esCheque:false,tieneBanco:false,tieneRef:false,tieneTipo:false,esObsequio:false});
    const medioPago2 = await MedioPago.create({descripcion: 'TARJETA', activo: true, empresaId: empresa.id ,esCheque:false,tieneBanco:false,tieneRef:true,tieneTipo:false,esObsequio:false});
    const medioPago3 = await MedioPago.create({descripcion: 'VALE EMPLEADOS', activo: true, empresaId: empresa.id ,esCheque:false,tieneBanco:false,tieneRef:false,tieneTipo:false,esObsequio:false});
    const medioPago4 = await MedioPago.create({descripcion: 'RETENCION', activo: true, empresaId: empresa.id ,esCheque:false,tieneBanco:false,tieneRef:true,tieneTipo:false,esObsequio:false});
    const medioPago5 = await MedioPago.create({descripcion: 'CHEQUE DIA', activo: true, empresaId: empresa.id ,esCheque:true,tieneBanco:true,tieneRef:true,tieneTipo:false,esObsequio:false});
    const medioPago6 = await MedioPago.create({descripcion: 'CHEQUE DIFERIDO', activo: true, empresaId: empresa.id ,esCheque:true,tieneBanco:true,tieneRef:true,tieneTipo:false,esObsequio:false});
    const medioPago7 = await MedioPago.create({descripcion: 'TRANSFERENCIA', activo: true, empresaId: empresa.id ,esCheque:false,tieneBanco:false,tieneRef:true,tieneTipo:false,esObsequio:false});
    const medioPago8 = await MedioPago.create({descripcion: 'OBSEQUIO', activo: true, empresaId: empresa.id ,esCheque:false,tieneBanco:false,tieneRef:false,tieneTipo:false,esObsequio:true});
    const medioPago9 = await MedioPago.create({descripcion: 'BANCARD QR', activo: true, empresaId: empresa.id ,esCheque:false,tieneBanco:false,tieneRef:true,tieneTipo:false,esObsequio:false});
    

    const numeracion1 = await Numeracion.create({ 
      empresaId: empresa.id,
      sucursalId: sucursal.id,
      inicioTimbrado: "2022-11-21",
      finTimbrado: "9999-12-31",
      numeroInicio: 1,
      numeroFin: 999999999,
      serie: "011-001",
      timbrado: "16032661",
      ultimoNumero: 0,
      tipoTomprobante: "TICKET",
      tipoImpresion: "TICKET",
      activo: true
    });


    const numeracion4 = await Numeracion.create({ 
      empresaId: empresa.id,
      sucursalId: sucursal.id,
      inicioTimbrado: "2022-11-21",
      finTimbrado: "9999-12-31",
      numeroInicio: 1,
      numeroFin: 999999999,
      serie: "011-002",
      timbrado: "16032661",
      ultimoNumero: 0,
      tipoTomprobante: "TICKET",
      tipoImpresion: "TICKET",
      activo: true
    });
    const numeracion2 = await Numeracion.create({ 
      empresaId: empresa.id,
      sucursalId: sucursal2.id,
      inicioTimbrado: "2022-11-21",
      finTimbrado: "9999-12-31",
      numeroInicio: 1,
      numeroFin: 999999999,
      serie: "012-001",
      timbrado: "16032661",
      ultimoNumero: 0,
      tipoTomprobante: "TICKET",
      tipoImpresion: "TICKET",
      activo: true
    });

    const numeracion5 = await Numeracion.create({ 
      empresaId: empresa.id,
      sucursalId: sucursal2.id,
      inicioTimbrado: "2022-11-21",
      finTimbrado: "9999-12-31",
      numeroInicio: 1,
      numeroFin: 999999999,
      serie: "012-002",
      timbrado: "16032661",
      ultimoNumero: 0,
      tipoTomprobante: "TICKET",
      tipoImpresion: "TICKET",
      activo: true
    });
    const numeracion3 = await Numeracion.create({ 
      empresaId: empresa.id,
      sucursalId: sucursal3.id,
      inicioTimbrado: "2022-11-21",
      finTimbrado: "9999-12-31",
      numeroInicio: 1,
      numeroFin: 999999999,
      serie: "013-001",
      timbrado: "16032661",
      ultimoNumero: 0,
      tipoTomprobante: "TICKET",
      tipoImpresion: "TICKET",
      activo: true
    });
    const numeracion6 = await Numeracion.create({ 
      empresaId: empresa.id,
      sucursalId: sucursal3.id,
      inicioTimbrado: "2022-11-21",
      finTimbrado: "9999-12-31",
      numeroInicio: 1,
      numeroFin: 999999999,
      serie: "013-002",
      timbrado: "16032661",
      ultimoNumero: 0,
      tipoTomprobante: "TICKET",
      tipoImpresion: "TICKET",
      activo: true
    });
 
 



    // Crear usuario asociado a la empresa y sucursal
    const salt = Bcryptjs.genSaltSync();
    const userAdmin = await Usuario.create({
      empresaId: empresa.id,
      sucursalId: sucursal.id,
      numPrefId:numeracion2.id,
      username: "admin@admin.com",
      usuario: "Miguel Montania",
      password: Bcryptjs.hashSync("123456", salt),
      img: "9634534584326567563.jpg",
      rol: "admin", // Puedes ajustar el rol según tus necesidades
      intentos: 0,
      activo: true,
      bloqueado: false
    });

    const categoria2 = await Categoria.create({descripcion: "Cuidado de las Prendas", activo: true, empresaId: empresa.id });
    const categoria3 = await Categoria.create({
      descripcion: "Higiene Personal",
      activo: true,
      empresaId: empresa.id
    });
    const categoria1 = await Categoria.create({
      descripcion: "Limpieza y Desinfección del Hogar",
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria1 = await SubCategoria.create({
      descripcion: "Bolsas para residuos",
      categoriaId: categoria1.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria2 = await SubCategoria.create({
      descripcion: "Desodorante de ambiente",
      categoriaId: categoria1.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria3 = await SubCategoria.create({
      descripcion: "Detergente lavavajilla",
      categoriaId: categoria1.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria4 = await SubCategoria.create({
      descripcion: "Lavandina",
      categoriaId: categoria1.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria5 = await SubCategoria.create({
      descripcion: "Trapo de piso",
      categoriaId: categoria1.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria6 = await SubCategoria.create({
      descripcion: "Coco Puro",
      categoriaId: categoria2.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria7 = await SubCategoria.create({
      descripcion: "Jabón en pan / Barra para lavar la ropa",
      categoriaId: categoria2.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria8 = await SubCategoria.create({
      descripcion: "Polvo para lavar la ropa",
      categoriaId: categoria2.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria9 = await SubCategoria.create({
      descripcion: "Jabón prensado",
      categoriaId: categoria2.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria10 = await SubCategoria.create({
      descripcion: "Suavizante",
      categoriaId: categoria2.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria11 = await SubCategoria.create({
      descripcion: "Coco multiuso",
      categoriaId: categoria3.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria12 = await SubCategoria.create({
      descripcion: "Jabón de tocador",
      categoriaId: categoria3.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria13 = await SubCategoria.create({
      descripcion: "Jabón hotelero",
      categoriaId: categoria3.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria15 = await SubCategoria.create({
      descripcion: "Coco tocador",
      categoriaId: categoria3.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria16 = await SubCategoria.create({
      descripcion: "Líquido para lavar la ropa",
      categoriaId: categoria2.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria17 = await SubCategoria.create({
      descripcion: "Combos",
      categoriaId: categoria2.id,
      activo: true,
      empresaId: empresa.id
    });
    const subCategoria18 = await SubCategoria.create({
      descripcion: "Limpiador",
      categoriaId: categoria1.id,
      activo: true,
      empresaId: empresa.id
    });

    // Inserta las unidades en la base de datos
    const unidadUN = await Unidad.create({
      code: "UN",
      descripcion: "Unidad",
      empresaId: empresa.id,
      activo: true
    });
    const unidadCJ = await Unidad.create({
      code: "CJ",
      descripcion: "Caja",
      empresaId: empresa.id,
      activo: true
    });
    const unidadDSP = await Unidad.create({
      code: "DSP",
      descripcion: "Display",
      empresaId: empresa.id,
      activo: true
    });
    const unidadROL = await Unidad.create({
      code: "ROL",
      descripcion: "Rollo",
      empresaId: empresa.id,
      activo: true
    });
    const unidadPCK = await Unidad.create({
      code: "PCK",
      descripcion: "Pack",
      empresaId: empresa.id,
      activo: true
    });

    const marca1 = await Marca.create({
      descripcion: "Cavallaro",
      activo: true,
      empresaId: empresa.id
    });
    const marca2 = await Marca.create({
      descripcion: "Pixol",
      activo: true,
      empresaId: empresa.id
    });
    const marca3 = await Marca.create({
      descripcion: "Agricultor",
      activo: true,
      empresaId: empresa.id
    });
    const marca4 = await Marca.create({
      descripcion: "Obrero",
      activo: true,
      empresaId: empresa.id
    });
    const marca5 = await Marca.create({
      descripcion: "C Glicerina",
      activo: true,
      empresaId: empresa.id
    });
    const marca6 = await Marca.create({
      descripcion: "C2",
      activo: true,
      empresaId: empresa.id
    });
    const marca7 = await Marca.create({
      descripcion: "Guairá Extra",
      activo: true,
      empresaId: empresa.id
    });
    const marca8 = await Marca.create({
      descripcion: "Guairá Deluxe",
      activo: true,
      empresaId: empresa.id
    });
    const marca9 = await Marca.create({
      descripcion: "Coco Cavallaro",
      activo: true,
      empresaId: empresa.id
    });
    const marca10 = await Marca.create({
      descripcion: "Insuperable",
      activo: true,
      empresaId: empresa.id
    });
    const marca11 = await Marca.create({
      descripcion: "Guairá Opti-System",
      activo: true,
      empresaId: empresa.id
    });
    const marca12 = await Marca.create({
      descripcion: "gliCrina",
      activo: true,
      empresaId: empresa.id
    });
    const marca13 = await Marca.create({
      descripcion: "Sole Mio",
      activo: true,
      empresaId: empresa.id
    });
    const marca14 = await Marca.create({
      descripcion: "Cavallaro Premium",
      activo: true,
      empresaId: empresa.id
    });
    const marca15 = await Marca.create({
      descripcion: "Guairá Profesional",
      activo: true,
      empresaId: empresa.id
    });
    const marca16 = await Marca.create({
      descripcion: "IO",
      activo: true,
      empresaId: empresa.id
    });
    const marca17 = await Marca.create({
      descripcion: "Guairá Opti-Fiber",
      activo: true,
      empresaId: empresa.id
    });
    const marca18 = await Marca.create({
      descripcion: "Tropical",
      activo: true,
      empresaId: empresa.id
    });
    const marca19 = await Marca.create({
      descripcion: "Mio",
      activo: true,
      empresaId: empresa.id
    });
    const marca20 = await Marca.create({
      descripcion: "Guairá Opti-Color",
      activo: true,
      empresaId: empresa.id
    });
    const marca = await Marca.create({
      descripcion: "",
      activo: true,
      empresaId: empresa.id
    });

    const producto1 = await Producto.create({
      nombre: "BOLSA PARA RESIDUOS PIXOL - BAÑO",
      descripcion: "",
      categoriaId: categoria1.id,
      subCategoriaId: subCategoria1.id,
      marcaId: marca2.id,
      activo: false,
      empresaId: empresa.id
    });
    const producto2 = await Producto.create({
      nombre: "BOLSA PARA RESIDUOS PIXOL",
      descripcion: "",
      categoriaId: categoria1.id,
      subCategoriaId: subCategoria1.id,
      marcaId: marca2.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto3 = await Producto.create({
      nombre: "DESODORANTE DE AMBIENTE CAVALLARO",
      descripcion: "",
      categoriaId: categoria1.id,
      subCategoriaId: subCategoria2.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto4 = await Producto.create({
      nombre: "DETERGENTE LAVAVAJILLAS CAVALLARO",
      descripcion: "",
      categoriaId: categoria1.id,
      subCategoriaId: subCategoria3.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto5 = await Producto.create({
      nombre: "DETERGENTE LAVAVAJILLAS PIXOL FORMULA CONCENTRADA",
      descripcion: "",
      categoriaId: categoria1.id,
      subCategoriaId: subCategoria3.id,
      marcaId: marca2.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto6 = await Producto.create({
      nombre: "JABON DE COCO PURO COCO CAVALLARO",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria6.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto7 = await Producto.create({
      nombre: "JABON DE TOCADOR C GLICERINA",
      descripcion: "",
      categoriaId: categoria3.id,
      subCategoriaId: subCategoria12.id,
      marcaId: marca5.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto8 = await Producto.create({
      nombre: "JABON DE TOCADOR C2",
      descripcion: "",
      categoriaId: categoria3.id,
      subCategoriaId: subCategoria12.id,
      marcaId: marca6.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto9 = await Producto.create({
      nombre: "JABON DE TOCADOR COCO CAVALLARO",
      descripcion: "",
      categoriaId: categoria3.id,
      subCategoriaId: subCategoria15.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto10 = await Producto.create({
      nombre: "JABON DE TOCADOR IO",
      descripcion: "",
      categoriaId: categoria3.id,
      subCategoriaId: subCategoria12.id,
      marcaId: marca16.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto11 = await Producto.create({
      nombre: "JABON DE TOCADOR C",
      descripcion: "",
      categoriaId: categoria3.id,
      subCategoriaId: subCategoria13.id,
      marcaId: marca5.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto12 = await Producto.create({
      nombre: "JABON DE TOCADOR CAVALLARO",
      descripcion: "",
      categoriaId: categoria3.id,
      subCategoriaId: subCategoria13.id,
      marcaId: marca19.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto13 = await Producto.create({
      nombre: "JABON EN POLVO COCO CAVALLARO",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria8.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto14 = await Producto.create({
      nombre: 'JABON LIQUIDO ""MULTIUSO"" COCO CAVALLARO',
      descripcion: "",
      categoriaId: categoria3.id,
      subCategoriaId: subCategoria11.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto15 = await Producto.create({
      nombre: "JABON LIQUIDO PARA LAVAR LA ROPA COCO CAVALLARO",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria6.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto16 = await Producto.create({
      nombre: "JABON PARA LAVAR LA ROPA AGRICULTOR",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria7.id,
      marcaId: marca3.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto17 = await Producto.create({
      nombre: "JABON PARA LAVAR LA ROPA GUAIRA DELUXE CON COCO y GLICERINA",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria7.id,
      marcaId: marca8.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto18 = await Producto.create({
      nombre: "JABON PARA LAVAR LA ROPA GUAIRA EXTRA",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria7.id,
      marcaId: marca7.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto19 = await Producto.create({
      nombre: "JABON PARA LAVAR LA ROPA TROPICAL",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria7.id,
      marcaId: marca18.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto20 = await Producto.create({
      nombre: "LAVANDINA CAVALLARO",
      descripcion: "",
      categoriaId: categoria1.id,
      subCategoriaId: subCategoria4.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto21 = await Producto.create({
      nombre: "POLVO PARA LAVAR LA ROPA GUAIRA OPTI SYSTEM",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria8.id,
      marcaId: marca17.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto22 = await Producto.create({
      nombre: "POLVO PARA LAVAR LA ROPA GUAIRA DELUXE",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria8.id,
      marcaId: marca8.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto23 = await Producto.create({
      nombre: "POLVO PARA LAVAR LA ROPA GUAIRA EXTRA",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria8.id,
      marcaId: marca7.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto24 = await Producto.create({
      nombre: "POLVO PARA LAVAR LA ROPA GUAIRA PROFESIONAL",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria8.id,
      marcaId: marca15.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto25 = await Producto.create({
      nombre: "POLVO PARA LAVAR LA ROPA INSUPERABLE",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria8.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto26 = await Producto.create({
      nombre: "SUAVIZANTE CAVALLARO EDICION ESPECIAL",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria10.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto27 = await Producto.create({
      nombre: "SUAVIZANTE CAVALLARO PREMIUM",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria10.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto28 = await Producto.create({
      nombre: "TRAPO  DE PISO PIXOL",
      descripcion: "",
      categoriaId: categoria1.id,
      subCategoriaId: subCategoria5.id,
      marcaId: marca2.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto29 = await Producto.create({
      nombre: "JABÓN DE TOCADOR PARA HOTEL",
      descripcion: "",
      categoriaId: categoria3.id,
      subCategoriaId: subCategoria13.id,
      marcaId: marca1.id,
      activo: false,
      empresaId: empresa.id
    });
    const producto32 = await Producto.create({
      nombre: "POLVO PARA LAVAR LA ROPA GUAIRA OPTI-COLORS",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria8.id,
      marcaId: marca20.id,
      activo: false,
      empresaId: empresa.id
    });
    const producto34 = await Producto.create({
      nombre: "JABÓN PARA LAVAR LA ROPA GUAIRA DELUXE CON GLICERINA Y LIMÓN",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria7.id,
      marcaId: marca8.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto35 = await Producto.create({
      nombre: "JABÓN PARA LAVAR LA ROPA GUAIRA DELUXE CON AZUL BLANQUEADOR",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria7.id,
      marcaId: marca8.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto36 = await Producto.create({
      nombre: "DETERGENTE LAVAVAJILLAS INSUPERABLE",
      descripcion: "",
      categoriaId: categoria1.id,
      subCategoriaId: subCategoria3.id,
      marcaId: marca10.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto38 = await Producto.create({
      nombre: "LÍQUIDO PARA LAVAR ROPA INSUPERABLE",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria16.id,
      marcaId: marca10.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto39 = await Producto.create({
      nombre: "COMBO AMIG@ NATURALISTA",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria17.id,
      marcaId: marca1.id,
      activo: false,
      empresaId: empresa.id
    });
    const producto40 = await Producto.create({
      nombre: "COMBO AMIG@ FAMILIERO",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria17.id,
      marcaId: marca1.id,
      activo: false,
      empresaId: empresa.id
    });
    const producto41 = await Producto.create({
      nombre: "COMBO AMIG@ ASADERO",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria17.id,
      marcaId: marca1.id,
      activo: false,
      empresaId: empresa.id
    });
    const producto42 = await Producto.create({
      nombre: "COMBO AMIG@ ECONOMICO",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria17.id,
      marcaId: marca1.id,
      activo: false,
      empresaId: empresa.id
    });
    const producto44 = await Producto.create({
      nombre: "JABON DE TOCADOR C2 HUMECTANTE ",
      descripcion: "",
      categoriaId: categoria3.id,
      subCategoriaId: subCategoria12.id,
      marcaId: marca6.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto45 = await Producto.create({
      nombre: "JABON DE TOCADOR NATURAL COCO CAVALLARO CON ACEITE ESENCIAL",
      descripcion: "",
      categoriaId: categoria3.id,
      subCategoriaId: subCategoria15.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto46 = await Producto.create({
      nombre: "COMBO NAVIDEÑO 1",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria17.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto47 = await Producto.create({
      nombre: "COMBO NAVIDEÑO 2",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria17.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto48 = await Producto.create({
      nombre: "COMBO NAVIDEÑO 3",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria17.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto49 = await Producto.create({
      nombre: "LIMPIADOR CONCENTRADO DESINFECTANTE PIXOL",
      descripcion: "",
      categoriaId: categoria1.id,
      subCategoriaId: subCategoria18.id,
      marcaId: marca2.id,
      activo: true,
      empresaId: empresa.id
    });
    const producto50 = await Producto.create({
      nombre: "JABON DE TOCADOR C2 HUMECTANTE ",
      descripcion: "",
      categoriaId: categoria3.id,
      subCategoriaId: subCategoria12.id,
      marcaId: marca6.id,
      activo: false,
      empresaId: empresa.id
    });
    const producto56 = await Producto.create({
      nombre: "COMBO NAVIDEÑO 4",
      descripcion: "",
      categoriaId: categoria2.id,
      subCategoriaId: subCategoria17.id,
      marcaId: marca1.id,
      activo: true,
      empresaId: empresa.id
    });

    const variedad1 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#258f00",
      descripcion: "Azahar"
    });
    const variedad2 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ac23af",
      descripcion: "Lavanda"
    });
    const variedad3 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f7f7f7",
      descripcion: "Uva"
    });
    const variedad4 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f339c2",
      descripcion: "Fantasía"
    });
    const variedad5 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#1385dd",
      descripcion: "Clásico"
    });
    const variedad6 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ffd600",
      descripcion: "Delicado"
    });
    const variedad7 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#92d99a",
      descripcion: "Intenso"
    });
    const variedad8 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#eda28b",
      descripcion: "Essences"
    });
    const variedad9 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#edd040",
      descripcion: "Neutro"
    });
    const variedad10 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#02b3e5",
      descripcion: "Blue"
    });
    const variedad11 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#bae0e1",
      descripcion: "White"
    });
    const variedad12 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#c4e361",
      descripcion: "Green"
    });
    const variedad13 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#e85896",
      descripcion: "Pink"
    });
    const variedad14 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#fa9523",
      descripcion: "Orange"
    });
    const variedad15 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#fed627",
      descripcion: "Yellow"
    });
    const variedad16 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#5e4e97",
      descripcion: "Sensaciones"
    });
    const variedad17 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#999896",
      descripcion: "Urbano Sensual"
    });
    const variedad18 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#295e6e",
      descripcion: "Armonía y Relajación"
    });
    const variedad19 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#cb803d",
      descripcion: "Misterio del Oriente"
    });
    const variedad20 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#cf633c",
      descripcion: "Fruit & Flower"
    });
    const variedad21 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#dfaca9",
      descripcion: "Glamour"
    });
    const variedad22 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#86b490",
      descripcion: "Acción"
    });
    const variedad23 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ec88d2",
      descripcion: "Romance"
    });
    const variedad24 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#eece79",
      descripcion: "Intimo"
    });
    const variedad25 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#63a6af",
      descripcion: "Frescura Marina"
    });
    const variedad26 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#be4a53",
      descripcion: "Rubí"
    });
    const variedad27 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#347a56",
      descripcion: "Esmeralda"
    });
    const variedad28 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#e0b431",
      descripcion: "Ambar"
    });
    const variedad29 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#4284b4",
      descripcion: "Azul Blanqueador"
    });
    const variedad30 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#71c66c",
      descripcion: "Glicerina y Limón"
    });
    const variedad31 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#d5ccbd",
      descripcion: "Coco y Glicerina"
    });
    const variedad32 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#576452",
      descripcion: "Verde"
    });
    const variedad33 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#a58860",
      descripcion: "Marrón"
    });
    const variedad34 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ebe1d5",
      descripcion: "Blanco"
    });
    const variedad35 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#dfbfd4",
      descripcion: "Rosado"
    });
    const variedad36 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#de4c43",
      descripcion: "Normal"
    });
    const variedad37 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#61d62e",
      descripcion: "Limón"
    });
    const variedad38 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f0192e",
      descripcion: "Manzana"
    });
    const variedad39 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#b99869",
      descripcion: "Ropa delicada y Elastizada"
    });
    const variedad40 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#e97e8f",
      descripcion: "Ropa de bebé"
    });
    const variedad42 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f859a0",
      descripcion: "Floral"
    });
    const variedad43 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#c2c39d",
      descripcion: "Almendras"
    });
    const variedad44 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#014498",
      descripcion: "Opti-Fiber"
    });
    const variedad45 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f72626",
      descripcion: "Opti-Colors"
    });
    const variedad46 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ff1572",
      descripcion: "Dulce Sensación"
    });
    const variedad47 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#009719",
      descripcion: "Frescura Intensa"
    });
    const variedad48 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#778fd9",
      descripcion: "Sueve Susuro"
    });
    const variedad49 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ffa500",
      descripcion: "Energía Vital"
    });
    const variedad50 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#00abeb",
      descripcion: "Brisa Fresca"
    });
    const variedad51 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ff4701",
      descripcion: "Tropical"
    });
    const variedad52 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#fdd512",
      descripcion: "Super Resistente"
    });
    const variedad53 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#cc61ba",
      descripcion: "Ropa Color"
    });
    const variedad54 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#37d767",
      descripcion: "Ropa Diaria"
    });
    const variedad55 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f0cb47",
      descripcion: "Natural"
    });
    const variedad56 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#38cb1a",
      descripcion: "Citrus"
    });
    const variedad57 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#bf17ee",
      descripcion: "Oriental"
    });
    const variedad58 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#41e614",
      descripcion: "Tropical NO"
    });
    const variedad59 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#065be5",
      descripcion: "Fresh"
    });
    const variedad60 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f0e919",
      descripcion: "Exótica"
    });
    const variedad61 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#79baec",
      descripcion: "Marina"
    });
    const variedad62 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#e68d28",
      descripcion: "Frutal"
    });
    const variedad63 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ff6d1f",
      descripcion: "Premium"
    });
    const variedad64 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#2bd016",
      descripcion: "Economico"
    });
    const variedad65 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ade6f0",
      descripcion: "Baño"
    });
    const variedad66 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ffc72e",
      descripcion: "Mango & Mburucuya"
    });
    const variedad67 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ff75c6",
      descripcion: "Durazno & Frutos Rojos"
    });
    const variedad68 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#80e62d",
      descripcion: "Manzana verde & Pera"
    });
    const variedad69 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ff80c3",
      descripcion: "Ropa Delicada"
    });
    const variedad70 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#359aff",
      descripcion: "Ropa Blanca"
    });
    const variedad71 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#b6b0a5",
      descripcion: "Clásico Natural"
    });
    const variedad72 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#d1d1d1",
      descripcion: "Natural Fresh"
    });
    const variedad73 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#eae448",
      descripcion: "Surtido"
    });
    const variedad74 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#abf2bd",
      descripcion: "Coco Clásico"
    });
    const variedad75 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ec22db",
      descripcion: "Deluxe"
    });
    const variedad76 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#eb961e",
      descripcion: "Extra"
    });
    const variedad77 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#0e19af",
      descripcion: "Profesional"
    });
    const variedad78 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#e4d211",
      descripcion: "Concentrado"
    });
    const variedad79 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f339c2",
      descripcion: "Antibacterial Fantasía"
    });
    const variedad80 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#52d123",
      descripcion: "Antibacterial Azahar"
    });
    const variedad81 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#cc5cf5",
      descripcion: "Antibacterial Lavanda"
    });
    const variedad82 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#1171ee",
      descripcion: "Antibacterial Marina"
    });
    const variedad83 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#7b21e8",
      descripcion: "Antibacterial Uva"
    });
    const variedad84 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f36ddd",
      descripcion: "Dulce  Pasión"
    });
    const variedad85 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#c336f7",
      descripcion: "Calma Mistica"
    });
    const variedad86 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#79ee2b",
      descripcion: "Equilibrio Natural"
    });
    const variedad87 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#009dff",
      descripcion: "Frescura Infinita"
    });
    const variedad88 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f77a36",
      descripcion: "Mágica Energía"
    });
    const variedad89 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#97d293",
      descripcion: "Armonia Pura"
    });
    const variedad90 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#b3e1f5",
      descripcion: "Leche de Almendras"
    });
    const variedad91 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#eeaad2",
      descripcion: "Vainilla y Frutos Rojos"
    });
    const variedad92 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#8ce8c0",
      descripcion: "Naranja y Jazmín"
    });
    const variedad94 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f05cd7",
      descripcion: "Coco Floral"
    });
    const variedad95 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#09be70",
      descripcion: "Verbena"
    });
    const variedad96 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#b1e246",
      descripcion: "Petit Grain "
    });
    const variedad97 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ffffff",
      descripcion: "PREMIUM"
    });
    const variedad98 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#fcfcfc",
      descripcion: "ECONOMICO"
    });
    const variedad99 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#fafafa",
      descripcion: "COCO PURO"
    });
    const variedad100 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#cd70b8",
      descripcion: "Berries"
    });
    const variedad101 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f86381",
      descripcion: "Bouquet Floral"
    });
    const variedad102 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#6ed8b5",
      descripcion: "Frescura Herbal"
    });
    const variedad103 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#f0f401",
      descripcion: "Citronella"
    });
    const variedad104 = await Variedad.create({
      activo: true,
      empresaId: empresa.id,
      color: "#ffffff",
      descripcion: "SURTIDO"
    });

    const presentacion1 = await Presentacion.create({
      descripcion: "Bidón de 4L",
      activo: true,
      size: 4000,
      empresaId: empresa.id
    });
    const presentacion2 = await Presentacion.create({
      descripcion: "Bolsa de 80g",
      activo: true,
      size: 80,
      empresaId: empresa.id
    });
    const presentacion3 = await Presentacion.create({
      descripcion: "Bolsa de 200g",
      activo: true,
      size: 200,
      empresaId: empresa.id
    });
    const presentacion4 = await Presentacion.create({
      descripcion: "Bolsa de 400g",
      activo: true,
      size: 400,
      empresaId: empresa.id
    });
    const presentacion5 = await Presentacion.create({
      descripcion: "Bolsa de 600g",
      activo: true,
      size: 600,
      empresaId: empresa.id
    });
    const presentacion6 = await Presentacion.create({
      descripcion: "Bolsa de 800g",
      activo: true,
      size: 800,
      empresaId: empresa.id
    });
    const presentacion7 = await Presentacion.create({
      descripcion: "Bolsa de 2Kg",
      activo: true,
      size: 2000,
      empresaId: empresa.id
    });
    const presentacion8 = await Presentacion.create({
      descripcion: "Bolsa de 3,4Kg",
      activo: true,
      size: 3400,
      empresaId: empresa.id
    });
    const presentacion9 = await Presentacion.create({
      descripcion: "Bolsa de 5Kg",
      activo: true,
      size: 5000,
      empresaId: empresa.id
    });
    const presentacion10 = await Presentacion.create({
      descripcion: "Bolsa de 10Kg",
      activo: true,
      size: 10000,
      empresaId: empresa.id
    });
    const presentacion11 = await Presentacion.create({
      descripcion: "Bolsa de 150g",
      activo: true,
      size: 150,
      empresaId: empresa.id
    });
    const presentacion12 = await Presentacion.create({
      descripcion: "Bolsa de 1Kg",
      activo: true,
      size: 1000,
      empresaId: empresa.id
    });
    const presentacion13 = await Presentacion.create({
      descripcion: "Bolsa de 3Kg",
      activo: true,
      size: 3000,
      empresaId: empresa.id
    });
    const presentacion14 = await Presentacion.create({
      descripcion: "Pan de 60g",
      activo: true,
      size: 60,
      empresaId: empresa.id
    });
    const presentacion15 = await Presentacion.create({
      descripcion: "Pan de 100g",
      activo: true,
      size: 100,
      empresaId: empresa.id
    });
    const presentacion16 = await Presentacion.create({
      descripcion: "Pan de 200g",
      activo: true,
      size: 200,
      empresaId: empresa.id
    });
    const presentacion17 = await Presentacion.create({
      descripcion: "Pack 10 x 40g",
      activo: true,
      size: 400,
      empresaId: empresa.id
    });
    const presentacion18 = await Presentacion.create({
      descripcion: "Barra de 500g",
      activo: true,
      size: 500,
      empresaId: empresa.id
    });
    const presentacion19 = await Presentacion.create({
      descripcion: "Barra de 1000g",
      activo: true,
      size: 1000,
      empresaId: empresa.id
    });
    const presentacion20 = await Presentacion.create({
      descripcion: "Pan de 180g",
      activo: true,
      size: 180,
      empresaId: empresa.id
    });
    const presentacion21 = await Presentacion.create({
      descripcion: "Pan de 130g",
      activo: true,
      size: 130,
      empresaId: empresa.id
    });
    const presentacion22 = await Presentacion.create({
      descripcion: "Pack de 5 x 180g",
      activo: true,
      size: 900,
      empresaId: empresa.id
    });
    const presentacion23 = await Presentacion.create({
      descripcion: "Pan de 250g",
      activo: true,
      size: 25,
      empresaId: empresa.id
    });
    const presentacion24 = await Presentacion.create({
      descripcion: "Pan de 230g",
      activo: true,
      size: 230,
      empresaId: empresa.id
    });
    const presentacion26 = await Presentacion.create({
      descripcion: "Bidón de 5L",
      activo: true,
      size: 5000,
      empresaId: empresa.id
    });
    const presentacion27 = await Presentacion.create({
      descripcion: "Botella 900ml",
      activo: true,
      size: 900,
      empresaId: empresa.id
    });
    const presentacion28 = await Presentacion.create({
      descripcion: "Botella Suav. 500ml",
      activo: true,
      size: 500,
      empresaId: empresa.id
    });
    const presentacion29 = await Presentacion.create({
      descripcion: "Caja de 20 x 300g",
      activo: true,
      size: 6000,
      empresaId: empresa.id
    });
    const presentacion30 = await Presentacion.create({
      descripcion: "Pack de 20 x 180g",
      activo: true,
      size: 3600,
      empresaId: empresa.id
    });
    const presentacion31 = await Presentacion.create({
      descripcion: "Bidón de 10L",
      activo: true,
      size: 10000,
      empresaId: empresa.id
    });
    const presentacion32 = await Presentacion.create({
      descripcion: "Pack de 15 x 25g",
      activo: true,
      size: 375,
      empresaId: empresa.id
    });
    const presentacion33 = await Presentacion.create({
      descripcion: "Doypack 1600ml",
      activo: true,
      size: 1600,
      empresaId: empresa.id
    });
    const presentacion34 = await Presentacion.create({
      descripcion: "Doypack 450ml",
      activo: true,
      size: 450,
      empresaId: empresa.id
    });
    const presentacion35 = await Presentacion.create({
      descripcion: "Sachet 70ml",
      activo: true,
      size: 70,
      empresaId: empresa.id
    });
    const presentacion36 = await Presentacion.create({
      descripcion: "Botella 1.5L",
      activo: true,
      size: 1500,
      empresaId: empresa.id
    });
    const presentacion37 = await Presentacion.create({
      descripcion: "Doypack 2L",
      activo: true,
      size: 2000,
      empresaId: empresa.id
    });
    const presentacion38 = await Presentacion.create({
      descripcion: "Tripack 3 x 130g",
      activo: true,
      size: 390,
      empresaId: empresa.id
    });
    const presentacion39 = await Presentacion.create({
      descripcion: "Caja de 500 x 10g",
      activo: true,
      size: 5000,
      empresaId: empresa.id
    });
    const presentacion40 = await Presentacion.create({
      descripcion: "Pastilla 130g",
      activo: true,
      size: 130,
      empresaId: empresa.id
    });
    const presentacion41 = await Presentacion.create({
      descripcion: "Pastilla 85g",
      activo: true,
      size: 85,
      empresaId: empresa.id
    });
    const presentacion42 = await Presentacion.create({
      descripcion: "Pastilla 25g",
      activo: true,
      size: 25,
      empresaId: empresa.id
    });
    const presentacion43 = await Presentacion.create({
      descripcion: "Pastilla 100g",
      activo: true,
      size: 100,
      empresaId: empresa.id
    });
    const presentacion44 = await Presentacion.create({
      descripcion: "Pack surtido 20 x 10g",
      activo: true,
      size: 200,
      empresaId: empresa.id
    });
    const presentacion45 = await Presentacion.create({
      descripcion: "Pastilla 125g",
      activo: true,
      size: 125,
      empresaId: empresa.id
    });
    const presentacion46 = await Presentacion.create({
      descripcion: "Caja de 300 x 20g",
      activo: true,
      size: 6000,
      empresaId: empresa.id
    });
    const presentacion47 = await Presentacion.create({
      descripcion: "Tripack 3 x 80g",
      activo: true,
      size: 240,
      empresaId: empresa.id
    });
    const presentacion48 = await Presentacion.create({
      descripcion: "1 Unidad",
      activo: true,
      size: 1,
      empresaId: empresa.id
    });
    const presentacion49 = await Presentacion.create({
      descripcion: "Rollo x 100 Unidades",
      activo: true,
      size: 100,
      empresaId: empresa.id
    });
    const presentacion50 = await Presentacion.create({
      descripcion: "Rollo x 30 Unidades",
      activo: true,
      size: 30,
      empresaId: empresa.id
    });
    const presentacion51 = await Presentacion.create({
      descripcion: "Bolsa de 100L",
      activo: true,
      size: 100,
      empresaId: empresa.id
    });
    const presentacion52 = await Presentacion.create({
      descripcion: "Bolsa de 150L",
      activo: true,
      size: 150,
      empresaId: empresa.id
    });
    const presentacion53 = await Presentacion.create({
      descripcion: "Bolsa de 200L",
      activo: true,
      size: 200,
      empresaId: empresa.id
    });
    const presentacion54 = await Presentacion.create({
      descripcion: "Caja 30 x 60g",
      activo: true,
      size: 180,
      empresaId: empresa.id
    });
    const presentacion55 = await Presentacion.create({
      descripcion: "Caja de 20 x 200g",
      activo: true,
      size: 4000,
      empresaId: empresa.id
    });
    const presentacion56 = await Presentacion.create({
      descripcion: "Doypack 900ml",
      activo: true,
      size: 900,
      empresaId: empresa.id
    });
    const presentacion57 = await Presentacion.create({
      descripcion: "Caja de 250 x 25g",
      activo: true,
      size: 625,
      empresaId: empresa.id
    });
    const presentacion58 = await Presentacion.create({
      descripcion: "Pack surtido 25 x 10g",
      activo: true,
      size: 25,
      empresaId: empresa.id
    });
    const presentacion59 = await Presentacion.create({
      descripcion: "Caja de 20 x 250g",
      activo: true,
      size: 25,
      empresaId: empresa.id
    });
    const presentacion60 = await Presentacion.create({
      descripcion: "Caja de 20 x 180g",
      activo: true,
      size: 180,
      empresaId: empresa.id
    });
    const presentacion61 = await Presentacion.create({
      descripcion: "Botella 500ml ",
      activo: true,
      size: 500,
      empresaId: empresa.id
    });
    const presentacion62 = await Presentacion.create({
      descripcion: "Botella 500ml.",
      activo: true,
      size: 500,
      empresaId: empresa.id
    });
    const presentacion63 = await Presentacion.create({
      descripcion: "Bolsa de 400g.",
      activo: true,
      size: 400,
      empresaId: empresa.id
    });
    const presentacion64 = await Presentacion.create({
      descripcion: "Estuche de 125g",
      activo: true,
      size: 125,
      empresaId: empresa.id
    });
    const presentacion65 = await Presentacion.create({
      descripcion: "Estuche de 100 g",
      activo: true,
      size: 100,
      empresaId: empresa.id
    });
    const presentacion66 = await Presentacion.create({
      descripcion: "Sachet 1600ml",
      activo: true,
      size: 1600,
      empresaId: empresa.id
    });
    const presentacion67 = await Presentacion.create({
      descripcion: "Doypack 200ml	",
      activo: true,
      size: 200,
      empresaId: empresa.id
    });
    const presentacion68 = await Presentacion.create({
      descripcion: "Doypack 400ml	",
      activo: true,
      size: 400,
      empresaId: empresa.id
    });
    const presentacion69 = await Presentacion.create({
      descripcion: "Doypack 800ml",
      activo: true,
      size: 800,
      empresaId: empresa.id
    });
    const presentacion70 = await Presentacion.create({
      descripcion: "Doypack 500ml	",
      activo: true,
      size: 500,
      empresaId: empresa.id
    });
    const presentacion71 = await Presentacion.create({
      descripcion: "KIT",
      activo: true,
      size: 0,
      empresaId: empresa.id
    });
    const presentacion72 = await Presentacion.create({
      descripcion: "Caja de 20 x 150g	",
      activo: true,
      size: 150,
      empresaId: empresa.id
    });
    const presentacion73 = await Presentacion.create({
      descripcion: "Pastilla 90g",
      activo: true,
      size: 90,
      empresaId: empresa.id
    });
    const presentacion74 = await Presentacion.create({
      descripcion: "Pack Promocional 1400ml",
      activo: true,
      size: 1400,
      empresaId: empresa.id
    });

    const variante25 = await Variante.create({
      codErp: "300000000",
      porcIva: 10,
      img: "37aec798-59d0-44a3-8981-d9e0b248e502.jpg",
      codBarra: "",
      productoId: producto6.id,
      unidadId: unidadUN.id,
      variedadId: variedad34.id,
      presentacionId: presentacion16.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante22 = await Variante.create({
      codErp: "300000002",
      porcIva: 10,
      img: "5569183d-b6f9-4430-b2bb-273c37b2039a.jpg",
      codBarra: "",
      productoId: producto6.id,
      unidadId: unidadUN.id,
      variedadId: variedad34.id,
      presentacionId: presentacion17.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante23 = await Variante.create({
      codErp: "300000003",
      porcIva: 10,
      img: "7500633b-8264-4bb3-8a2e-1eb6e36fa894.jpg",
      codBarra: "",
      productoId: producto6.id,
      unidadId: unidadUN.id,
      variedadId: variedad34.id,
      presentacionId: presentacion15.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante90 = await Variante.create({
      codErp: "300000007",
      porcIva: 10,
      img: "bc650974-1b03-43f8-9567-1b3b4d41566f.jpg",
      codBarra: "",
      productoId: producto20.id,
      unidadId: unidadUN.id,
      variedadId: variedad78.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante89 = await Variante.create({
      codErp: "300000008",
      porcIva: 10,
      img: "abcfb12c-4def-4436-86d2-c570ffd9af7d.jpg",
      codBarra: "",
      productoId: producto20.id,
      unidadId: unidadUN.id,
      variedadId: variedad78.id,
      presentacionId: presentacion31.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante57 = await Variante.create({
      codErp: "300000009",
      porcIva: 10,
      img: "4f00f884-773d-4996-8755-5f64b4c0c351.jpg",
      codBarra: "",
      productoId: producto12.id,
      unidadId: unidadUN.id,
      variedadId: variedad73.id,
      presentacionId: presentacion44.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante15 = await Variante.create({
      codErp: "300000015",
      porcIva: 10,
      img: "716da456-ac0d-473f-953e-13bffe6232f7.jpg",
      codBarra: "",
      productoId: producto4.id,
      unidadId: unidadUN.id,
      variedadId: variedad78.id,
      presentacionId: presentacion61.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante14 = await Variante.create({
      codErp: "300000016",
      porcIva: 10,
      img: "35e93ce3-e1b7-418b-be8e-5de2f9aac5fe.jpg",
      codBarra: "",
      productoId: producto4.id,
      unidadId: unidadUN.id,
      variedadId: variedad78.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante134 = await Variante.create({
      codErp: "300000023",
      porcIva: 10,
      img: "c9dd0b72-b512-40c4-a744-8dc457d5addb.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion36.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante136 = await Variante.create({
      codErp: "300000029",
      porcIva: 10,
      img: "0d01b390-fe60-442e-95d0-2be1ee8fb349.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion1.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante138 = await Variante.create({
      codErp: "300000030",
      porcIva: 10,
      img: "1d883b26-8e95-45b2-988c-cde9c23f1223.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion28.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante146 = await Variante.create({
      codErp: "300000031",
      porcIva: 10,
      img: "bd77bf07-e1b4-4732-8eee-e4b1cf16a0c5.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad6.id,
      presentacionId: presentacion28.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante153 = await Variante.create({
      codErp: "300000032",
      porcIva: 10,
      img: "b70768cd-7ebc-4263-ab96-440176f44279.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad7.id,
      presentacionId: presentacion28.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante140 = await Variante.create({
      codErp: "300000033",
      porcIva: 10,
      img: "8abdbf4a-f7ef-4374-b77e-ff0b2890a867.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion56.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante155 = await Variante.create({
      codErp: "300000034",
      porcIva: 10,
      img: "9ff1a20f-74f6-4d0f-a8ff-01762a751981.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad7.id,
      presentacionId: presentacion56.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante142 = await Variante.create({
      codErp: "300000036",
      porcIva: 10,
      img: "c8b63750-ca64-482b-9434-763938617ae5.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad6.id,
      presentacionId: presentacion36.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante149 = await Variante.create({
      codErp: "300000037",
      porcIva: 10,
      img: "04f40722-d0c5-4851-83ff-6eeb31c602f6.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad7.id,
      presentacionId: presentacion36.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante135 = await Variante.create({
      codErp: "300000038",
      porcIva: 10,
      img: "bd8207d2-85a8-4b4d-a9bc-9fb8a6123786.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion37.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante150 = await Variante.create({
      codErp: "300000039",
      porcIva: 10,
      img: "c0175cff-98d6-4bc0-bbf7-48fbbb95f42d.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad7.id,
      presentacionId: presentacion37.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante145 = await Variante.create({
      codErp: "300000040",
      porcIva: 10,
      img: "df50ec08-0cb8-4916-a53c-52d3a95574e3.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad6.id,
      presentacionId: presentacion34.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante152 = await Variante.create({
      codErp: "300000041",
      porcIva: 10,
      img: "0555a019-ed4d-48cb-861d-6890435bbfd2.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad7.id,
      presentacionId: presentacion34.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante144 = await Variante.create({
      codErp: "300000042",
      porcIva: 10,
      img: "f7495d26-1597-4e88-b0d5-15e979b6a57c.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad6.id,
      presentacionId: presentacion1.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante151 = await Variante.create({
      codErp: "300000043",
      porcIva: 10,
      img: "51a3030b-c9aa-4a6c-9468-5cbb92b83aa6.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad7.id,
      presentacionId: presentacion1.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante139 = await Variante.create({
      codErp: "300000046",
      porcIva: 10,
      img: "2ca6f955-2a56-4cd4-8168-70af0e8e1b27.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadDSP.id,
      variedadId: variedad5.id,
      presentacionId: presentacion35.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante154 = await Variante.create({
      codErp: "300000047",
      porcIva: 10,
      img: "1ef1e8d0-45ba-4847-845f-0f9741a91e24.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadDSP.id,
      variedadId: variedad7.id,
      presentacionId: presentacion35.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante137 = await Variante.create({
      codErp: "300000048",
      porcIva: 10,
      img: "659f48b8-5199-4fc3-9ca7-6cbd44b9ce36.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion34.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante27 = await Variante.create({
      codErp: "300000050",
      porcIva: 10,
      img: "a6238703-0463-443a-889e-371b39543a87.jpg",
      codBarra: "",
      productoId: producto6.id,
      unidadId: unidadUN.id,
      variedadId: variedad34.id,
      presentacionId: presentacion18.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante24 = await Variante.create({
      codErp: "300000052",
      porcIva: 10,
      img: "07eea7b4-38cd-4d36-ab67-039a1e5c4c9c.jpg",
      codBarra: "",
      productoId: producto6.id,
      unidadId: unidadUN.id,
      variedadId: variedad34.id,
      presentacionId: presentacion19.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante50 = await Variante.create({
      codErp: "300000055",
      porcIva: 10,
      img: "150c0c8d-fe0b-4957-9b61-ea4ad9858679.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadCJ.id,
      variedadId: variedad42.id,
      presentacionId: presentacion57.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante46 = await Variante.create({
      codErp: "300000056",
      porcIva: 10,
      img: "92145545-b940-4e3a-8938-b7ffa4c04e90.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadCJ.id,
      variedadId: variedad43.id,
      presentacionId: presentacion57.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante48 = await Variante.create({
      codErp: "300000057",
      porcIva: 10,
      img: "f7677d0a-1003-4bbe-8299-05702fd6d23d.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadCJ.id,
      variedadId: variedad71.id,
      presentacionId: presentacion57.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante49 = await Variante.create({
      codErp: "300000065",
      porcIva: 10,
      img: "bf941652-dfa4-4a1e-b3d7-f1bd21366a68.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadUN.id,
      variedadId: variedad42.id,
      presentacionId: presentacion43.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante65 = await Variante.create({
      codErp: "300000074",
      porcIva: 10,
      img: "0f9b002d-d9db-48ec-9889-5ab5727f411d.jpg",
      codBarra: "",
      productoId: producto13.id,
      unidadId: unidadUN.id,
      variedadId: variedad39.id,
      presentacionId: presentacion2.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante63 = await Variante.create({
      codErp: "300000075",
      porcIva: 10,
      img: "a68ac70e-304a-404d-aeca-88d9f75c770b.jpg",
      codBarra: "",
      productoId: producto13.id,
      unidadId: unidadUN.id,
      variedadId: variedad39.id,
      presentacionId: presentacion3.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante61 = await Variante.create({
      codErp: "300000078",
      porcIva: 10,
      img: "51c472ec-f63b-4ebf-8fb7-c916321ab366.jpg",
      codBarra: "",
      productoId: producto13.id,
      unidadId: unidadUN.id,
      variedadId: variedad40.id,
      presentacionId: presentacion2.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante59 = await Variante.create({
      codErp: "300000079",
      porcIva: 10,
      img: "1802ee86-0a25-4d97-86b4-f9f7b244cbc1.jpg",
      codBarra: "",
      productoId: producto13.id,
      unidadId: unidadUN.id,
      variedadId: variedad40.id,
      presentacionId: presentacion3.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante60 = await Variante.create({
      codErp: "300000080",
      porcIva: 10,
      img: "5eb61175-bc24-4641-a01d-674cced98449.jpg",
      codBarra: "",
      productoId: producto13.id,
      unidadId: unidadUN.id,
      variedadId: variedad40.id,
      presentacionId: presentacion63.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante62 = await Variante.create({
      codErp: "300000081",
      porcIva: 10,
      img: "2a5320ba-c72a-45c6-941a-40eb58ffb801.jpg",
      codBarra: "",
      productoId: producto13.id,
      unidadId: unidadUN.id,
      variedadId: variedad40.id,
      presentacionId: presentacion6.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante64 = await Variante.create({
      codErp: "300000086",
      porcIva: 10,
      img: "a734f0fd-11c3-477f-9bf8-8c1d9acd758e.jpg",
      codBarra: "",
      productoId: producto13.id,
      unidadId: unidadUN.id,
      variedadId: variedad39.id,
      presentacionId: presentacion63.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante66 = await Variante.create({
      codErp: "300000087",
      porcIva: 10,
      img: "2f7ea225-46b5-4ddd-a799-9288a9718642.jpg",
      codBarra: "",
      productoId: producto13.id,
      unidadId: unidadUN.id,
      variedadId: variedad39.id,
      presentacionId: presentacion6.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante79 = await Variante.create({
      codErp: "300000090",
      porcIva: 10,
      img: "7f75c60d-3bcf-44b6-9078-77682d7531f6.jpg",
      codBarra: "",
      productoId: producto18.id,
      unidadId: unidadUN.id,
      variedadId: variedad33.id,
      presentacionId: presentacion21.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante82 = await Variante.create({
      codErp: "300000091",
      porcIva: 10,
      img: "f0b1a16c-5e44-4e55-b24e-3187ba27894c.jpg",
      codBarra: "",
      productoId: producto18.id,
      unidadId: unidadUN.id,
      variedadId: variedad32.id,
      presentacionId: presentacion21.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante75 = await Variante.create({
      codErp: "300000092",
      porcIva: 10,
      img: "0ca2e5c3-ae64-491c-9f6c-443927bba303.jpg",
      codBarra: "",
      productoId: producto17.id,
      unidadId: unidadUN.id,
      variedadId: variedad31.id,
      presentacionId: presentacion21.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante77 = await Variante.create({
      codErp: "300000095",
      porcIva: 10,
      img: "e04158b7-35b1-4dc6-a320-f6a8ecba89a0.jpg",
      codBarra: "",
      productoId: producto17.id,
      unidadId: unidadUN.id,
      variedadId: variedad31.id,
      presentacionId: presentacion22.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante76 = await Variante.create({
      codErp: "300000096",
      porcIva: 10,
      img: "04de7e4b-0fe3-4df7-85db-54e6aa11cc9a.jpg",
      codBarra: "",
      productoId: producto17.id,
      unidadId: unidadUN.id,
      variedadId: variedad31.id,
      presentacionId: presentacion16.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante173 = await Variante.create({
      codErp: "300000097",
      porcIva: 10,
      img: "2a518bb5-900b-40f6-b815-aa3a476943f1.jpg",
      codBarra: "",
      productoId: producto35.id,
      unidadId: unidadUN.id,
      variedadId: variedad29.id,
      presentacionId: presentacion24.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante172 = await Variante.create({
      codErp: "300000098",
      porcIva: 10,
      img: "72532c25-7913-44d4-8d8d-b33df9e9b81e.jpg",
      codBarra: "",
      productoId: producto34.id,
      unidadId: unidadUN.id,
      variedadId: variedad30.id,
      presentacionId: presentacion23.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante17 = await Variante.create({
      codErp: "300000100",
      porcIva: 10,
      img: "bf901f25-65ce-49f5-b8ee-3a2ee5b78cf2.jpg",
      codBarra: "",
      productoId: producto5.id,
      unidadId: unidadUN.id,
      variedadId: variedad37.id,
      presentacionId: presentacion62.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante21 = await Variante.create({
      codErp: "300000101",
      porcIva: 10,
      img: "6148bf55-18c3-4292-98d7-441f94a37add.jpg",
      codBarra: "",
      productoId: producto5.id,
      unidadId: unidadUN.id,
      variedadId: variedad9.id,
      presentacionId: presentacion62.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante19 = await Variante.create({
      codErp: "300000102",
      porcIva: 10,
      img: "d16c4566-2d59-429c-90ea-8ba9409b949e.jpg",
      codBarra: "",
      productoId: producto5.id,
      unidadId: unidadUN.id,
      variedadId: variedad38.id,
      presentacionId: presentacion62.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante16 = await Variante.create({
      codErp: "300000103",
      porcIva: 10,
      img: "6fb78dd6-f671-497d-a6b8-97843c3fb397.jpg",
      codBarra: "",
      productoId: producto5.id,
      unidadId: unidadUN.id,
      variedadId: variedad37.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante18 = await Variante.create({
      codErp: "300000104",
      porcIva: 10,
      img: "6ab9e180-5307-4428-90bd-ea1f4a0f0743.jpg",
      codBarra: "",
      productoId: producto5.id,
      unidadId: unidadUN.id,
      variedadId: variedad38.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante20 = await Variante.create({
      codErp: "300000105",
      porcIva: 10,
      img: "d80a929d-c617-427f-92b7-b16b09efd244.jpg",
      codBarra: "",
      productoId: producto5.id,
      unidadId: unidadUN.id,
      variedadId: variedad9.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante158 = await Variante.create({
      codErp: "300000110",
      porcIva: 10,
      img: "6dff5b8c-ddcb-4745-be73-2cda0ecb5fb1.jpg",
      codBarra: "",
      productoId: producto29.id,
      unidadId: unidadCJ.id,
      variedadId: variedad1.id,
      presentacionId: presentacion1.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante32 = await Variante.create({
      codErp: "300000113",
      porcIva: 10,
      img: "dcbf95c8-b0d8-4402-aec2-1ed79a07ba0b.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion40.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante38 = await Variante.create({
      codErp: "300000114",
      porcIva: 10,
      img: "dcf4cd93-1afd-4aa2-ae9a-c7e3b9a6bed0.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad59.id,
      presentacionId: presentacion40.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante42 = await Variante.create({
      codErp: "300000115",
      porcIva: 10,
      img: "a9531521-59be-4ad8-bad5-1a562b472ee8.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad23.id,
      presentacionId: presentacion40.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante35 = await Variante.create({
      codErp: "300000116",
      porcIva: 10,
      img: "d6755142-dc2e-4a09-bf50-16efd7949370.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad71.id,
      presentacionId: presentacion40.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante33 = await Variante.create({
      codErp: "300000125",
      porcIva: 10,
      img: "e0ca3387-e03d-41f9-9efd-6f5b39df33ec.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion41.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante43 = await Variante.create({
      codErp: "300000126",
      porcIva: 10,
      img: "a960b5aa-0747-4b3a-aa76-d4149c339403.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad23.id,
      presentacionId: presentacion41.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante39 = await Variante.create({
      codErp: "300000127",
      porcIva: 10,
      img: "31d172e3-9402-46bf-ab66-ec40c8402263.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad59.id,
      presentacionId: presentacion41.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante41 = await Variante.create({
      codErp: "300000128",
      porcIva: 10,
      img: "5ac9ec54-0c9d-439c-b597-74503747d89b.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad62.id,
      presentacionId: presentacion41.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante36 = await Variante.create({
      codErp: "300000134",
      porcIva: 10,
      img: "82a05377-f9fb-476c-bd4b-a5a14c9efd7c.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad71.id,
      presentacionId: presentacion41.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante31 = await Variante.create({
      codErp: "300000135",
      porcIva: 10,
      img: "6d0bd5bb-e637-40b4-a1e2-00e868846fb8.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad60.id,
      presentacionId: presentacion41.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante53 = await Variante.create({
      codErp: "300000136",
      porcIva: 10,
      img: "cd3d816d-59e5-43d6-bf3d-c3b63e7d65e8.jpg",
      codBarra: "",
      productoId: producto10.id,
      unidadId: unidadUN.id,
      variedadId: variedad67.id,
      presentacionId: presentacion47.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante54 = await Variante.create({
      codErp: "300000137",
      porcIva: 10,
      img: "1b26aa22-26f1-4d69-99de-2b1cbd5ab3f4.jpg",
      codBarra: "",
      productoId: producto10.id,
      unidadId: unidadUN.id,
      variedadId: variedad66.id,
      presentacionId: presentacion47.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante55 = await Variante.create({
      codErp: "300000138",
      porcIva: 10,
      img: "1af9f7a5-5887-4700-83c0-4aa1fd3bf4d6.jpg",
      codBarra: "",
      productoId: producto10.id,
      unidadId: unidadUN.id,
      variedadId: variedad68.id,
      presentacionId: presentacion47.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante56 = await Variante.create({
      codErp: "300000153",
      porcIva: 10,
      img: "6d074da7-bd44-4c7d-bd31-ef72e905b096.jpg",
      codBarra: "",
      productoId: producto11.id,
      unidadId: unidadCJ.id,
      variedadId: variedad72.id,
      presentacionId: presentacion46.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante70 = await Variante.create({
      codErp: "300000224",
      porcIva: 10,
      img: "ee36a940-6ccd-4903-a2d4-e8abd0862529.jpg",
      codBarra: "",
      productoId: producto16.id,
      unidadId: unidadCJ.id,
      variedadId: variedad33.id,
      presentacionId: presentacion60.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante72 = await Variante.create({
      codErp: "300000225",
      porcIva: 10,
      img: "eb133809-4d7d-49ea-9304-e6fe0128fa45.jpg",
      codBarra: "",
      productoId: producto16.id,
      unidadId: unidadCJ.id,
      variedadId: variedad32.id,
      presentacionId: presentacion60.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante119 = await Variante.create({
      codErp: "300000229",
      porcIva: 10,
      img: "3463a9a4-c9ed-49f6-9849-43abdde2b487.jpg",
      codBarra: "",
      productoId: producto25.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion10.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante113 = await Variante.create({
      codErp: "300000230",
      porcIva: 10,
      img: "bac09ddc-04ce-4f6e-95f2-0e70f111c7bd.jpg",
      codBarra: "",
      productoId: producto25.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion12.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante114 = await Variante.create({
      codErp: "300000231",
      porcIva: 10,
      img: "de465085-f106-48c0-abfa-4878e7c30c8a.jpg",
      codBarra: "",
      productoId: producto25.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion10.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante112 = await Variante.create({
      codErp: "300000232",
      porcIva: 10,
      img: "e414c018-7ec4-42a2-8295-4075b7bf64ca.jpg",
      codBarra: "",
      productoId: producto25.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion4.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante115 = await Variante.create({
      codErp: "300000233",
      porcIva: 10,
      img: "012fda5e-5e76-4e43-a2d9-793ed8f1aa4d.jpg",
      codBarra: "",
      productoId: producto25.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion11.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante117 = await Variante.create({
      codErp: "300000234",
      porcIva: 10,
      img: "2ad2bbb5-a714-41b8-ad3f-a1bed4c4fd5d.jpg",
      codBarra: "",
      productoId: producto25.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion4.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante116 = await Variante.create({
      codErp: "300000235",
      porcIva: 10,
      img: "890e2750-ac9a-411f-b31e-a6a0e0a23e24.jpg",
      codBarra: "",
      productoId: producto25.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion13.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante118 = await Variante.create({
      codErp: "300000236",
      porcIva: 10,
      img: "34d2f6b4-527c-49e5-abdf-345c945d90ea.jpg",
      codBarra: "",
      productoId: producto25.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion12.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante111 = await Variante.create({
      codErp: "300000237",
      porcIva: 10,
      img: "7c8e0cf5-813c-4905-aaf5-30f05b70d7e0.jpg",
      codBarra: "",
      productoId: producto25.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion13.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante120 = await Variante.create({
      codErp: "300000238",
      porcIva: 10,
      img: "841ea444-0ac3-4b6f-8eaf-d93a72144582.jpg",
      codBarra: "",
      productoId: producto25.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion11.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante104 = await Variante.create({
      codErp: "300000243",
      porcIva: 10,
      img: "22b3f640-a65c-41df-86ff-fdd564792da4.jpg",
      codBarra: "",
      productoId: producto23.id,
      unidadId: unidadUN.id,
      variedadId: variedad76.id,
      presentacionId: presentacion10.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante98 = await Variante.create({
      codErp: "300000250",
      porcIva: 10,
      img: "8a698107-ef61-4775-a21a-7bb8de9aac0f.jpg",
      codBarra: "",
      productoId: producto21.id,
      unidadId: unidadUN.id,
      variedadId: variedad44.id,
      presentacionId: presentacion2.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante96 = await Variante.create({
      codErp: "300000251",
      porcIva: 10,
      img: "60f9622a-45b8-4c6d-a882-7f5df8b37614.jpg",
      codBarra: "",
      productoId: producto21.id,
      unidadId: unidadUN.id,
      variedadId: variedad44.id,
      presentacionId: presentacion3.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante97 = await Variante.create({
      codErp: "300000252",
      porcIva: 10,
      img: "088bff56-ce65-43e4-b9f3-7e8b68d30206.jpg",
      codBarra: "",
      productoId: producto21.id,
      unidadId: unidadUN.id,
      variedadId: variedad44.id,
      presentacionId: presentacion4.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante99 = await Variante.create({
      codErp: "300000253",
      porcIva: 10,
      img: "b01ad233-4f23-4a19-b497-dbc84fc5f61a.jpg",
      codBarra: "",
      productoId: producto21.id,
      unidadId: unidadUN.id,
      variedadId: variedad44.id,
      presentacionId: presentacion6.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante183 = await Variante.create({
      codErp: "300000255",
      porcIva: 10,
      img: "6f65155c-eb1a-4fe8-b48a-a218278cbe72.jpg",
      codBarra: "",
      productoId: producto21.id,
      unidadId: unidadUN.id,
      variedadId: variedad45.id,
      presentacionId: presentacion3.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante184 = await Variante.create({
      codErp: "300000256",
      porcIva: 10,
      img: "bf9bbaf2-384c-41ff-90b4-6891adadeb54.jpg",
      codBarra: "",
      productoId: producto21.id,
      unidadId: unidadUN.id,
      variedadId: variedad45.id,
      presentacionId: presentacion4.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante185 = await Variante.create({
      codErp: "300000257",
      porcIva: 10,
      img: "2599a722-092a-4f84-abab-7980e220c460.jpg",
      codBarra: "",
      productoId: producto21.id,
      unidadId: unidadUN.id,
      variedadId: variedad45.id,
      presentacionId: presentacion6.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante125 = await Variante.create({
      codErp: "300000270",
      porcIva: 10,
      img: "1f84a68a-cd89-4b5e-ad92-8007e9061e39.jpg",
      codBarra: "",
      productoId: producto26.id,
      unidadId: unidadDSP.id,
      variedadId: variedad42.id,
      presentacionId: presentacion35.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante132 = await Variante.create({
      codErp: "300000271",
      porcIva: 10,
      img: "48ae4a58-abcc-489e-8a93-7f917bc5079a.jpg",
      codBarra: "",
      productoId: producto26.id,
      unidadId: unidadDSP.id,
      variedadId: variedad51.id,
      presentacionId: presentacion35.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante128 = await Variante.create({
      codErp: "300000272",
      porcIva: 10,
      img: "8acf04a1-ea9a-4bf2-8233-317284a5c795.jpg",
      codBarra: "",
      productoId: producto26.id,
      unidadId: unidadDSP.id,
      variedadId: variedad57.id,
      presentacionId: presentacion35.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante124 = await Variante.create({
      codErp: "300000273",
      porcIva: 10,
      img: "4155d293-8fb7-40b8-aa59-560144dce145.jpg",
      codBarra: "",
      productoId: producto26.id,
      unidadId: unidadUN.id,
      variedadId: variedad42.id,
      presentacionId: presentacion34.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante131 = await Variante.create({
      codErp: "300000274",
      porcIva: 10,
      img: "9fa9cdc2-de37-451c-9471-9dd11e4e2a3e.jpg",
      codBarra: "",
      productoId: producto26.id,
      unidadId: unidadUN.id,
      variedadId: variedad51.id,
      presentacionId: presentacion34.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante127 = await Variante.create({
      codErp: "300000275",
      porcIva: 10,
      img: "54035971-1a9f-4054-a868-12d2754f3d68.jpg",
      codBarra: "",
      productoId: producto26.id,
      unidadId: unidadUN.id,
      variedadId: variedad57.id,
      presentacionId: presentacion34.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante108 = await Variante.create({
      codErp: "300000276",
      porcIva: 10,
      img: "96f56ff7-0a5d-4dab-aab0-4f9bca18c19a.jpg",
      codBarra: "",
      productoId: producto24.id,
      unidadId: unidadUN.id,
      variedadId: variedad77.id,
      presentacionId: presentacion7.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante109 = await Variante.create({
      codErp: "300000277",
      porcIva: 10,
      img: "951a453d-9a5a-4da3-8eb3-76c2c11be125.jpg",
      codBarra: "",
      productoId: producto24.id,
      unidadId: unidadUN.id,
      variedadId: variedad77.id,
      presentacionId: presentacion9.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante37 = await Variante.create({
      codErp: "300000332",
      porcIva: 10,
      img: "9f1e623e-aab4-4d71-95ce-416d853a3fd3.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad71.id,
      presentacionId: presentacion38.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante34 = await Variante.create({
      codErp: "300000333",
      porcIva: 10,
      img: "db0c0530-45ea-4269-bc76-600a392b72fd.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion38.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante40 = await Variante.create({
      codErp: "300000334",
      porcIva: 10,
      img: "df35c31e-7b25-4811-b180-d54c5ebe7371.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad59.id,
      presentacionId: presentacion38.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante44 = await Variante.create({
      codErp: "300000335",
      porcIva: 10,
      img: "227949b0-7677-49fc-90d7-776862251385.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad23.id,
      presentacionId: presentacion38.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante85 = await Variante.create({
      codErp: "300000362",
      porcIva: 10,
      img: "fe5e643e-9173-4a2c-9017-b0d9da48749c.jpg",
      codBarra: "",
      productoId: producto19.id,
      unidadId: unidadUN.id,
      variedadId: variedad70.id,
      presentacionId: presentacion20.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante87 = await Variante.create({
      codErp: "300000363",
      porcIva: 10,
      img: "5844c8af-fdc3-46c7-a06e-1506e9e9222e.jpg",
      codBarra: "",
      productoId: producto19.id,
      unidadId: unidadUN.id,
      variedadId: variedad69.id,
      presentacionId: presentacion20.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante88 = await Variante.create({
      codErp: "300000364",
      porcIva: 10,
      img: "ec33e47e-18e1-4287-a47c-06e8820903a8.jpg",
      codBarra: "",
      productoId: producto19.id,
      unidadId: unidadUN.id,
      variedadId: variedad54.id,
      presentacionId: presentacion20.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante86 = await Variante.create({
      codErp: "300000365",
      porcIva: 10,
      img: "c3e0505c-a218-4c10-9768-1b14efc21684.jpg",
      codBarra: "",
      productoId: producto19.id,
      unidadId: unidadUN.id,
      variedadId: variedad53.id,
      presentacionId: presentacion20.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante95 = await Variante.create({
      codErp: "300000444",
      porcIva: 10,
      img: "159af30b-2fa3-4540-b2b7-518ae9441958.jpg",
      codBarra: "",
      productoId: producto21.id,
      unidadId: unidadUN.id,
      variedadId: variedad44.id,
      presentacionId: presentacion7.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante147 = await Variante.create({
      codErp: "300000448",
      porcIva: 10,
      img: "4b95de2d-e48a-48b8-93a5-720f33d30bdc.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad6.id,
      presentacionId: presentacion56.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante122 = await Variante.create({
      codErp: "300000492",
      porcIva: 10,
      img: "a930a188-1e58-47cf-9cc5-2b74c1d2aa8a.jpg",
      codBarra: "",
      productoId: producto26.id,
      unidadId: unidadUN.id,
      variedadId: variedad42.id,
      presentacionId: presentacion33.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante129 = await Variante.create({
      codErp: "300000493",
      porcIva: 10,
      img: "4b3f3f26-ab4e-48db-ad91-5fc11a53963c.jpg",
      codBarra: "",
      productoId: producto26.id,
      unidadId: unidadUN.id,
      variedadId: variedad51.id,
      presentacionId: presentacion33.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante121 = await Variante.create({
      codErp: "300000494",
      porcIva: 10,
      img: "78204a59-096d-4074-aa97-fa7942492817.jpg",
      codBarra: "",
      productoId: producto26.id,
      unidadId: unidadUN.id,
      variedadId: variedad57.id,
      presentacionId: presentacion33.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante123 = await Variante.create({
      codErp: "300000495",
      porcIva: 10,
      img: "3a21c6b6-1893-495a-81b9-aff3a70ebb71.jpg",
      codBarra: "",
      productoId: producto26.id,
      unidadId: unidadUN.id,
      variedadId: variedad42.id,
      presentacionId: presentacion1.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante130 = await Variante.create({
      codErp: "300000496",
      porcIva: 10,
      img: "eadd0abe-fe38-4808-b042-96bce0140c0e.jpg",
      codBarra: "",
      productoId: producto26.id,
      unidadId: unidadUN.id,
      variedadId: variedad51.id,
      presentacionId: presentacion1.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante126 = await Variante.create({
      codErp: "300000497",
      porcIva: 10,
      img: "e826e395-7425-4095-9102-05fdb69fa324.jpg",
      codBarra: "",
      productoId: producto26.id,
      unidadId: unidadUN.id,
      variedadId: variedad57.id,
      presentacionId: presentacion1.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante190 = await Variante.create({
      codErp: "300000594",
      porcIva: 10,
      img: "e30dbebb-b2af-4a26-9553-8fe4aab933a6.jpg",
      codBarra: "",
      productoId: producto16.id,
      unidadId: unidadCJ.id,
      variedadId: variedad33.id,
      presentacionId: presentacion59.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante191 = await Variante.create({
      codErp: "300000595",
      porcIva: 10,
      img: "c3479a31-5aae-4b87-9d4e-01b9bd5d21e0.jpg",
      codBarra: "",
      productoId: producto16.id,
      unidadId: unidadCJ.id,
      variedadId: variedad32.id,
      presentacionId: presentacion59.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante30 = await Variante.create({
      codErp: "300000603",
      porcIva: 10,
      img: "e3900820-219a-4cf9-9bca-a23d8cc4f2ed.jpg",
      codBarra: "",
      productoId: producto7.id,
      unidadId: unidadUN.id,
      variedadId: variedad9.id,
      presentacionId: presentacion45.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante29 = await Variante.create({
      codErp: "300000604",
      porcIva: 10,
      img: "c73fff77-2883-42fd-92c0-b6e33a159200.jpg",
      codBarra: "",
      productoId: producto7.id,
      unidadId: unidadUN.id,
      variedadId: variedad42.id,
      presentacionId: presentacion45.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante28 = await Variante.create({
      codErp: "300000605",
      porcIva: 10,
      img: "58dde8e1-765d-40b8-9bcd-fd7c52b5e475.jpg",
      codBarra: "",
      productoId: producto7.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion45.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante110 = await Variante.create({
      codErp: "300000610",
      porcIva: 10,
      img: "e05bc7d4-e538-44a0-b1ac-728418c679ff.jpg",
      codBarra: "",
      productoId: producto24.id,
      unidadId: unidadUN.id,
      variedadId: variedad77.id,
      presentacionId: presentacion5.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante186 = await Variante.create({
      codErp: "300000615",
      porcIva: 10,
      img: "76da72b3-d87b-46f5-a017-9d2c1a66acf3.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadDSP.id,
      variedadId: variedad6.id,
      presentacionId: presentacion35.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante143 = await Variante.create({
      codErp: "300000616",
      porcIva: 10,
      img: "041918d5-44a0-488e-a174-3f91f81ef7e9.jpg",
      codBarra: "",
      productoId: producto27.id,
      unidadId: unidadUN.id,
      variedadId: variedad6.id,
      presentacionId: presentacion37.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante68 = await Variante.create({
      codErp: "300000623",
      porcIva: 10,
      img: "f314fd22-845c-4afc-a98f-7df7001f28a6.jpg",
      codBarra: "",
      productoId: producto15.id,
      unidadId: unidadUN.id,
      variedadId: variedad74.id,
      presentacionId: presentacion1.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante69 = await Variante.create({
      codErp: "300000624",
      porcIva: 10,
      img: "52c9fc88-c368-4bcb-9523-2c6f73e71142.jpg",
      codBarra: "",
      productoId: producto15.id,
      unidadId: unidadUN.id,
      variedadId: variedad94.id,
      presentacionId: presentacion1.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante187 = await Variante.create({
      codErp: "300000625",
      porcIva: 10,
      img: "3c82ff61-3ca5-4654-8ffa-fec7bdc9afd4.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadPCK.id,
      variedadId: variedad73.id,
      presentacionId: presentacion32.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante67 = await Variante.create({
      codErp: "300000628",
      porcIva: 10,
      img: "6d4374f7-b0fb-4824-9c48-219ecfed0c66.jpg",
      codBarra: "",
      productoId: producto14.id,
      unidadId: unidadUN.id,
      variedadId: variedad55.id,
      presentacionId: presentacion1.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante26 = await Variante.create({
      codErp: "300000629",
      porcIva: 10,
      img: "73b7c34c-4ca7-4c35-9952-d624daf2e74b.jpg",
      codBarra: "",
      productoId: producto6.id,
      unidadId: unidadCJ.id,
      variedadId: variedad34.id,
      presentacionId: presentacion54.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante224 = await Variante.create({
      codErp: "300000641",
      porcIva: 10,
      img: "88271eab-30da-4216-81f6-daac7088d3e2.jpg",
      codBarra: "",
      productoId: producto44.id,
      unidadId: unidadUN.id,
      variedadId: variedad90.id,
      presentacionId: presentacion64.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante223 = await Variante.create({
      codErp: "300000642",
      porcIva: 10,
      img: "449a9160-ecb1-4c78-8541-d05cb0483a35.jpg",
      codBarra: "",
      productoId: producto44.id,
      unidadId: unidadUN.id,
      variedadId: variedad91.id,
      presentacionId: presentacion64.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante222 = await Variante.create({
      codErp: "300000643",
      porcIva: 10,
      img: "cadf0bdc-432f-4f14-9e58-e3b4a583c21e.jpg",
      codBarra: "",
      productoId: producto44.id,
      unidadId: unidadUN.id,
      variedadId: variedad92.id,
      presentacionId: presentacion64.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante291 = await Variante.create({
      codErp: "300000644",
      porcIva: 10,
      img: "9f650b31-ac36-4470-988b-47638ef24425.jpg",
      codBarra: "",
      productoId: producto44.id,
      unidadId: unidadUN.id,
      variedadId: variedad90.id,
      presentacionId: presentacion73.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante290 = await Variante.create({
      codErp: "300000645",
      porcIva: 10,
      img: "144e764f-f668-4754-ad3d-f60b631c53f8.jpg",
      codBarra: "",
      productoId: producto44.id,
      unidadId: unidadUN.id,
      variedadId: variedad91.id,
      presentacionId: presentacion73.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante289 = await Variante.create({
      codErp: "300000646",
      porcIva: 10,
      img: "0fa476db-2cc5-4369-97e7-935faf908b9d.jpg",
      codBarra: "",
      productoId: producto44.id,
      unidadId: unidadUN.id,
      variedadId: variedad92.id,
      presentacionId: presentacion73.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante225 = await Variante.create({
      codErp: "300000652",
      porcIva: 10,
      img: "6d22f192-4a7b-4984-b06f-ddbb612f6775.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadUN.id,
      variedadId: variedad71.id,
      presentacionId: presentacion65.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante226 = await Variante.create({
      codErp: "300000653",
      porcIva: 10,
      img: "9edd4bc9-30ee-4b89-ae53-66c1aab81ed1.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadUN.id,
      variedadId: variedad43.id,
      presentacionId: presentacion65.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante227 = await Variante.create({
      codErp: "300000654",
      porcIva: 10,
      img: "7c30b6d9-822c-47cc-a4a1-aadfa34f0db2.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadUN.id,
      variedadId: variedad42.id,
      presentacionId: presentacion65.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante228 = await Variante.create({
      codErp: "300000655",
      porcIva: 10,
      img: "880fbf79-272e-43c6-9cbe-e593cb1359c7.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadUN.id,
      variedadId: variedad61.id,
      presentacionId: presentacion65.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante281 = await Variante.create({
      codErp: "300000656",
      porcIva: 10,
      img: "cd57da25-7d52-4e82-92e3-f0dffbb62fc8.jpg",
      codBarra: "",
      productoId: producto22.id,
      unidadId: unidadUN.id,
      variedadId: variedad75.id,
      presentacionId: presentacion8.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante209 = await Variante.create({
      codErp: "300000664",
      porcIva: 10,
      img: "ccec74b0-e81b-4f16-bbed-354b5b20653e.jpg",
      codBarra: "",
      productoId: producto36.id,
      unidadId: unidadUN.id,
      variedadId: variedad37.id,
      presentacionId: presentacion62.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante205 = await Variante.create({
      codErp: "300000665",
      porcIva: 10,
      img: "2f14cd9f-0723-40b8-840c-5c7b65283ff4.jpg",
      codBarra: "",
      productoId: producto36.id,
      unidadId: unidadUN.id,
      variedadId: variedad38.id,
      presentacionId: presentacion62.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante206 = await Variante.create({
      codErp: "300000666",
      porcIva: 10,
      img: "2460c510-1f13-47a6-bfb0-e88dcf4cdda0.jpg",
      codBarra: "",
      productoId: producto36.id,
      unidadId: unidadUN.id,
      variedadId: variedad9.id,
      presentacionId: presentacion62.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante208 = await Variante.create({
      codErp: "300000667",
      porcIva: 10,
      img: "a9c7ef78-9d7f-4de4-a9e6-3999834fbb3f.jpg",
      codBarra: "",
      productoId: producto36.id,
      unidadId: unidadUN.id,
      variedadId: variedad37.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante204 = await Variante.create({
      codErp: "300000668",
      porcIva: 10,
      img: "fa97833a-cb24-4fca-b266-8d2313a9c23c.jpg",
      codBarra: "",
      productoId: producto36.id,
      unidadId: unidadUN.id,
      variedadId: variedad38.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante207 = await Variante.create({
      codErp: "300000669",
      porcIva: 10,
      img: "92ab822c-f5a5-4d7c-81d6-5f410aacab7f.jpg",
      codBarra: "",
      productoId: producto36.id,
      unidadId: unidadUN.id,
      variedadId: variedad9.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante215 = await Variante.create({
      codErp: "300000688",
      porcIva: 10,
      img: "d451918a-5a85-4b68-8574-f82ad1c97c2d.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad88.id,
      presentacionId: presentacion41.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante211 = await Variante.create({
      codErp: "300000689",
      porcIva: 10,
      img: "ef721bf0-5dd9-409f-917f-5cc884424a69.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad85.id,
      presentacionId: presentacion41.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante275 = await Variante.create({
      codErp: "300000690",
      porcIva: 10,
      img: "8c412aa1-c7e2-4bf2-b4ba-3a44e83cc482.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad88.id,
      presentacionId: presentacion40.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante217 = await Variante.create({
      codErp: "300000691",
      porcIva: 10,
      img: "e3b20fe9-59ff-46d7-9853-a60dc6a7658f.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad85.id,
      presentacionId: presentacion40.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante265 = await Variante.create({
      codErp: "300000692",
      porcIva: 10,
      img: "5be5deb8-3665-43bf-af94-e8d612a4b509.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad82.id,
      presentacionId: presentacion27.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante264 = await Variante.create({
      codErp: "300000693",
      porcIva: 10,
      img: "4c5cc9a0-3226-4812-bd35-0152fad140cf.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad82.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante214 = await Variante.create({
      codErp: "300000701",
      porcIva: 10,
      img: "cc3c0474-6db3-430a-95e1-2160be2f6e07.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad87.id,
      presentacionId: presentacion41.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante213 = await Variante.create({
      codErp: "300000702",
      porcIva: 10,
      img: "6ba3ceeb-984d-4563-827f-acaca93ce77e.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad86.id,
      presentacionId: presentacion41.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante276 = await Variante.create({
      codErp: "300000703",
      porcIva: 10,
      img: "716e8076-f7d1-4ee2-965c-d4ff7118734a.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad87.id,
      presentacionId: presentacion40.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante218 = await Variante.create({
      codErp: "300000704",
      porcIva: 10,
      img: "240de82a-a34f-4c31-b639-cece193943a7.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad86.id,
      presentacionId: presentacion40.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante6 = await Variante.create({
      codErp: "300000705",
      porcIva: 10,
      img: "520d6549-e6a2-4df0-9415-1b71da32d8cc.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad83.id,
      presentacionId: presentacion27.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante12 = await Variante.create({
      codErp: "300000706",
      porcIva: 10,
      img: "0e3c9b6c-e147-45e7-a776-6f02140df9cd.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad81.id,
      presentacionId: presentacion27.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante10 = await Variante.create({
      codErp: "300000707",
      porcIva: 10,
      img: "ecf3daf1-c9a4-4048-8e8f-a62c04385666.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad79.id,
      presentacionId: presentacion27.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante8 = await Variante.create({
      codErp: "300000708",
      porcIva: 10,
      img: "91318b97-e5b2-49bd-8a83-2066ec3dd005.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad80.id,
      presentacionId: presentacion27.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante13 = await Variante.create({
      codErp: "300000709",
      porcIva: 10,
      img: "f8f1796d-ca24-48b5-8639-145a93f872fe.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad83.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante11 = await Variante.create({
      codErp: "300000710",
      porcIva: 10,
      img: "a0484854-84d3-4181-bda6-2548ceec89d7.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad81.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante9 = await Variante.create({
      codErp: "300000711",
      porcIva: 10,
      img: "97dcf8df-12f0-4be1-aa8d-38feec63100c.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad79.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante7 = await Variante.create({
      codErp: "300000712",
      porcIva: 10,
      img: "cec5968f-dfc5-492b-90c9-afb907509d48.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad80.id,
      presentacionId: presentacion26.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante101 = await Variante.create({
      codErp: "300000713",
      porcIva: 10,
      img: "00d38e1d-99ec-45de-a0dc-30af618982fa.jpg",
      codBarra: "",
      productoId: producto22.id,
      unidadId: unidadUN.id,
      variedadId: variedad75.id,
      presentacionId: presentacion3.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante102 = await Variante.create({
      codErp: "300000715",
      porcIva: 10,
      img: "4cdf5925-97fb-4b57-9d67-74279302c378.jpg",
      codBarra: "",
      productoId: producto22.id,
      unidadId: unidadUN.id,
      variedadId: variedad75.id,
      presentacionId: presentacion4.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante103 = await Variante.create({
      codErp: "300000716",
      porcIva: 10,
      img: "686d63ff-557b-49cc-b99d-3520d1eaf617.jpg",
      codBarra: "",
      productoId: producto22.id,
      unidadId: unidadUN.id,
      variedadId: variedad75.id,
      presentacionId: presentacion6.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante106 = await Variante.create({
      codErp: "300000719",
      porcIva: 10,
      img: "22f2c2a9-24c7-42e7-8fe3-1bd3742bbd9f.jpg",
      codBarra: "",
      productoId: producto23.id,
      unidadId: unidadUN.id,
      variedadId: variedad76.id,
      presentacionId: presentacion4.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante107 = await Variante.create({
      codErp: "300000720",
      porcIva: 10,
      img: "54ebcec7-41a8-4ee1-b04c-271ec7addaf0.jpg",
      codBarra: "",
      productoId: producto23.id,
      unidadId: unidadUN.id,
      variedadId: variedad76.id,
      presentacionId: presentacion6.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante105 = await Variante.create({
      codErp: "300000721",
      porcIva: 10,
      img: "3c48cd15-277b-4037-8c48-5155de2e036c.jpg",
      codBarra: "",
      productoId: producto23.id,
      unidadId: unidadUN.id,
      variedadId: variedad76.id,
      presentacionId: presentacion7.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante100 = await Variante.create({
      codErp: "300000723",
      porcIva: 10,
      img: "4176339b-514b-4ff6-bbd2-b24d65225700.jpg",
      codBarra: "",
      productoId: producto22.id,
      unidadId: unidadUN.id,
      variedadId: variedad75.id,
      presentacionId: presentacion7.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante221 = await Variante.create({
      codErp: "300000734",
      porcIva: 10,
      img: "1ac35713-1301-4dce-ab84-528b446e788e.jpg",
      codBarra: "",
      productoId: producto44.id,
      unidadId: unidadUN.id,
      variedadId: variedad90.id,
      presentacionId: presentacion45.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante220 = await Variante.create({
      codErp: "300000735",
      porcIva: 10,
      img: "08a1d341-fd56-455d-aae0-bf5ac116a8c9.jpg",
      codBarra: "",
      productoId: producto44.id,
      unidadId: unidadUN.id,
      variedadId: variedad91.id,
      presentacionId: presentacion45.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante219 = await Variante.create({
      codErp: "300000736",
      porcIva: 10,
      img: "11422df9-e132-4a25-8ee0-5e6bf2452f27.jpg",
      codBarra: "",
      productoId: producto44.id,
      unidadId: unidadUN.id,
      variedadId: variedad92.id,
      presentacionId: presentacion45.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante58 = await Variante.create({
      codErp: "300000741",
      porcIva: 10,
      img: "87264e2e-f0d1-4c52-9782-f65474c3e7b4.jpg",
      codBarra: "",
      productoId: producto12.id,
      unidadId: unidadCJ.id,
      variedadId: variedad73.id,
      presentacionId: presentacion39.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante233 = await Variante.create({
      codErp: "300000743",
      porcIva: 10,
      img: "107a3f8f-51c0-494d-a65e-864e3e80f70d.jpg",
      codBarra: "",
      productoId: producto15.id,
      unidadId: unidadUN.id,
      variedadId: variedad74.id,
      presentacionId: presentacion56.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante234 = await Variante.create({
      codErp: "300000744",
      porcIva: 10,
      img: "ed5f353b-06bf-403f-9376-3eda3df4985a.jpg",
      codBarra: "",
      productoId: producto15.id,
      unidadId: unidadUN.id,
      variedadId: variedad94.id,
      presentacionId: presentacion56.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante232 = await Variante.create({
      codErp: "300000745",
      porcIva: 10,
      img: "ff8e9940-e6bb-456f-a5d2-4630fa681fb6.jpg",
      codBarra: "",
      productoId: producto15.id,
      unidadId: unidadUN.id,
      variedadId: variedad74.id,
      presentacionId: presentacion33.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante229 = await Variante.create({
      codErp: "300000746",
      porcIva: 10,
      img: "524aeb07-0dd1-448b-bcd5-7821f0d0c857.jpg",
      codBarra: "",
      productoId: producto15.id,
      unidadId: unidadUN.id,
      variedadId: variedad94.id,
      presentacionId: presentacion66.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante212 = await Variante.create({
      codErp: "300000751",
      porcIva: 10,
      img: "8bd3cd51-d3eb-416b-922d-f92e5b21be7d.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad89.id,
      presentacionId: presentacion41.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante210 = await Variante.create({
      codErp: "300000752",
      porcIva: 10,
      img: "296c094f-fa3f-481d-ae96-5bcf9c066ab4.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad84.id,
      presentacionId: presentacion41.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante277 = await Variante.create({
      codErp: "300000754",
      porcIva: 10,
      img: "8938caf3-eb90-4820-b2da-fb836c882e52.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad89.id,
      presentacionId: presentacion40.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante216 = await Variante.create({
      codErp: "300000755",
      porcIva: 10,
      img: "beb13d53-765c-403c-abcb-834cd677256b.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad84.id,
      presentacionId: presentacion40.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante179 = await Variante.create({
      codErp: "300000756",
      porcIva: 10,
      img: "2e4bf7ae-ee3d-4724-99fd-b072ae0604d5.jpg",
      codBarra: "",
      productoId: producto12.id,
      unidadId: unidadCJ.id,
      variedadId: variedad34.id,
      presentacionId: presentacion39.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante263 = await Variante.create({
      codErp: "300000761",
      porcIva: 10,
      img: "2b5ca18d-021d-4b59-8d34-97d42a67589c.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad83.id,
      presentacionId: presentacion70.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante261 = await Variante.create({
      codErp: "300000763",
      porcIva: 10,
      img: "7c1683ad-e72a-4a2a-9a76-e141ad46758a.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad79.id,
      presentacionId: presentacion70.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante238 = await Variante.create({
      codErp: "300000765",
      porcIva: 10,
      img: "ad957e1f-74f5-4fe3-b180-01f3fb7232b9.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad85.id,
      presentacionId: presentacion38.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante239 = await Variante.create({
      codErp: "300000766",
      porcIva: 10,
      img: "751178e6-b6fe-449d-a290-a61cab138f20.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad87.id,
      presentacionId: presentacion38.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante240 = await Variante.create({
      codErp: "300000767",
      porcIva: 10,
      img: "f34cb947-13ef-4852-898b-2cfbfaf50d86.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad89.id,
      presentacionId: presentacion38.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante241 = await Variante.create({
      codErp: "300000768",
      porcIva: 10,
      img: "454ace67-c092-40fa-9f53-95e7a850b14c.jpg",
      codBarra: "",
      productoId: producto8.id,
      unidadId: unidadUN.id,
      variedadId: variedad84.id,
      presentacionId: presentacion38.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante262 = await Variante.create({
      codErp: "300000783",
      porcIva: 10,
      img: "59d10894-a8ef-4c00-9512-9a3de97409e9.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad82.id,
      presentacionId: presentacion70.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante230 = await Variante.create({
      codErp: "300000784",
      porcIva: 10,
      img: "2d1778c7-30f2-4dc2-a208-26baac10a784.jpg",
      codBarra: "",
      productoId: producto15.id,
      unidadId: unidadUN.id,
      variedadId: variedad74.id,
      presentacionId: presentacion67.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante231 = await Variante.create({
      codErp: "300000785",
      porcIva: 10,
      img: "524aeb07-0dd1-448b-bcd5-7821f0d0c857.jpg",
      codBarra: "",
      productoId: producto15.id,
      unidadId: unidadUN.id,
      variedadId: variedad94.id,
      presentacionId: presentacion67.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante258 = await Variante.create({
      codErp: "300000789",
      porcIva: 10,
      img: "d0ca8006-6e0e-4cad-b95f-717e8aee3ee0.jpg",
      codBarra: "",
      productoId: producto38.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion1.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante257 = await Variante.create({
      codErp: "300000791",
      porcIva: 10,
      img: "4dc9c637-4f97-4c91-8715-aa3be98e8eb6.jpg",
      codBarra: "",
      productoId: producto38.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion1.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante242 = await Variante.create({
      codErp: "300000796",
      porcIva: 10,
      img: "d633960b-6430-4ad0-ac83-cf1c37bfde72.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadUN.id,
      variedadId: variedad95.id,
      presentacionId: presentacion65.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante47 = await Variante.create({
      codErp: "300000797",
      porcIva: 10,
      img: "c877008a-7bcb-4c57-a636-bca31bbe2403.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadUN.id,
      variedadId: variedad71.id,
      presentacionId: presentacion43.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante45 = await Variante.create({
      codErp: "300000798",
      porcIva: 10,
      img: "c3753a0e-db3f-4de0-96b4-395b122b0cf2.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadUN.id,
      variedadId: variedad43.id,
      presentacionId: presentacion43.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante269 = await Variante.create({
      codErp: "300000799",
      porcIva: 10,
      img: "abdc6722-d17d-427e-8a2e-e2e3aa55780c.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadUN.id,
      variedadId: variedad42.id,
      presentacionId: presentacion43.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante51 = await Variante.create({
      codErp: "300000800",
      porcIva: 10,
      img: "41852d22-0cb2-4e81-a874-f94291ff925f.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadUN.id,
      variedadId: variedad61.id,
      presentacionId: presentacion43.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante243 = await Variante.create({
      codErp: "300000802",
      porcIva: 10,
      img: "be5018fc-5a63-4755-a027-8d5e2a39068e.jpg",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadUN.id,
      variedadId: variedad95.id,
      presentacionId: presentacion43.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante255 = await Variante.create({
      codErp: "300000803",
      porcIva: 10,
      img: "98a6c780-f350-4172-a14c-ae6ef243d042.jpg",
      codBarra: "",
      productoId: producto38.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion68.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante253 = await Variante.create({
      codErp: "300000804",
      porcIva: 10,
      img: "4f07f794-a6ad-4d02-8aca-f8961d772a12.jpg",
      codBarra: "",
      productoId: producto38.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion68.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante256 = await Variante.create({
      codErp: "300000806",
      porcIva: 10,
      img: "e6dfd1da-9524-4148-948b-abc38696def0.jpg",
      codBarra: "",
      productoId: producto38.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion69.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante268 = await Variante.create({
      codErp: "300000807",
      porcIva: 10,
      img: "5d6c96d6-5c92-4aaf-b3a0-92f638cb85e7.jpg",
      codBarra: "",
      productoId: producto38.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion69.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante267 = await Variante.create({
      codErp: "300000808",
      porcIva: 10,
      img: "0bf877d8-7868-4321-b8dd-9688c8f9756b.jpg",
      codBarra: "",
      productoId: producto38.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion37.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante266 = await Variante.create({
      codErp: "300000809",
      porcIva: 10,
      img: "226a41b0-4c3e-4749-b811-a3ad385a5622.jpg",
      codBarra: "",
      productoId: producto38.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion37.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante274 = await Variante.create({
      codErp: "300000824",
      porcIva: 10,
      img: "26e45b2d-edfa-4f89-9ae8-8cb48a793902.jpg",
      codBarra: "",
      productoId: producto45.id,
      unidadId: unidadUN.id,
      variedadId: variedad96.id,
      presentacionId: presentacion65.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante254 = await Variante.create({
      codErp: "300000909",
      porcIva: 10,
      img: "aa8af5bd-cd58-4fb4-8ae6-000d7fb04e18.jpg",
      codBarra: "",
      productoId: producto38.id,
      unidadId: unidadUN.id,
      variedadId: variedad5.id,
      presentacionId: presentacion67.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante252 = await Variante.create({
      codErp: "300000910",
      porcIva: 10,
      img: "f7d95e79-9021-43ac-a379-bcc92aa01263.jpg",
      codBarra: "",
      productoId: producto38.id,
      unidadId: unidadUN.id,
      variedadId: variedad56.id,
      presentacionId: presentacion67.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante292 = await Variante.create({
      codErp: "300000915",
      porcIva: 10,
      img: "c5688d20-ec27-43e7-9aab-f79e77a9c28d.jpg",
      codBarra: "",
      productoId: producto5.id,
      unidadId: unidadUN.id,
      variedadId: variedad37.id,
      presentacionId: presentacion61.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante283 = await Variante.create({
      codErp: "300001168",
      porcIva: 10,
      img: "",
      codBarra: "",
      productoId: producto9.id,
      unidadId: unidadUN.id,
      variedadId: variedad100.id,
      presentacionId: presentacion65.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante285 = await Variante.create({
      codErp: "300001195",
      porcIva: 10,
      img: "5405b2ad-8cdc-4361-9151-676ac30152c5.jpg",
      codBarra: "",
      productoId: producto49.id,
      unidadId: unidadUN.id,
      variedadId: variedad2.id,
      presentacionId: presentacion27.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante286 = await Variante.create({
      codErp: "300001197",
      porcIva: 10,
      img: "f068add9-94ad-44a7-ab9e-f1c0b293ba40.jpg",
      codBarra: "",
      productoId: producto49.id,
      unidadId: unidadUN.id,
      variedadId: variedad101.id,
      presentacionId: presentacion27.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante287 = await Variante.create({
      codErp: "300001199",
      porcIva: 10,
      img: "660bea70-7977-4019-a13b-323b292f53b8.jpg",
      codBarra: "",
      productoId: producto49.id,
      unidadId: unidadUN.id,
      variedadId: variedad102.id,
      presentacionId: presentacion27.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante288 = await Variante.create({
      codErp: "300001200",
      porcIva: 10,
      img: "30ed95b3-503c-4aa3-8829-8ddacea9333f.jpg",
      codBarra: "",
      productoId: producto49.id,
      unidadId: unidadUN.id,
      variedadId: variedad103.id,
      presentacionId: presentacion27.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante282 = await Variante.create({
      codErp: "300001225",
      porcIva: 10,
      img: "",
      codBarra: "",
      productoId: producto16.id,
      unidadId: unidadCJ.id,
      variedadId: variedad33.id,
      presentacionId: presentacion72.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante3 = await Variante.create({
      codErp: "500000001",
      porcIva: 10,
      img: "55e4fb9f-cd8e-4064-b2e6-caaf925a1aeb.jpg",
      codBarra: "",
      productoId: producto2.id,
      unidadId: unidadROL.id,
      variedadId: variedad52.id,
      presentacionId: presentacion51.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante4 = await Variante.create({
      codErp: "500000002",
      porcIva: 10,
      img: "6bf1251a-c5f4-44cd-a501-2f205a123570.jpg",
      codBarra: "",
      productoId: producto2.id,
      unidadId: unidadROL.id,
      variedadId: variedad52.id,
      presentacionId: presentacion52.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante5 = await Variante.create({
      codErp: "500000003",
      porcIva: 10,
      img: "fab85cb9-31f6-4e06-a625-c5bdff62e2d3.jpg",
      codBarra: "",
      productoId: producto2.id,
      unidadId: unidadROL.id,
      variedadId: variedad52.id,
      presentacionId: presentacion53.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante177 = await Variante.create({
      codErp: "500000004",
      porcIva: 10,
      img: "60c6b01e-ddbb-4713-a289-40ec10261d99.jpg",
      codBarra: "",
      productoId: producto2.id,
      unidadId: unidadROL.id,
      variedadId: variedad65.id,
      presentacionId: presentacion49.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante178 = await Variante.create({
      codErp: "500000005",
      porcIva: 10,
      img: "ffd83af7-c8be-4b65-b854-82f6df1d1aeb.jpg",
      codBarra: "",
      productoId: producto2.id,
      unidadId: unidadROL.id,
      variedadId: variedad65.id,
      presentacionId: presentacion50.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante157 = await Variante.create({
      codErp: "500000006",
      porcIva: 10,
      img: "fd3ff599-fe3d-4247-aa8e-a30bceb23d74.jpg",
      codBarra: "",
      productoId: producto28.id,
      unidadId: unidadUN.id,
      variedadId: variedad64.id,
      presentacionId: presentacion48.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante156 = await Variante.create({
      codErp: "500000007",
      porcIva: 10,
      img: "9b53cd27-d772-46d0-8637-2934e22ef025.jpg",
      codBarra: "",
      productoId: producto28.id,
      unidadId: unidadUN.id,
      variedadId: variedad63.id,
      presentacionId: presentacion48.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante270 = await Variante.create({
      codErp: "830000264",
      porcIva: 10,
      img: "",
      codBarra: "",
      productoId: producto39.id,
      unidadId: unidadUN.id,
      variedadId: variedad34.id,
      presentacionId: presentacion48.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante271 = await Variante.create({
      codErp: "830000266",
      porcIva: 10,
      img: "",
      codBarra: "",
      productoId: producto40.id,
      unidadId: unidadUN.id,
      variedadId: variedad34.id,
      presentacionId: presentacion48.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante272 = await Variante.create({
      codErp: "830000267",
      porcIva: 10,
      img: "",
      codBarra: "",
      productoId: producto41.id,
      unidadId: unidadUN.id,
      variedadId: variedad34.id,
      presentacionId: presentacion48.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante273 = await Variante.create({
      codErp: "830000268",
      porcIva: 10,
      img: "",
      codBarra: "",
      productoId: producto42.id,
      unidadId: unidadUN.id,
      variedadId: variedad34.id,
      presentacionId: presentacion48.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante278 = await Variante.create({
      codErp: "830000314",
      porcIva: 10,
      img: "51ca2cfb-ad1e-4e2e-b175-752ae17d84dc.jpg",
      codBarra: "",
      productoId: producto46.id,
      unidadId: unidadUN.id,
      variedadId: variedad99.id,
      presentacionId: presentacion71.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante279 = await Variante.create({
      codErp: "830000315",
      porcIva: 10,
      img: "8bc279ec-422f-4174-9bc5-58d0d7827926.jpg",
      codBarra: "",
      productoId: producto47.id,
      unidadId: unidadUN.id,
      variedadId: variedad97.id,
      presentacionId: presentacion71.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante280 = await Variante.create({
      codErp: "830000316",
      porcIva: 10,
      img: "0af655f8-707f-4d27-afc2-bf8c0aec1168.jpg",
      codBarra: "",
      productoId: producto48.id,
      unidadId: unidadUN.id,
      variedadId: variedad98.id,
      presentacionId: presentacion71.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante293 = await Variante.create({
      codErp: "830000351",
      porcIva: 10,
      img: "d2ecaa1c-346d-4962-92c0-00a3dca27b02.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad79.id,
      presentacionId: presentacion74.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante294 = await Variante.create({
      codErp: "830000352",
      porcIva: 10,
      img: "7ac1c7ab-16e5-48a2-aa83-ffe45d14854f.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad83.id,
      presentacionId: presentacion74.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante295 = await Variante.create({
      codErp: "830000355",
      porcIva: 10,
      img: "bc9122c9-2a2f-447f-a2a0-44e54fa23d95.jpg",
      codBarra: "",
      productoId: producto3.id,
      unidadId: unidadUN.id,
      variedadId: variedad82.id,
      presentacionId: presentacion74.id,
      activo: true,
      empresaId: empresa.id
    });
    const variante297 = await Variante.create({
      codErp: "830000437",
      porcIva: 10,
      img: "d2eabdde-24d7-46dd-ba07-8d15a7d765ef.jpg",
      codBarra: "",
      productoId: producto56.id,
      unidadId: unidadUN.id,
      variedadId: variedad104.id,
      presentacionId: presentacion71.id,
      activo: true,
      empresaId: empresa.id
    });
    const formaVenta = await FormaVenta.create({
      descripcion: "contado",
      activo: true,
      empresaId: empresa.id,
      color: "#45A137",
      predeterminado: true
    });

    const formaVenta2 = await FormaVenta.create({
      descripcion: "credito 15",
      activo: true,
      empresaId: empresa.id,
      color: "#45A137",
      predeterminado: false
    });
    const formaVenta3 = await FormaVenta.create({
      descripcion: "credito 20",
      activo: true,
      empresaId: empresa.id,
      color: "#45A137",
      predeterminado: false
    });
    const formaVenta4 = await FormaVenta.create({
      descripcion: "credito 25",
      activo: true,
      empresaId: empresa.id,
      color: "#45A137",
      predeterminado: false
    });
    const formaVenta5 = await FormaVenta.create({
      descripcion: "credito 30",
      activo: true,
      empresaId: empresa.id,
      color: "#45A137",
      predeterminado: false
    });

 
    const listaPrecio = await ListaPrecio.create({
      descripcion: "showroom",
      activo: true,
      empresaId: empresa.id,
      color: "#45A137",
      predeterminado: true
    });


    const listaPrecio2 = await ListaPrecio.create({
      descripcion: "empleados",
      activo: true,
      empresaId: empresa.id,
      color: "#45A137",
      predeterminado: false
    });

    const listaPrecio3 = await ListaPrecio.create({
      descripcion: "mayorista",
      activo: true,
      empresaId: empresa.id,
      color: "#45A137",
      predeterminado: false
    });

    console.log({
      listaPrecioId: listaPrecio.id,
      varianteId: variante3.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7900,
      activo: true,
      empresaId: empresa.id
    });
    const precio1 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante3.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7900,
      activo: true,
      empresaId: empresa.id
    });
    const precio2 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante4.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 10600,
      activo: true,
      empresaId: empresa.id
    });
    const precio3 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante5.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 17000,
      activo: true,
      empresaId: empresa.id
    });
    const precio4 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante6.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12300,
      activo: true,
      empresaId: empresa.id
    });
    const precio5 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante7.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 55800,
      activo: true,
      empresaId: empresa.id
    });
    const precio6 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante8.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12300,
      activo: true,
      empresaId: empresa.id
    });
    const precio7 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante9.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 55800,
      activo: true,
      empresaId: empresa.id
    });
    const precio8 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante10.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12300,
      activo: true,
      empresaId: empresa.id
    });
    const precio9 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante11.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 55800,
      activo: true,
      empresaId: empresa.id
    });
    const precio10 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante12.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12300,
      activo: true,
      empresaId: empresa.id
    });
    const precio11 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante13.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 55800,
      activo: true,
      empresaId: empresa.id
    });
    const precio12 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante14.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 57500,
      activo: true,
      empresaId: empresa.id
    });
    const precio13 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante15.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7700,
      activo: true,
      empresaId: empresa.id
    });
    const precio14 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante16.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 33500,
      activo: true,
      empresaId: empresa.id
    });
    const precio15 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante17.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3500,
      activo: true,
      empresaId: empresa.id
    });
    const precio16 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante18.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 33500,
      activo: true,
      empresaId: empresa.id
    });
    const precio17 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante19.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3500,
      activo: true,
      empresaId: empresa.id
    });
    const precio18 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante20.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 35950,
      activo: true,
      empresaId: empresa.id
    });
    const precio19 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante21.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3500,
      activo: true,
      empresaId: empresa.id
    });
    const precio20 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante22.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 17600,
      activo: true,
      empresaId: empresa.id
    });
    const precio21 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante23.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4550,
      activo: true,
      empresaId: empresa.id
    });
    const precio22 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante24.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 40500,
      activo: true,
      empresaId: empresa.id
    });
    const precio23 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante25.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 8000,
      activo: true,
      empresaId: empresa.id
    });
    const precio24 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante26.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 73500,
      activo: true,
      empresaId: empresa.id
    });
    const precio25 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante27.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 20550,
      activo: true,
      empresaId: empresa.id
    });
    const precio26 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante28.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5200,
      activo: true,
      empresaId: empresa.id
    });
    const precio27 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante29.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5200,
      activo: true,
      empresaId: empresa.id
    });
    const precio28 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante30.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5200,
      activo: true,
      empresaId: empresa.id
    });
    const precio29 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante31.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 2800,
      activo: true,
      empresaId: empresa.id
    });
    const precio30 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante32.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3800,
      activo: true,
      empresaId: empresa.id
    });
    const precio31 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante33.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 2800,
      activo: true,
      empresaId: empresa.id
    });
    const precio32 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante34.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12900,
      activo: true,
      empresaId: empresa.id
    });
    const precio33 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante35.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3800,
      activo: true,
      empresaId: empresa.id
    });
    const precio34 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante36.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 2800,
      activo: true,
      empresaId: empresa.id
    });
    const precio35 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante37.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12900,
      activo: true,
      empresaId: empresa.id
    });
    const precio36 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante38.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3800,
      activo: true,
      empresaId: empresa.id
    });
    const precio37 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante39.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 2800,
      activo: true,
      empresaId: empresa.id
    });
    const precio38 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante40.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 10200,
      activo: true,
      empresaId: empresa.id
    });
    const precio39 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante41.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 2800,
      activo: true,
      empresaId: empresa.id
    });
    const precio40 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante42.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3800,
      activo: true,
      empresaId: empresa.id
    });
    const precio41 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante43.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 2800,
      activo: true,
      empresaId: empresa.id
    });
    const precio42 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante44.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 14000,
      activo: true,
      empresaId: empresa.id
    });
    const precio43 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante45.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4750,
      activo: true,
      empresaId: empresa.id
    });
    const precio44 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante46.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 324500,
      activo: true,
      empresaId: empresa.id
    });
    const precio45 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante47.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4750,
      activo: true,
      empresaId: empresa.id
    });
    const precio46 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante48.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 324500,
      activo: true,
      empresaId: empresa.id
    });
    const precio47 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante49.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4400,
      activo: true,
      empresaId: empresa.id
    });
    const precio48 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante50.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 324500,
      activo: true,
      empresaId: empresa.id
    });
    const precio49 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante51.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4750,
      activo: true,
      empresaId: empresa.id
    });
    const precio50 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante53.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7650,
      activo: true,
      empresaId: empresa.id
    });
    const precio51 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante54.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7650,
      activo: true,
      empresaId: empresa.id
    });
    const precio52 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante55.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7650,
      activo: true,
      empresaId: empresa.id
    });
    const precio53 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante56.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 300000,
      activo: true,
      empresaId: empresa.id
    });
    const precio54 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante57.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 8650,
      activo: true,
      empresaId: empresa.id
    });
    const precio55 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante58.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 215000,
      activo: true,
      empresaId: empresa.id
    });
    const precio56 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante59.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 6900,
      activo: true,
      empresaId: empresa.id
    });
    const precio57 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante60.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 11650,
      activo: true,
      empresaId: empresa.id
    });
    const precio58 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante61.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 1600,
      activo: true,
      empresaId: empresa.id
    });
    const precio59 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante62.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 24050,
      activo: true,
      empresaId: empresa.id
    });
    const precio60 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante63.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 6700,
      activo: true,
      empresaId: empresa.id
    });
    const precio61 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante64.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 13500,
      activo: true,
      empresaId: empresa.id
    });
    const precio62 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante65.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 2900,
      activo: true,
      empresaId: empresa.id
    });
    const precio63 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante66.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 27100,
      activo: true,
      empresaId: empresa.id
    });
    const precio64 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante67.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 78000,
      activo: true,
      empresaId: empresa.id
    });
    const precio65 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante68.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 83500,
      activo: true,
      empresaId: empresa.id
    });
    const precio66 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante69.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 83500,
      activo: true,
      empresaId: empresa.id
    });
    const precio67 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante70.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 71000,
      activo: true,
      empresaId: empresa.id
    });
    const precio68 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante72.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 71000,
      activo: true,
      empresaId: empresa.id
    });
    const precio69 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante75.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3400,
      activo: true,
      empresaId: empresa.id
    });
    const precio70 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante76.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4900,
      activo: true,
      empresaId: empresa.id
    });
    const precio71 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante77.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 21000,
      activo: true,
      empresaId: empresa.id
    });
    const precio72 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante79.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 1800,
      activo: true,
      empresaId: empresa.id
    });
    const precio73 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante82.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 1800,
      activo: true,
      empresaId: empresa.id
    });
    const precio74 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante85.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5000,
      activo: true,
      empresaId: empresa.id
    });
    const precio75 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante86.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5000,
      activo: true,
      empresaId: empresa.id
    });
    const precio76 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante87.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5000,
      activo: true,
      empresaId: empresa.id
    });
    const precio77 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante88.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5000,
      activo: true,
      empresaId: empresa.id
    });
    const precio78 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante89.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 96000,
      activo: true,
      empresaId: empresa.id
    });
    const precio79 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante90.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 55200,
      activo: true,
      empresaId: empresa.id
    });
    const precio80 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante95.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 45000,
      activo: true,
      empresaId: empresa.id
    });
    const precio81 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante96.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 6200,
      activo: true,
      empresaId: empresa.id
    });
    const precio82 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante97.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 10400,
      activo: true,
      empresaId: empresa.id
    });
    const precio83 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante98.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const precio84 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante99.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 19100,
      activo: true,
      empresaId: empresa.id
    });
    const precio85 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante100.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 44800,
      activo: true,
      empresaId: empresa.id
    });
    const precio86 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante101.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5850,
      activo: true,
      empresaId: empresa.id
    });
    const precio87 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante102.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 10100,
      activo: true,
      empresaId: empresa.id
    });
    const precio88 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante103.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 18950,
      activo: true,
      empresaId: empresa.id
    });
    const precio89 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante104.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 141900,
      activo: true,
      empresaId: empresa.id
    });
    const precio90 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante105.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 32500,
      activo: true,
      empresaId: empresa.id
    });
    const precio91 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante106.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7700,
      activo: true,
      empresaId: empresa.id
    });
    const precio92 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante107.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 14000,
      activo: true,
      empresaId: empresa.id
    });
    const precio93 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante108.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 49600,
      activo: true,
      empresaId: empresa.id
    });
    const precio94 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante109.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 123000,
      activo: true,
      empresaId: empresa.id
    });
    const precio95 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante110.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 15700,
      activo: true,
      empresaId: empresa.id
    });
    const precio96 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante111.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 37700,
      activo: true,
      empresaId: empresa.id
    });
    const precio97 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante112.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5950,
      activo: true,
      empresaId: empresa.id
    });
    const precio98 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante113.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12850,
      activo: true,
      empresaId: empresa.id
    });
    const precio99 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante114.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 109500,
      activo: true,
      empresaId: empresa.id
    });
    const precio100 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante115.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 2800,
      activo: true,
      empresaId: empresa.id
    });
    const precio101 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante116.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 37700,
      activo: true,
      empresaId: empresa.id
    });
    const precio102 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante117.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5950,
      activo: true,
      empresaId: empresa.id
    });
    const precio103 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante118.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12850,
      activo: true,
      empresaId: empresa.id
    });
    const precio104 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante119.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 109500,
      activo: true,
      empresaId: empresa.id
    });
    const precio105 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante120.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 2800,
      activo: true,
      empresaId: empresa.id
    });
    const precio106 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante121.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 40500,
      activo: true,
      empresaId: empresa.id
    });
    const precio107 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante122.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 40500,
      activo: true,
      empresaId: empresa.id
    });
    const precio108 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante123.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 82600,
      activo: true,
      empresaId: empresa.id
    });
    const precio109 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante124.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12200,
      activo: true,
      empresaId: empresa.id
    });
    const precio110 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante125.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 49000,
      activo: true,
      empresaId: empresa.id
    });
    const precio111 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante126.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 82600,
      activo: true,
      empresaId: empresa.id
    });
    const precio112 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante127.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12200,
      activo: true,
      empresaId: empresa.id
    });
    const precio113 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante128.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 49000,
      activo: true,
      empresaId: empresa.id
    });
    const precio114 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante129.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 40500,
      activo: true,
      empresaId: empresa.id
    });
    const precio115 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante130.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 82600,
      activo: true,
      empresaId: empresa.id
    });
    const precio116 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante131.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12200,
      activo: true,
      empresaId: empresa.id
    });
    const precio117 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante132.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 49000,
      activo: true,
      empresaId: empresa.id
    });
    const precio118 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante134.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 26100,
      activo: true,
      empresaId: empresa.id
    });
    const precio119 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante135.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 33050,
      activo: true,
      empresaId: empresa.id
    });
    const precio120 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante136.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 53950,
      activo: true,
      empresaId: empresa.id
    });
    const precio121 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante137.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 9000,
      activo: true,
      empresaId: empresa.id
    });
    const precio122 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante138.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 9550,
      activo: true,
      empresaId: empresa.id
    });
    const precio123 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante139.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 49000,
      activo: true,
      empresaId: empresa.id
    });
    const precio124 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante140.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 17400,
      activo: true,
      empresaId: empresa.id
    });
    const precio125 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante142.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 26100,
      activo: true,
      empresaId: empresa.id
    });
    const precio126 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante143.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 33050,
      activo: true,
      empresaId: empresa.id
    });
    const precio127 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante144.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 53950,
      activo: true,
      empresaId: empresa.id
    });
    const precio128 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante145.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 9000,
      activo: true,
      empresaId: empresa.id
    });
    const precio129 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante146.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 9550,
      activo: true,
      empresaId: empresa.id
    });
    const precio130 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante147.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 17400,
      activo: true,
      empresaId: empresa.id
    });
    const precio131 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante149.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 26100,
      activo: true,
      empresaId: empresa.id
    });
    const precio132 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante150.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 33050,
      activo: true,
      empresaId: empresa.id
    });
    const precio133 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante151.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 53950,
      activo: true,
      empresaId: empresa.id
    });
    const precio134 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante152.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 9000,
      activo: true,
      empresaId: empresa.id
    });
    const precio135 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante153.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 9550,
      activo: true,
      empresaId: empresa.id
    });
    const precio136 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante154.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 49000,
      activo: true,
      empresaId: empresa.id
    });
    const precio137 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante155.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 17400,
      activo: true,
      empresaId: empresa.id
    });
    const precio138 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante156.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 10300,
      activo: true,
      empresaId: empresa.id
    });
    const precio139 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante157.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 8100,
      activo: true,
      empresaId: empresa.id
    });
    const precio140 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante158.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 168421,
      activo: true,
      empresaId: empresa.id
    });
    const precio141 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante172.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7050,
      activo: true,
      empresaId: empresa.id
    });
    const precio142 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante173.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 6900,
      activo: true,
      empresaId: empresa.id
    });
    const precio143 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante177.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 25900,
      activo: true,
      empresaId: empresa.id
    });
    const precio144 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante178.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 10000,
      activo: true,
      empresaId: empresa.id
    });
    const precio145 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante179.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 215000,
      activo: true,
      empresaId: empresa.id
    });
    const precio146 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante183.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 6200,
      activo: true,
      empresaId: empresa.id
    });
    const precio147 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante184.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 10400,
      activo: true,
      empresaId: empresa.id
    });
    const precio148 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante185.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 19100,
      activo: true,
      empresaId: empresa.id
    });
    const precio149 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante186.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 49000,
      activo: true,
      empresaId: empresa.id
    });
    const precio150 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante187.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 20000,
      activo: true,
      empresaId: empresa.id
    });
    const precio151 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante190.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 89000,
      activo: true,
      empresaId: empresa.id
    });
    const precio152 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante191.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 89000,
      activo: true,
      empresaId: empresa.id
    });
    const precio153 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante204.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 40600,
      activo: true,
      empresaId: empresa.id
    });
    const precio154 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante205.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4600,
      activo: true,
      empresaId: empresa.id
    });
    const precio155 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante206.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4600,
      activo: true,
      empresaId: empresa.id
    });
    const precio156 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante207.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 40600,
      activo: true,
      empresaId: empresa.id
    });
    const precio157 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante208.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 40600,
      activo: true,
      empresaId: empresa.id
    });
    const precio158 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante209.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4600,
      activo: true,
      empresaId: empresa.id
    });
    const precio159 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante210.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3750,
      activo: true,
      empresaId: empresa.id
    });
    const precio160 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante211.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3750,
      activo: true,
      empresaId: empresa.id
    });
    const precio161 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante212.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3750,
      activo: true,
      empresaId: empresa.id
    });
    const precio162 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante213.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3750,
      activo: true,
      empresaId: empresa.id
    });
    const precio163 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante214.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3750,
      activo: true,
      empresaId: empresa.id
    });
    const precio164 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante215.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3750,
      activo: true,
      empresaId: empresa.id
    });
    const precio165 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante216.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5100,
      activo: true,
      empresaId: empresa.id
    });
    const precio166 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante217.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5100,
      activo: true,
      empresaId: empresa.id
    });
    const precio167 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante218.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5100,
      activo: true,
      empresaId: empresa.id
    });
    const precio168 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante219.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5850,
      activo: true,
      empresaId: empresa.id
    });
    const precio169 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante220.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5850,
      activo: true,
      empresaId: empresa.id
    });
    const precio170 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante221.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5850,
      activo: true,
      empresaId: empresa.id
    });
    const precio171 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante222.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7000,
      activo: true,
      empresaId: empresa.id
    });
    const precio172 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante223.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7000,
      activo: true,
      empresaId: empresa.id
    });
    const precio173 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante224.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7000,
      activo: true,
      empresaId: empresa.id
    });
    const precio174 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante225.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5550,
      activo: true,
      empresaId: empresa.id
    });
    const precio175 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante226.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5550,
      activo: true,
      empresaId: empresa.id
    });
    const precio176 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante227.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5550,
      activo: true,
      empresaId: empresa.id
    });
    const precio177 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante228.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5550,
      activo: true,
      empresaId: empresa.id
    });
    const precio178 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante229.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 38950,
      activo: true,
      empresaId: empresa.id
    });
    const precio179 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante230.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 625,
      activo: true,
      empresaId: empresa.id
    });
    const precio180 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante231.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 625,
      activo: true,
      empresaId: empresa.id
    });
    const precio181 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante232.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 38950,
      activo: true,
      empresaId: empresa.id
    });
    const precio182 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante233.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 24100,
      activo: true,
      empresaId: empresa.id
    });
    const precio183 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante234.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 24100,
      activo: true,
      empresaId: empresa.id
    });
    const precio184 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante238.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 14000,
      activo: true,
      empresaId: empresa.id
    });
    const precio185 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante239.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 14000,
      activo: true,
      empresaId: empresa.id
    });
    const precio186 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante240.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 14000,
      activo: true,
      empresaId: empresa.id
    });
    const precio187 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante241.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 14000,
      activo: true,
      empresaId: empresa.id
    });
    const precio188 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante242.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5550,
      activo: true,
      empresaId: empresa.id
    });
    const precio189 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante243.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4750,
      activo: true,
      empresaId: empresa.id
    });
    const precio190 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante252.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4050,
      activo: true,
      empresaId: empresa.id
    });
    const precio191 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante253.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 8750,
      activo: true,
      empresaId: empresa.id
    });
    const precio192 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante254.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4050,
      activo: true,
      empresaId: empresa.id
    });
    const precio193 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante255.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 8750,
      activo: true,
      empresaId: empresa.id
    });
    const precio194 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante256.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 16600,
      activo: true,
      empresaId: empresa.id
    });
    const precio195 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante257.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 60800,
      activo: true,
      empresaId: empresa.id
    });
    const precio196 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante258.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 60800,
      activo: true,
      empresaId: empresa.id
    });
    const precio197 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante261.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7300,
      activo: true,
      empresaId: empresa.id
    });
    const precio198 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante262.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7300,
      activo: true,
      empresaId: empresa.id
    });
    const precio199 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante263.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7300,
      activo: true,
      empresaId: empresa.id
    });
    const precio200 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante264.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 55800,
      activo: true,
      empresaId: empresa.id
    });
    const precio201 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante265.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12300,
      activo: true,
      empresaId: empresa.id
    });
    const precio202 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante266.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 34900,
      activo: true,
      empresaId: empresa.id
    });
    const precio203 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante267.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 34900,
      activo: true,
      empresaId: empresa.id
    });
    const precio204 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante268.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 16600,
      activo: true,
      empresaId: empresa.id
    });
    const precio205 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante269.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 4750,
      activo: true,
      empresaId: empresa.id
    });
    const precio206 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante270.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 66200,
      activo: true,
      empresaId: empresa.id
    });
    const precio207 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante271.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 150000,
      activo: true,
      empresaId: empresa.id
    });
    const precio208 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante272.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 49700,
      activo: true,
      empresaId: empresa.id
    });
    const precio209 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante273.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 40000,
      activo: true,
      empresaId: empresa.id
    });
    const precio210 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante274.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5550,
      activo: true,
      empresaId: empresa.id
    });
    const precio211 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante275.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5100,
      activo: true,
      empresaId: empresa.id
    });
    const precio212 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante276.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5100,
      activo: true,
      empresaId: empresa.id
    });
    const precio213 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante277.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5100,
      activo: true,
      empresaId: empresa.id
    });
    const precio214 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante278.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 90300,
      activo: true,
      empresaId: empresa.id
    });
    const precio215 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante279.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 158450,
      activo: true,
      empresaId: empresa.id
    });
    const precio216 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante280.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 57200,
      activo: true,
      empresaId: empresa.id
    });
    const precio217 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante281.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 69300,
      activo: true,
      empresaId: empresa.id
    });
    const precio218 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante282.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 58750,
      activo: true,
      empresaId: empresa.id
    });
    const precio219 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante283.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 5550,
      activo: true,
      empresaId: empresa.id
    });
    const precio220 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante285.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12000,
      activo: true,
      empresaId: empresa.id
    });
    const precio221 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante286.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12000,
      activo: true,
      empresaId: empresa.id
    });
    const precio222 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante287.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12000,
      activo: true,
      empresaId: empresa.id
    });
    const precio223 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante288.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 12000,
      activo: true,
      empresaId: empresa.id
    });
    const precio224 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante289.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3800,
      activo: true,
      empresaId: empresa.id
    });
    const precio225 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante290.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3800,
      activo: true,
      empresaId: empresa.id
    });
    const precio226 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante291.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 3800,
      activo: true,
      empresaId: empresa.id
    });
    const precio227 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante292.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 7500,
      activo: true,
      empresaId: empresa.id
    });
    const precio228 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante293.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 14700,
      activo: true,
      empresaId: empresa.id
    });
    const precio229 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante294.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 14700,
      activo: true,
      empresaId: empresa.id
    });
    const precio230 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante295.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 14700,
      activo: true,
      empresaId: empresa.id
    });
    const precio231 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante297.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "9999-12-31",
      registro: "PRECIO",
      tipo: "IMPORTE",
      valor: 94150,
      activo: true,
      empresaId: empresa.id
    });

    const descuento02 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante4.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento03 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante5.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento01 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante3.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento04 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante6.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento05 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante7.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento06 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante8.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento07 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante9.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento08 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante10.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento09 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante11.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento10 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante12.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento11 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante13.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento12 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante14.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento13 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante15.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento14 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante16.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento15 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante17.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento16 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante18.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento17 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante19.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento18 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante20.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento19 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante21.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento20 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante22.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento21 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante23.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento22 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante24.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento23 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante25.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento24 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante26.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento25 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante27.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento26 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante28.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento27 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante29.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento28 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante30.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento29 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante31.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento30 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante32.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento31 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante33.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento32 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante34.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento33 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante35.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento34 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante36.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento35 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante37.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento36 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante38.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento37 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante39.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento38 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante40.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento39 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante41.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento40 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante42.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento41 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante43.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento42 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante44.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento43 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante45.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento44 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante46.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento45 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante47.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento46 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante48.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento47 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante49.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento48 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante50.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento49 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante51.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento50 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante53.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento51 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante54.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento52 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante55.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento53 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante56.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento54 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante57.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento55 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante58.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento56 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante59.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento57 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante60.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento58 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante61.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento59 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante62.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento60 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante63.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento61 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante64.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento62 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante65.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento63 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante66.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento64 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante67.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento65 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante68.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento66 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante69.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento67 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante70.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento68 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante72.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento69 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante75.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento70 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante76.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento71 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante77.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento72 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante79.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento73 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante82.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento74 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante85.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento75 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante86.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento76 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante87.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento77 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante88.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento78 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante89.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento79 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante90.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento80 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante95.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento81 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante96.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento82 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante97.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento83 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante98.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento84 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante99.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento85 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante100.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento86 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante101.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento87 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante102.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento88 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante103.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento89 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante104.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento90 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante105.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento91 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante106.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento92 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante107.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento93 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante108.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento94 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante109.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento95 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante110.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento96 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante111.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento97 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante112.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento98 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante113.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento99 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante114.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento100 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante115.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento101 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante116.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento102 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante117.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento103 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante118.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento104 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante119.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento105 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante120.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento106 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante121.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento107 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante122.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento108 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante123.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento109 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante124.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento110 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante125.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento111 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante126.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento112 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante127.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento113 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante128.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento114 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante129.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento115 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante130.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento116 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante131.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento117 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante132.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento118 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante134.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento119 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante135.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento120 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante136.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento121 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante137.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento122 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante138.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento123 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante139.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento124 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante140.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento125 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante142.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento126 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante143.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento127 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante144.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento128 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante145.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento129 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante146.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento130 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante147.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento131 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante149.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento132 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante150.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento133 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante151.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento134 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante152.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento135 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante153.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento136 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante154.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento137 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante155.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento138 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante156.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento139 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante157.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento140 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante158.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento141 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante172.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento142 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante173.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento143 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante177.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento144 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante178.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento145 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante179.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento146 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante183.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento147 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante184.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento148 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante185.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento149 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante186.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento150 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante187.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento151 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante190.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento152 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante191.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento153 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante204.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento154 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante205.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento155 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante206.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento156 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante207.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento157 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante208.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento158 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante209.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento159 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante210.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento160 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante211.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento161 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante212.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento162 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante213.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento163 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante214.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento164 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante215.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento165 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante216.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento166 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante217.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento167 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante218.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento168 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante219.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento169 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante220.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento170 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante221.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento171 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante222.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento172 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante223.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento173 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante224.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento174 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante225.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento175 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante226.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento176 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante227.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento177 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante228.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento178 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante229.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento179 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante230.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento180 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante231.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento181 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante232.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento182 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante233.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento183 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante234.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento184 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante238.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento185 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante239.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento186 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante240.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento187 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante241.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento188 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante242.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento189 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante243.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento190 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante252.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento191 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante253.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento192 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante254.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento193 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante255.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento194 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante256.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento195 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante257.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento196 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante258.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento197 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante261.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento198 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante262.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento199 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante263.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento200 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante264.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento201 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante265.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento202 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante266.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento203 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante267.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento204 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante268.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento205 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante269.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento206 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante270.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento207 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante271.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento208 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante272.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento209 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante273.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento210 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante274.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento211 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante275.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento212 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante276.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento213 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante277.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento214 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante278.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento215 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante279.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento216 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante280.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento217 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante281.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento218 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante282.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento219 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante283.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento220 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante285.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento221 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante286.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento222 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante287.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento223 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante288.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento224 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante289.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento225 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante290.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento226 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante291.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento227 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante292.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento228 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante293.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento229 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante294.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento230 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante295.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });
    const descuento231 = await Valoracion.create({
      listaPrecioId: listaPrecio.id,
      varianteId: variante297.id,
      cantDesde: 1,
      cantHasta: 999999999,
      fechaDesde: "2023-12-31",
      fechaHasta: "2024-01-30",
      registro: "DESCUENTO",
      tipo: "PRODUCTO",
      valor: 25,
      activo: true,
      empresaId: empresa.id
    });

    const cliente1 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "782718-0",
      razonSocial: "HERIBERTO GENES",
      telefono: "595981545540",
      direccion: "LAS MERCEDES ASUNCION",
      email: "titogenes@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente2 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "473301-0",
      razonSocial: "VERONICA JOSEFINA RUIZ LLANO",
      telefono: "99999999",
      direccion: "JULIO CORRE Nº 494",
      email: "veronicaruizllano@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente3 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "3772943-8",
      razonSocial: "ROMAN ACOSTA, EVER DANIEL",
      telefono: "595981330880",
      direccion: "CAPIATA, 5TA COMPAÑIA ",
      email: "romanmirian936@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente4 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "390437-7",
      razonSocial: "SR. MIGUEL ANGEL FLEITAS",
      telefono: "595228634326",
      direccion: "MOTEL FARAON, RUTA II, CAPIATA",
      email: "cecilia.fleitas1904@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente5 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "80046129-0",
      razonSocial: "SULTAN S.R.L.",
      telefono: "576777",
      direccion: "SAN LORENZO",
      email: "factura.electronica@cavallaro.com.py",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente6 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "347277-9",
      razonSocial: "LAVANDERIA ESPUMA",
      telefono: "595971259121",
      direccion: "SACRAMENTO C/ CAP. LOMBARDO",
      email: "gladysmonjagata@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente7 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "1399523-5",
      razonSocial: "SR. CLAUDE HURARD",
      telefono: "595983669444",
      direccion: "MALUTIN 482 C/ MOISES BERTONI. VILL",
      email: "claudehurard@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente8 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "365336-6",
      razonSocial: "MARTINEZ PERALTA, SALVADOR",
      telefono: "671212",
      direccion: "16 DE NOVIEMBRE 979 Y CNEL. PAMPLIE",
      email: "gerenciagrupotang@hotmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente9 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "1173713-1",
      razonSocial: "EDUARDO AQUINO",
      telefono: "595981292311",
      direccion: "TTE ALEJANDRO MONGES /NIEVE VERA Nº",
      email: "villalbarosa807@gmail.com.py",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente10 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "2865013-1",
      razonSocial: "MONGELOS ROMERO, EDITH ROCIO-MOTEL SIRENA",
      telefono: "9999999",
      direccion: "KM 26 RUTA 2 CERCA DEL MOTEL LUNA",
      email: "edyth.rocio@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente11 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "1771424-9",
      razonSocial: "RIVEROS CRISTALDO, PEDRO",
      telefono: "595982292029",
      direccion: "MANUEL ORTIZ GUERRERO C/ SANTANI",
      email: "pedroriveros1975@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente12 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "80050507-7",
      razonSocial: "LOS LAGOS RESORT HOTEL S.A",
      telefono: "595228629019",
      direccion: "CAPIATA KM 20 R1 AV PEDRO LOPEZ GOD",
      email: "administracion@loslagos.com.py",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente13 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "1050296-3",
      razonSocial: "COUCHONNAL RAMIREZ, MARICARMEN",
      telefono: "595981476976",
      direccion: "ELIGIO AYALA 1037 E/ BRASIL Y EEUU",
      email: "administracion@giuseppehostalandsuites.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente14 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "2999065-3",
      razonSocial: "DIEGO BENDLIN  (SPA)",
      telefono: "595981413996",
      direccion: "TTE 1RO RAMÓN GASPAR C/ CAP. ELÍAS",
      email: "milagros.rassl@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente15 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "2352135-0",
      razonSocial: "HENRY MARTINEZ",
      telefono: "595981831798",
      direccion: "GOIBURU E/ TAROMA Y NAZARETH",
      email: "tatinomanuel@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente16 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "80001449-9",
      razonSocial: "APARE PY",
      telefono: "595982101933",
      direccion: "SAAVEDRA 849 - ATYRA",
      email: "albertoatyra@hotmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente17 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "80039445-3",
      razonSocial: "O.A.G.E. S.R.L",
      telefono: "595971270271",
      direccion: "8 DE DICIEMBRE Y PLAYA - SAN BERNAR",
      email: "arroyitosuites@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente18 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "2204022-6",
      razonSocial: "MARIA DE LOS ANGELES MORINIGO",
      telefono: "595981282161",
      direccion: "CAP. LOMBARDO Nº 1467 C/ SACRAMENTO",
      email: "mariangelmorinigo@hotmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente19 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "4255760-7",
      razonSocial: "DESP. SAN FRANCISCO - FERMIN BRITEZ",
      telefono: "595986476449",
      direccion: "JAZMIN Y MBURUKUJA",
      email: "ferminbritez81@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente20 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "3212901-7",
      razonSocial: "ROJAS, RICHAR ALCIDES",
      telefono: "595 981 202 174",
      direccion: "TIO PERRO, PORVENIR SUR FRENTE A R 027",
      email: "fleitaslisis@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente21 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "929238-1",
      razonSocial: "MERCEDES CORONEL FLORES",
      telefono: "595981830403",
      direccion: "A METROS DE LOPEZ GODOY",
      email: "mercedescionel@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente22 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "1368388-8",
      razonSocial: "DESP. MERCERIA J Y C",
      telefono: "595971988605",
      direccion: "A UNA CDRA Y MEDIA DE VILLA BUENAVE",
      email: "nancyevasilguerorodriguez@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente23 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "696149-5",
      razonSocial: "JORGE NUÑEZ",
      telefono: "595984907370",
      direccion: "Julio Correa y Teniente Velázquez",
      email: "jorgenunezbritez1962@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente24 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "400735-2",
      razonSocial: "FRANCISCO SOLANO ACOSTA GONZALEZ",
      telefono: "99999999",
      direccion: "AV. STA TRINIDAD Nº 1431",
      email: "sagpi@hotmail.es",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente25 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "80021551-6",
      razonSocial: "IGRAFICA S.A",
      telefono: "670290",
      direccion: "FERNANDO DE LA MORA",
      email: "secretaria@igrafica.com.py",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente26 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "4638165-1",
      razonSocial: "HERMINIA AQUINO ZARACHO",
      telefono: "595983201238",
      direccion: "VETERINARIA CONSENTIDOS ",
      email: "johanazaracho9@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente27 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "2471633-2",
      razonSocial: "WALTER SPAINI",
      telefono: "595981242322",
      direccion: "PROFE ZUNILDA ASETTRINI Nº172 ESQ.S",
      email: "luzrossgonzalez@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente28 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "80087901-5",
      razonSocial: "CENTRO CRISTIANO FUENTE DE VIDA",
      telefono: "595982221503",
      direccion: "RUTA 1 KM 20",
      email: "factura.electronica@cavallaro.com.py",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente29 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "3638073-3",
      razonSocial: "DERLIS PANIAGUA",
      telefono: "595981218961",
      direccion: "TTE MOLAS C/ MANUEL ORTIZ G",
      email: "abg.derlisjavierpaniagua@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente30 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "80070476-2",
      razonSocial: "XIMEX SA",
      telefono: "595981480205",
      direccion: "MRA",
      email: "jose2014py@gmail.com",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: false
    });
    const cliente31 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "44444401-7",
      razonSocial: "CLIENTE MOSTRADOR",
      telefono: "999999",
      direccion: "CLIENTES VARIOS",
      email: "factura.electronica@cavallaro.com.py",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: true,
      propietario: false
    });
    const cliente32 = await Cliente.create({ listaPrecioId:listaPrecio.id,formaVentaId: formaVenta.id,
      puntos: 0,
      nroDocumento: "80003110-5",
      razonSocial: "CAVALLARO S.A.C.E.I.",
      telefono: "59521579717",
      direccion: "RUTA 1 MCAL. FRANCISCO S.LOPEZ KM.1",
      email: "factura.electronica@cavallaro.com.py",
      excentoIva: false,
      activo: true,
      empresaId: empresa.id,
      latitud: 0,
      longitud: 0,
      predeterminado: false,
      propietario: true
    });

 
    console.log("Registros creados exitosamente!");
  }
};

module.exports = { populateDB };
