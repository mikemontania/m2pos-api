const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 

const Variedad = sequelize.define('Variedad', {
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
  color: {
    type: DataTypes.STRING(12),
    allowNull: false
  }, 
  activo: {
    type: DataTypes.BOOLEAN,
  defaultValue:true,
    allowNull: false
  },
 
}, {
  tableName: 'variedades',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Variedad.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
 
module.exports = Variedad;
