const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 

const SubCategoria = sequelize.define('SubCategoria', {
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
    type: DataTypes.STRING(40),
    allowNull: false
  }, 
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
 
}, {
  tableName: 'sub_categorias',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
SubCategoria.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
 
module.exports = SubCategoria;
