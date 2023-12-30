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

 
app.use('/api/login', require('./src/routes/auth-routes'));
app.use('/api/usuarios', require('./src/routes/usuario-routes'));
app.use('/api/categorias', require('./src/routes/categoria-routes'));
app.use('/api/presentaciones', require('./src/routes/presentacion-routes'));
app.use('/api/clientes', require('./src/routes/cliente-routes'));
app.use('/api/productos', require('./src/routes/producto-routes'));
app.use('/api/variantes', require('./src/routes/variante-routes'));
app.use('/api/lista-precios', require('./src/routes/listaPrecio-routes'));
app.use('/api/shop', require('./src/routes/shop-routes'));
app.use('/api/ventas', require('./src/routes/venta-routes'));
app.use('/api/marcas', require('./src/routes/marca-routes'));
app.use('/api/subcategorias', require('./src/routes/subCategoria-routes'));
app.use('/api/numeraciones', require('./src/routes/numeracion-routes'));
app.use('/api/unidades', require('./src/routes/unidad-routes'));  


app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
});