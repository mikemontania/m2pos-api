const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
 
const Actividad = sequelize.define('Actividad', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING(100),
    allowNull: false
  }, 
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false
  }, 
  
}, {
  tableName: 'actividades',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
 
module.exports = Actividad;
