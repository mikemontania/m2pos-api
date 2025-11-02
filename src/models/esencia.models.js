


// models/esencia.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');
const Esencia = sequelize.define('Esencia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Ej: Coco, Vainilla, Natural (sin esencia)'
  },
  requiereVencimiento: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Natural no requiere, otros sí'
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'esencias',
  timestamps: true,
  underscored: true
});

Esencia.belongsTo(Empresa, { foreignKey: 'empresaId' });
module.exports = Esencia;