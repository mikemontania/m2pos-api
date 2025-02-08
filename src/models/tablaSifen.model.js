const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');  

const TablaSifen  = sequelize.define('TablaSifen ', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },  
  codigo: {
    type: DataTypes.STRING(15),
    allowNull: false
  }, 
  tabla: {
    type: DataTypes.STRING(15),
    allowNull: false
  }, 
  descripcion: {
    type: DataTypes.STRING(300),
    allowNull: false
  }, 
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue:true,
    allowNull: false
  },
 
}, {
  tableName: 'tablas_sifen',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
 
 
module.exports = TablaSifen;
