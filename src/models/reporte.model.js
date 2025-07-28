const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');

const Reporte = sequelize.define('Reporte', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reporte: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  query: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  parametros: {
    type: DataTypes.JSONB, // Guarda los parámetros en formato JSON
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
  createdBy: {
    type: DataTypes.STRING(100),
    field: 'created_by',
    allowNull: true
  }
}, {
  tableName: 'reportes',
  timestamps: false,
  underscored: true
});

Reporte.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id'
});

module.exports = Reporte;
