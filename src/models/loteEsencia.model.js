// models/loteEsencia.model.js
 // ============================================
// 4. MODELO: LoteEsencia
// ============================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 
const  Cultivo  = require('./cultivo.model');
const  Esencia  = require('./esencia.models');

const LoteEsencia = sequelize.define('LoteEsencia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  esenciaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numeroLote: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  fechaVencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Solo si la esencia requiere vencimiento'
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
  tableName: 'lotes_esencia',
  timestamps: true,
  underscored: true
});


LoteEsencia.belongsTo(Esencia, { foreignKey: 'esenciaId', as: 'esencia' });
LoteEsencia.belongsTo(Empresa, { foreignKey: 'empresaId' });
  
module.exports = LoteEsencia;