const Bcryptjs = require("bcryptjs");
const Usuario = require("./src/models/usuario.model"); 
const Empresa = require("./src/models/empresa.model");
const Sucursal = require("./src/models/sucursal.model"); 
const Marca = require("./src/models/marca.model");
const Categoria = require("./src/models/categoria.model");
const SubCategoria = require("./src/models/subCategoria.model");
const Variedad = require("./src/models/variedad.model");
const Presentacion = require("./src/models/presentacion.model");
const Producto = require("./src/models/producto.model");
const ListaPrecio = require("./src/models/listaPrecio.model");
const Valoracion = require("./src/models/valoracion.model");
const CondicionPago = require("./src/models/condicionPago.model");
const Numeracion = require("./src/models/numeracion.model");
 
const { variantesStore } = require("./src/json/hugostore.json");
const { preciosStore } = require("./src/json/precioHugoStore.json");
const { clienteJson } = require("./src/json/clientesHugoStore.json");
const Actividad = require("./src/models/actividad.model");
const EmpresaActividad = require("./src/models/empresaActividad.model"); 
const Cobranza = require("./src/models/cobranza.model");
const CobranzaDetalle = require("./src/models/cobranzaDetalle.model");
const {
  generarCodigoSeguridad,
  generarCDC
} = require("./src/helpers/cdc-helper");
const {
  tipoContribuyente,
  tiposEmisiones
} = require("./src/constantes/Constante.constant");
const Cliente = require("./src/models/cliente.model");
const DocumentoDetalle = require("./src/models/documentoDetalle.model");
const Variante = require("./src/models/variante.model");
const Documento = require("./src/models/documento.model");
const { crearCreditoDesdeDocumento } = require("./src/controllers/credito-controller");
const Banco = require("./src/models/banco.model");
const MedioPago = require("./src/models/medioPago.model");
const Unidad = require("./src/models/unidad.model");

