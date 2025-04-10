const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');  
const Ciudad = require('./ciudad.model');

const Barrio  = sequelize.define('Barrio', {
  codigo: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    allowNull: false 
  }, 
  descripcion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },  
  codCiudad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'barrios',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Barrio.belongsTo(Ciudad, {
  foreignKey: 'codCiudad',
  targetKey: 'codigo',
});
 
module.exports = Barrio;
