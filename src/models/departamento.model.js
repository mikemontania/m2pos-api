const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig'); 

const Departamento  = sequelize.define('Departamento', {
 
  codigo: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    allowNull: false 
  }, 
  descripcion: {
    type: DataTypes.STRING(50),
    allowNull: false
  }, 
   
}, {
  tableName: 'departamentos',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
 
 
module.exports = Departamento;
