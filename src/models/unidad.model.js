const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 

const Unidad = sequelize.define('Unidad', {
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
  code: {
    type: DataTypes.STRING(5),
    allowNull: false
  }, 
  descripcion: {
    type: DataTypes.STRING(20),
    allowNull: false
  }, 
  activo: {
    type: DataTypes.BOOLEAN,
  defaultValue:true,
    allowNull: false
  },
 
}, {
  tableName: 'unidades',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Unidad.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
 
module.exports = Unidad;
