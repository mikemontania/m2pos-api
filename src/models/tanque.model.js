// models/tanque-fermentador.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');

const Tanque = sequelize.define('Tanque', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Código identificador del tanque'
  },
  letraLote: {
    type: DataTypes.STRING(2),
    allowNull: false,
    comment: 'Letra(s) que identifican el tanque en el número de lote (ej: L, LA, A)'
  },
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    set(value) {
      this.setDataValue('descripcion', value.toUpperCase());
    }
  },
  capacidadLitros: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Capacidad en litros del tanque'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
}, {
  tableName: 'tanques',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['empresa_id', 'codigo']
    },
    {
      unique: true,
      fields: ['empresa_id', 'letra_lote']
    }
  ]
});

Tanque.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});

module.exports = Tanque;