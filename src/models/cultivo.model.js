// models/cultivo.model.js
// ============================================
// 1. MODELO: Cultivo (Tipos de cultivo usado)
// ============================================
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 

const Cultivo = sequelize.define('Cultivo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Ej: 495, 499'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    set(value) {
      this.setDataValue('nombre', value.toUpperCase());
    },
  },
  descripcion: {
    type: DataTypes.TEXT,
    set(value) {
      this.setDataValue('descripcion', value.toUpperCase());
    },
    allowNull: true
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
  tableName: 'cultivos',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['empresa_id', 'codigo']
    }
  ]
});

Cultivo.belongsTo(Empresa, { foreignKey: 'empresaId' });
 
 
module.exports = Cultivo;