const migrateDB = async ( facturaId ,notaCreditoId) => { 
  if (process.env.DB_INIT == "true") {

 
   
    // Crear empresa
    const empresa8 = await Empresa.create({
      razonSocial: "HUGO GODOY",
      nombreFantasia: "COMPRA.YA ONLINE STORE",
      ruc: "3528762-4", // RUC de ejemplo
      simboloMoneda: "Gs",
      codMoneda: "PYG",
      idCSC: "1",
      csc: "ABCDF000000000000000000000000000",
      tipoContId: 2,
      tipoTransaId: 1,
      tipoImpId: 1,
      numCasa: 9999,
      codDepartamento: 12,
      codCiudad: 153,
      codBarrio: 3568,
      telefono: "+595984044028",
      email: "compraya.pystore@gmail.com",
      emailEnvio: "",
      web: null,
      img: "002ace53-5b3d-4881-b52f-eb39fccc82bd.jpg",
      modoSifen: "NO",
      envioKude: "NO"
    });

    // Crear actividades si no existen y asociarlas a la empresa
    const actividades2 = [
      {
        codigo: "62020",
        descripcion: "ACTIVIDADES DE CONSULTORÍA Y GESTIÓN DE SERVICIOS INFORMÁTICOS"
      },
      {
        codigo: "47529",
        descripcion: "COMERCIO AL POR MENOR DE OTROS ARTÍCULOS N.C.P."
      },
      {
        codigo: "47910",
        descripcion: "COMERCIO AL POR MENOR A TRAVÉS DE EMPRESAS DE COMERCIO POR CORREO O INTERNET"
      },
      {
        codigo: "68100",
        descripcion: "ACTIVIDADES INMOBILIARIAS REALIZADAS CON BIENES PROPIOS O ARRENDADOS"
      } 
    ];

    for (const actividadData of actividades2) {
      let actividad = await Actividad.create(actividadData);

      await EmpresaActividad.create({
        empresaId: empresa8.id,
        actividadId: actividad.id
      });
    }
   

    const sucursal12 = await Sucursal.create({
      descripcion: "Capiata",
      direccion: "SAN ANTONIO",
      cel: "+595984044028",
      empresaId: empresa8.id,
      email: "compraya.pystore@gmail.com"
    });
 
 
     const banco1 = await Banco.create({
       descripcion: "Banco Rio S.A.E.C.A",
       activo: true,
       empresaId: empresa8.id
     });
     const banco2 = await Banco.create({
       descripcion: "Solar Banco S.A.E.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco3 = await Banco.create({
       descripcion: "Banco Nacional de Fomento (BNF)",
       activo: true,
       empresaId: empresa8.id
     });
     const banco4 = await Banco.create({
       descripcion: "Interfisa Banco",
       activo: true,
       empresaId: empresa8.id
     });
     const banco5 = await Banco.create({
       descripcion: "Banco Atlas S.A.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco6 = await Banco.create({
       descripcion: "BANCOP S.A.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco7 = await Banco.create({
       descripcion: "Visión Banco S.A.E.C.A.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco8 = await Banco.create({
       descripcion: "Sudameris Bank S.A.E.C.A.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco9 = await Banco.create({
       descripcion: "Banco GNB - Paraguay",
       activo: true,
       empresaId: empresa8.id
     });
     const banco10 = await Banco.create({
       descripcion: "Banco Itaú Paraguay S.A.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco11 = await Banco.create({
       descripcion: "Banco Familiar S.A.E.C.A.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco12 = await Banco.create({
       descripcion: "Banco Continental S.A.E.C.A.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco13 = await Banco.create({
       descripcion: "Banco BASA",
       activo: true,
       empresaId: empresa8.id
     });
     const banco14 = await Banco.create({
       descripcion: "Finexpar S.A.E.C.A.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco15 = await Banco.create({
       descripcion: "FINANCIERA FIC S.A.E.C.A.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco16 = await Banco.create({
       descripcion: "Tu Financiera",
       activo: true,
       empresaId: empresa8.id
     });
     const banco17 = await Banco.create({
       descripcion: "Financiera Paraguayo Japonesa S.A.E.C.A",
       activo: true,
       empresaId: empresa8.id
     });
     const banco18 = await Banco.create({
       descripcion: "Financiera Ueno",
       activo: true,
       empresaId: empresa8.id
     });
     const banco19 = await Banco.create({
       descripcion: "Coop. del Sur Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco20 = await Banco.create({
       descripcion: "Coop. 21 de Setiembre",
       activo: true,
       empresaId: empresa8.id
     });
     const banco21 = await Banco.create({
       descripcion: "Coop. San Ignacio",
       activo: true,
       empresaId: empresa8.id
     });
     const banco22 = await Banco.create({
       descripcion: "Coop. Alemán Concordia Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco23 = await Banco.create({
       descripcion: "Coop. Mborayhu Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco24 = await Banco.create({
       descripcion: "Coop. Nazareth Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco25 = await Banco.create({
       descripcion: "Coop. Coodeñe Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco26 = await Banco.create({
       descripcion: "Coop. Ñemby Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco27 = await Banco.create({
       descripcion: "Coop. Judicial Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco28 = await Banco.create({
       descripcion: "Coop. Mercado 4 Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco29 = await Banco.create({
       descripcion: "Coop. Multiactiva 8 de Marzo Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco30 = await Banco.create({
       descripcion: "Coop. San Juan Bautista Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco31 = await Banco.create({
       descripcion: "Coop. Universitaria Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco32 = await Banco.create({
       descripcion: "Coop. Coomecipar Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco33 = await Banco.create({
       descripcion: "COPACONS Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco34 = await Banco.create({
       descripcion: "Coop. Medalla Milagrosa Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco35 = await Banco.create({
       descripcion: "Coop. Mburicao Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco36 = await Banco.create({
       descripcion: "Coop. Lambaré Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco37 = await Banco.create({
       descripcion: "C.O.F.A.N.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco38 = await Banco.create({
       descripcion: "Coop. Chortitzer Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco39 = await Banco.create({
       descripcion: "Coop. Neuland Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco40 = await Banco.create({
       descripcion: "Coop. Raúl Peña Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco41 = await Banco.create({
       descripcion: "Coop. Naranjal Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco42 = await Banco.create({
       descripcion: "Coop. Colonias Unidas Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
     const banco43 = await Banco.create({
       descripcion: "Coop. Fernheim Ltda.",
       activo: true,
       empresaId: empresa8.id
     });
 
     const medioPago1 = await MedioPago.create({
       descripcion: "EFECTIVO",
       normal: true,
       activo: true,
       predeterminado: true,
       empresaId: empresa8.id,
       esCheque: false,
       tieneBanco: false,
       tieneRef: false,
       tieneTipo: false,
       esObsequio: false
     });
     const medioPago2 = await MedioPago.create({
       descripcion: "TARJETA",
       normal: true,
       activo: true,
       empresaId: empresa8.id,
       esCheque: false,
       tieneBanco: false,
       tieneRef: true,
       tieneTipo: false,
       esObsequio: false
     });
     const medioPago3 = await MedioPago.create({
       descripcion: "VALE EMPLEADOS",
       normal: true,
       activo: true,
       empresaId: empresa8.id,
       esCheque: false,
       tieneBanco: false,
       tieneRef: false,
       tieneTipo: false,
       esObsequio: false
     });
     const medioPago4 = await MedioPago.create({
       descripcion: "RETENCION",
       normal: true,
       activo: true,
       empresaId: empresa8.id,
       esCheque: false,
       tieneBanco: false,
       tieneRef: true,
       tieneTipo: false,
       esObsequio: false
     });
     const medioPago5 = await MedioPago.create({
       descripcion: "CHEQUE DIA",
       normal: true,
       activo: true,
       empresaId: empresa8.id,
       esCheque: true,
       tieneBanco: true,
       tieneRef: true,
       tieneTipo: false,
       esObsequio: false
     });
     const medioPago6 = await MedioPago.create({
       descripcion: "CHEQUE DIFERIDO",
       normal: true,
       activo: true,
       empresaId: empresa8.id,
       esCheque: true,
       tieneBanco: true,
       tieneRef: true,
       tieneTipo: false,
       esObsequio: false
     });
     const medioPago7 = await MedioPago.create({
       descripcion: "TRANSFERENCIA",
       normal: true,
       activo: true,
       empresaId: empresa8.id,
       esCheque: false,
       tieneBanco: false,
       tieneRef: true,
       tieneTipo: false,
       esObsequio: false
     });
     const medioPago8 = await MedioPago.create({
       descripcion: "BANCARD QR",
       normal: true,
       activo: true,
       empresaId: empresa8.id,
       esCheque: false,
       tieneBanco: false,
       tieneRef: true,
       tieneTipo: false,
       esObsequio: false
     });
     const medioPago9 = await MedioPago.create({
       descripcion: "OBSEQUIO",
       activo: true,
       empresaId: empresa8.id,
       esCheque: false,
       tieneBanco: false,
       tieneRef: false,
       tieneTipo: false,
       normal: false,
       esObsequio: true
     });
 
     const medioPago10 = await MedioPago.create({
       descripcion: "NOTA CREDITO",
       activo: true,
       empresaId: empresa8.id,
       esCheque: false,
       tieneBanco: false,
       tieneRef: false,
       tieneTipo: false,
       esObsequio: false,
       normal: false,
       esNotaCredito: true
     });

    const numeracion4 = await Numeracion.create({
      empresaId: empresa8.id,
      sucursalId: sucursal12.id,
      inicioTimbrado: "2025-01-29",
      finTimbrado: "2026-01-31",
      itide: facturaId,
      numeroInicio: 1,
      numeroFin: 6000,
      serie: "001-002",
      timbrado: "17788861",
      ultimoNumero: 0,
      tipoComprobante: "FACTURA",
      tipoImpresion: "FACTURA",
      activo: true
    });
    const numeracion5 = await Numeracion.create({
      empresaId: empresa8.id,
      sucursalId: sucursal12.id,
      inicioTimbrado: "2025-01-29",
      finTimbrado: "2026-01-31",
      itide: notaCreditoId,
      numeroInicio: 1,
      numeroFin: 6000,
      serie: "001-002",
      timbrado: "17788861",
      ultimoNumero: 0,
      tipoComprobante: "FACTURA",
      tipoImpresion: "FACTURA",
      activo: true
    });

    // Crear usuario asociado a la empresa y sucursal
    const salt = Bcryptjs.genSaltSync();
    const userEmpresa2 = await Usuario.create({
      empresaId: empresa8.id,
      sucursalId: sucursal12.id,
      numPrefId: numeracion4.id,
      numNcPrefId: numeracion5.id,
      username: "hugo.godoy@compraya.com.py",
      usuario: "Hugo Godoy",
      password: Bcryptjs.hashSync("123456", salt),
      img: "491c8bd8-7343-4cac-99ff-d0bb0e70d1e8.jpg",
      rol: "admin", // Puedes ajustar el rol según tus necesidades
      intentos: 0,
      activo: true,
      bloqueado: false
    });

    const vendedorCapiata =await Usuario.create({
      empresaId: empresa8.id,
      sucursalId: sucursal12.id,
      numPrefId: numeracion4.id,
      numNcPrefId: numeracion5.id,
      username: "supervisor@mobile.com.py",
      usuario: "Supervisor",
      password: Bcryptjs.hashSync("123456", salt),
      img: "491c8bd8-7343-4cac-99ff-d0bb0e70d1e8.jpg",
      rol: "admin", // Puedes ajustar el rol según tus necesidades
      intentos: 0,
      activo: true,
      bloqueado: false
    });
     const unidadUN = await Unidad.create({
       code: "UN",
       descripcion: "Unidad",
       empresaId: empresa8.id,
       activo: true
     });
    const categoria99 = await Categoria.create({
      descripcion: "categoria",
      activo: true,
      empresaId: empresa8.id
    });

    const subCategoria99 = await SubCategoria.create({
      descripcion: "subcategoria",
      categoriaId: categoria99.id,
      activo: true,
      empresaId: empresa8.id
    });
 

    const marca0000 = await Marca.create({
      descripcion: "HG",
      activo: true,
      empresaId: empresa8.id
    });
     
     // Filtrar productos, presentaciones y variedades en paralelo
    const [productosJson, presentacionesJson, variedadesJson] = await Promise.all([
      Promise.resolve(variantesStore.filter((item, index, self) =>
        index === self.findIndex(t => t.productoId === item.productoId && t.producto === item.producto)
      )),

      Promise.resolve(variantesStore.filter((item, index, self) =>
        index === self.findIndex(t => t.presentacionId === item.presentacionId && t.presentacion === item.presentacion)
      )),

      Promise.resolve(variantesStore.filter((item, index, self) =>
        index === self.findIndex(t => t.variedadId === item.variedadId && t.variedad === item.variedad)
      ))
    ]);

    // Crear productos en paralelo y almacenar en un objeto con id como clave
    let productos = {}; 
    for (const producto of productosJson) { 
        productos[producto.productoId] = await Producto.create({
        nombre: producto.producto,
        descripcion: producto.producto,
        categoriaId: categoria99.id,
        subCategoriaId: subCategoria99.id,
        marcaId: marca0000.id,
        activo: true,
        empresaId: empresa8.id
      });  
    }
// Crear presentaciones en paralelo y almacenar en un objeto con id como clave
let presentaciones = {}; 
for (const presentacion of presentacionesJson) { 
  presentaciones[presentacion.presentacionId] = await Presentacion.create({ 
  descripcion: presentacion.presentacion,
  activo: true,
  size: 0,
  empresaId: empresa8.id
});  
}


// Crear variedades en paralelo y almacenar en un objeto con id como clave
let variedades = {}; 
for (const variedad of variedadesJson) { 
  variedades[variedad.variedadId] = await Variedad.create({
    activo: true,
    empresaId: empresa8.id,
    color: "#258f00",
    descripcion: variedad.variedad
  });
}

let variantes = {};
  for (const variante of variantesStore) { 
    variantes[variante.id] = await Variante.create({
      codErp: variante.erp,
      porcIva: +variante.iva,
      img:variante.imagen,
      codBarra: '00000000',
      productoId: productos[variante.productoId].id,
      unidadId: unidadUN.id,
      variedadId:  variedades[variante.variedadId].id,
      presentacionId: presentaciones[variante.presentacionId].id,
      activo: true,
      empresaId: empresa8.id
    });
   
}

    const condicionPago100 = await CondicionPago.create({
      descripcion: "contado",
      dias: 0,
      activo: true,
      empresaId: empresa8.id,
      color: "#45A137",
      predeterminado: true
    });

    const condicionPago101 = await CondicionPago.create({
      descripcion: "credito 8",
      dias: 8,
      activo: true,
      empresaId: empresa8.id,
      color: "#45A137",
      predeterminado: false
    });
    const condicionPago102 = await CondicionPago.create({
      descripcion: "credito 30",
      dias: 30,
      activo: true,
      empresaId: empresa8.id,
      color: "#45A137",
      predeterminado: false
    });

    const listaPrecio100 = await ListaPrecio.create({
      descripcion: "LISTA DE PRECIO 1",
      activo: true,
      empresaId: empresa8.id,
      color: "#45A137",
      predeterminado: true
    });
   
    const precios = await Promise.all(preciosStore.map(async (precio) => {  
        return Valoracion.create({
          listaPrecioId: listaPrecio100.id,
          varianteId: variantes[precio.cod_producto].id,
          cantDesde: precio.cant_desde,
          cantHasta: precio.cant_hasta,
          fechaDesde: precio.fecha_desde,
          fechaHasta: precio.fecha_hasta,
          registro: "PRECIO",
          tipo: "IMPORTE",
          valor: precio.precio,
          activo: true,
          empresaId: empresa8.id
        });
      
    }));
           let clientes ={}
        for (const c of clienteJson){  
   
          console.log(c)
            clientes[c.codCliente] = await Cliente.create({
            listaPrecioId: listaPrecio100.id,
            codigoPais: c.codigopais,
            condicionPagoId: condicionPago100.id,
            puntos: 0,
            naturalezaReceptor: 1,
            nroDocumento: c.nrodocumento,
            razonSocial: c.razonsocial,
            telefono:c.telefono,
            direccion: c.direccion,
            email: c.email,
            tipoOperacionId: 1,
            tipoContribuyente: 2,
            excentoIva: false,
            activo: true,
            empresaId: empresa8.id,
            latitud: c.latitud,
            longitud: c.longitud,
            predeterminado: c.predeterminado,
            propietario: c.propietario
          });
    
        }

     
      

  
  }
};

module.exports = { migrateDB };
