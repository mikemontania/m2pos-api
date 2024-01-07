require ('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./dbconfig');
const { populateDB } = require('./dbinit');
const morgan = require('morgan');
 // const { json } = require('express/lib/response');

// Crear el servidor de express
const app = express();
//middlewares
app.use( morgan('dev'));
app.use( express.json());
// Configurar CORS
app.use(cors()); 


// Base de datos
const dbSetup = async ()=>{
    //crea conexion
    await dbConnection();
    //inserta registros
    await populateDB();
}
dbSetup();

 
app.use('/M2POS/auth', require('./src/routes/auth-routes'));
app.use('/M2POS/usuarios', require('./src/routes/usuario-routes'));
app.use('/M2POS/categorias', require('./src/routes/categoria-routes'));
app.use('/M2POS/presentaciones', require('./src/routes/presentacion-routes'));
app.use('/M2POS/clientes', require('./src/routes/cliente-routes'));
app.use('/M2POS/productos', require('./src/routes/producto-routes'));
app.use('/M2POS/valoraciones', require('./src/routes/valoracion.routes'));
app.use('/M2POS/variantes', require('./src/routes/variante-routes'));
app.use('/M2POS/lista-precios', require('./src/routes/listaPrecio-routes'));
app.use('/M2POS/ventas', require('./src/routes/venta-routes'));
app.use('/M2POS/marcas', require('./src/routes/marca-routes'));
app.use('/M2POS/subcategorias', require('./src/routes/subCategoria-routes'));
app.use('/M2POS/numeraciones', require('./src/routes/numeracion-routes'));
app.use('/M2POS/unidades', require('./src/routes/unidad-routes'));  
app.use('/M2POS/uploads', require('./src/routes/uploads-routes'));  

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
});