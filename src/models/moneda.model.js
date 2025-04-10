const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig'); 

const Moneda  = sequelize.define('Moneda', {
 
  codigo: {
    type: DataTypes.STRING(5),
    primaryKey: true, 
    allowNull: false 
  }, 
  descripcion: {
    type: DataTypes.STRING(70),
    allowNull: false
  }, 
   
}, {
  tableName: 'monedas',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
 
 
module.exports = Moneda;
