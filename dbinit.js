 
const Departamento = require("./src/models/departamento.model");
const Ciudad = require("./src/models/ciudad.model");
const Barrio = require("./src/models/barrio.model"); 
const TablaSifen = require("./src/models/tablaSifen.model"); 
const { departamentos } = require("./src/json/departamentos.json"); 
const { ciudades } = require("./src/json/ciudades.json");
const { barrios } = require("./src/json/barrios.json");
const { monedas } = require("./src/json/monedas.json"); 
const Moneda = require("./src/models/moneda.model"); 
const { migrateDB } = require("./migrate");

const populateDB = async () => {
  console.log("populateDB");
  if (process.env.DB_INIT == "true"  ) {
    console.log("Inicializando registros en DB!");

    if (departamentos && departamentos.length > 0) {
      await Departamento.bulkCreate(departamentos, { ignoreDuplicates: true });
    }

    if (ciudades && ciudades.length > 0) {
      await Ciudad.bulkCreate(ciudades, { ignoreDuplicates: true });
    }

    if (barrios && barrios.length > 0) {
      await Barrio.bulkCreate(barrios, { ignoreDuplicates: true });
    }
    if (monedas && monedas.length > 0) {
      await Moneda.bulkCreate(monedas, { ignoreDuplicates: true });
    }

    const iTiDE1 = await TablaSifen.create({
      codigo: "1",
      descripcion: "Factura electrónica",
      tabla: "iTiDE"
    });
    const iTiDE2 = await TablaSifen.create({
      codigo: "8",
      descripcion: "Comprobante de retención electrónico",
      tabla: "iTiDE"
    });
    const iTiDE3 = await TablaSifen.create({
      codigo: "2",
      descripcion: "Factura electrónica de exportación",
      tabla: "iTiDE"
    });
    const iTiDE4 = await TablaSifen.create({
      codigo: "3",
      descripcion: "Factura electrónica de importación",
      tabla: "iTiDE"
    });
    const iTiDE5 = await TablaSifen.create({
      codigo: "4",
      descripcion: "Autofactura electrónica",
      tabla: "iTiDE"
    });
    const iTiDE6 = await TablaSifen.create({
      codigo: "5",
      descripcion: "Nota de crédito electrónica",
      tabla: "iTiDE"
    });
    const iTiDE7 = await TablaSifen.create({
      codigo: "6",
      descripcion: "Nota de débito electrónica",
      tabla: "iTiDE"
    });
    const iTiDE8 = await TablaSifen.create({
      codigo: "7",
      descripcion: "Nota de remisión electrónica",
      tabla: "iTiDE"
    });

    const iTipTra1 = await TablaSifen.create({
      codigo: "1",
      descripcion: "Venta de mercadería",
      tabla: "iTipTra"
    });
    const iTipTra2 = await TablaSifen.create({
      codigo: "2",
      descripcion: "Prestación de servicios",
      tabla: "iTipTra"
    });
    const iTipTra3 = await TablaSifen.create({
      codigo: "3",
      descripcion: "Mixto (Venta de mercadería y servicios)",
      tabla: "iTipTra"
    });
    const iTipTra4 = await TablaSifen.create({
      codigo: "4",
      descripcion: "Documento de activo fijo",
      tabla: "iTipTra"
    });
    const iTipTra5 = await TablaSifen.create({
      codigo: "5",
      descripcion: "Documento de divisas",
      tabla: "iTipTra"
    });
    const iTipTra6 = await TablaSifen.create({
      codigo: "6",
      descripcion: "Compra de divisas",
      tabla: "iTipTra"
    });
    const iTipTra7 = await TablaSifen.create({
      codigo: "7",
      descripcion: "Promoción o entrega de muestras",
      tabla: "iTipTra"
    });
    const iTipTra8 = await TablaSifen.create({
      codigo: "8",
      descripcion: "Donación",
      tabla: "iTipTra"
    });
    const iTipTra9 = await TablaSifen.create({
      codigo: "9",
      descripcion: "Anticipo",
      tabla: "iTipTra"
    });
    const iTipTra10 = await TablaSifen.create({
      codigo: "10",
      descripcion: "Compra de productos",
      tabla: "iTipTra"
    });
    const iTipTra11 = await TablaSifen.create({
      codigo: "11",
      descripcion: "Compra de servicios",
      tabla: "iTipTra"
    });
    const iTipTra12 = await TablaSifen.create({
      codigo: "12",
      descripcion: "Documento de crédito fiscal",
      tabla: "iTipTra"
    });
    const iTipTra13 = await TablaSifen.create({
      codigo: "13",
      descripcion: "Muestras médicas",
      tabla: "iTipTra"
    });

    const iTimp1 = await TablaSifen.create({
      codigo: "1",
      descripcion: "IVA",
      tabla: "iTImp"
    });
    const iTimp2 = await TablaSifen.create({
      codigo: "2",
      descripcion: "ISC",
      tabla: "iTImp"
    });
    const iTimp3 = await TablaSifen.create({
      codigo: "3",
      descripcion: "Renta",
      tabla: "iTImp"
    });
    const iTimp4 = await TablaSifen.create({
      codigo: "4",
      descripcion: "Ninguno",
      tabla: "iTImp"
    });
    const iTimp5 = await TablaSifen.create({
      codigo: "5",
      descripcion: "IVA - Renta",
      tabla: "iTImp"
    });

    const iTipCont1 = await TablaSifen.create({
      codigo: "1",
      descripcion: "Persona Física",
      tabla: "iTipCont"
    });
    const iTipCont2 = await TablaSifen.create({
      codigo: "2",
      descripcion: "Persona Jurídica",
      tabla: "iTipCont"
    });

    const cDepEmi = await TablaSifen.create({
      codigo: "12",
      descripcion: "CENTRAL",
      tabla: "cDepEmi"
    });
    const cDisEmi = await TablaSifen.create({
      codigo: "153",
      descripcion: "CAPIATA",
      tabla: "cDisEmi"
    });
    const cCiuEmi = await TablaSifen.create({
      codigo: "3568",
      descripcion: "CAPIATA",
      tabla: "cCiuEmi"
    });

    const iNatRec1 = await TablaSifen.create({
      codigo: "1",
      descripcion: "contribuyente",
      tabla: "iNatRec"
    });
    const iNatRec2 = await TablaSifen.create({
      codigo: "2",
      descripcion: "no contribuyente",
      tabla: "iNatRec"
    });

    const iTiOpe1 = await TablaSifen.create({
      codigo: "1",
      descripcion: "B2B",
      tabla: "iTiOpe"
    });
    const iTiOpe2 = await TablaSifen.create({
      codigo: "2",
      descripcion: "B2C",
      tabla: "iTiOpe"
    });
    const iTiOpe3 = await TablaSifen.create({
      codigo: "3",
      descripcion: "B2G",
      tabla: "iTiOpe"
    });
    const iTiOpe4 = await TablaSifen.create({
      codigo: "4",
      descripcion: "B2F",
      tabla: "iTiOpe"
    });

    const iTiContRec1 = await TablaSifen.create({
      codigo: "1",
      descripcion: "Persona Física",
      tabla: "iTiContRec"
    });
    const iTiContRec2 = await TablaSifen.create({
      codigo: "2",
      descripcion: "Persona Jurídica",
      tabla: "iTiContRec"
    });

    const iIndPres2 = await TablaSifen.create({
      codigo: "1",
      descripcion: "Operación presencial",
      tabla: "iIndPres"
    });
    const iIndPres3 = await TablaSifen.create({
      codigo: "2",
      descripcion: "Operación electrónica",
      tabla: "iIndPres"
    });
    const iIndPres1 = await TablaSifen.create({
      codigo: "3",
      descripcion: "Operación telemarketing",
      tabla: "iIndPres"
    });
    const iIndPres4 = await TablaSifen.create({
      codigo: "4",
      descripcion: "Documento a domicilio",
      tabla: "iIndPres"
    });
    const iIndPres5 = await TablaSifen.create({
      codigo: "5",
      descripcion: "Operación bancaria",
      tabla: "iIndPres"
    });
    const iIndPres6 = await TablaSifen.create({
      codigo: "6",
      descripcion: "Operación cíclica",
      tabla: "iIndPres"
    });
    const iIndPres8 = await TablaSifen.create({
      codigo: "9",
      descripcion: "Otro",
      tabla: "iIndPres"
    });
 
    migrateDB(1,6)
  }
};

module.exports = { populateDB };
