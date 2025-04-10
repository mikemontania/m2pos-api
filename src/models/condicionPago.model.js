const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 

const CondicionPago = sequelize.define('CondicionPago', {
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
  dias: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(12),
    allowNull: false
  }, 
  predeterminado: {
    type: DataTypes.BOOLEAN,
    defaultValue:false,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue:true,
    allowNull: false
  }, 
}, {
  tableName: 'condiciones_pago',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
CondicionPago.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
 
module.exports = CondicionPago;
