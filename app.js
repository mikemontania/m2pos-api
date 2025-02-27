require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./dbconfig");
const { populateDB } = require("./dbinit");

const morgan = require("morgan"); // const { json } = require('express/lib/response');
const { ejecucionJobs } = require("./src/jobs/jobs");
//const { loggerPos } = require("./logger");
// Este es un comentario
// Crear el servidor de express
const app = express();
//middlewares
app.use(morgan("dev"));
app.use(express.json());
// Configurar CORS
app.use(cors());
//loggerPos();
// Base de datos
const dbSetup = async () => {
  await dbConnection(); //crea conexion
  await populateDB(); //inserta registros
};
dbSetup();
ejecucionJobs()//jobs
app.use("/M2POS/auditorias", require("./src/routes/auditoria-routes"));
app.use("/M2POS/auth", require("./src/routes/auth-routes"));
app.use("/M2POS/bancos", require("./src/routes/banco-routes"));
app.use("/M2POS/barrios", require("./src/routes/barrio-routes"));
app.use("/M2POS/certificados", require("./src/routes/certificado-routes"));
app.use("/M2POS/ciudades", require("./src/routes/ciudad-routes"));
app.use("/M2POS/constantes", require("./src/routes/constantes-routes"));
app.use("/M2POS/departamentos", require("./src/routes/departamento-routes"));
app.use("/M2POS/usuarios", require("./src/routes/usuario-routes"));
app.use("/M2POS/categorias", require("./src/routes/categoria-routes"));
app.use("/M2POS/presentaciones", require("./src/routes/presentacion-routes"));
app.use("/M2POS/clientes", require("./src/routes/cliente-routes"));
app.use("/M2POS/creditos", require("./src/routes/credito-routes"));
app.use("/M2POS/empresas", require("./src/routes/empresa-routes"));
app.use("/M2POS/forma-venta", require("./src/routes/formaVenta-routes"));
app.use("/M2POS/productos", require("./src/routes/producto-routes"));
app.use("/M2POS/valoraciones", require("./src/routes/valoracion.routes"));
app.use("/M2POS/variantes", require("./src/routes/variante-routes"));
app.use("/M2POS/variedades", require("./src/routes/variedad-routes"));
app.use("/M2POS/lista-precio", require("./src/routes/listaPrecio-routes"));
app.use("/M2POS/medio-pago", require("./src/routes/medioPago-routes"));
app.use("/M2POS/monedas", require("./src/routes/moneda-routes"));
app.use("/M2POS/ventas", require("./src/routes/venta-routes"));
app.use("/M2POS/ventas-xml", require("./src/routes/ventaXml-routes"));
app.use("/M2POS/marcas", require("./src/routes/marca-routes"));
app.use("/M2POS/subcategorias", require("./src/routes/subCategoria-routes"));
app.use("/M2POS/sifens", require("./src/routes/sifen-routes"));
app.use("/M2POS/sucursales", require("./src/routes/sucursal-routes"));
app.use("/M2POS/numeraciones", require("./src/routes/numeracion-routes"));
app.use("/M2POS/tablas-sifen", require("./src/routes/tablaSifen-routes"));
app.use("/M2POS/unidades", require("./src/routes/unidad-routes"));
app.use("/M2POS/uploads", require("./src/routes/uploads-routes"));
app.use("/M2POS/reportes", require("./src/routes/reporte-routes"));
app.listen(process.env.PORT, () =>
  console.log("Servidor corriendo en puerto " + process.env.PORT)
);
