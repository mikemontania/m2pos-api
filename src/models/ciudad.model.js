const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig'); 
const Departamento = require('./departamento.model');

const Ciudad  = sequelize.define('Ciudad', {
  codigo: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    allowNull: false 
  }, 
  descripcion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },  
  codDepartamento: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'ciudades',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Ciudad.belongsTo(Departamento, {
  foreignKey: 'codDepartamento',
  targetKey: 'codigo',
});
 
module.exports = Ciudad;
