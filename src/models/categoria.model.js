const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 

const Categoria = sequelize.define('Categoria', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }, 
  descripcion: {
    type: DataTypes.STRING(20),
    allowNull: false
  }, 
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
 
}, {
  tableName: 'categorias',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Categoria.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
 
module.exports = Categoria;
