const { DataTypes } = require('sequelize');

module.exports.REGISTRO = DataTypes.ENUM('PRECIO', 'DESCUENTO', 'PUNTO');
module.exports.TIPO = DataTypes.ENUM('PRODUCTO', 'CLIENTE', 'ESCALA', 'IMPORTE');
