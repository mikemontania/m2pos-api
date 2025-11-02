// models/loteCultivo.model.js
// ============================================
// 2. MODELO: LoteCultivo (Lote específico de cultivo)
// ============================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 
const  Cultivo  = require('./cultivo.model');

const LoteCultivo = sequelize.define('LoteCultivo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cultivoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numeroLote: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Ej: 4434821414'
  },
  fechaVencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
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
  tableName: 'lotes_cultivo',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['numero_lote'], unique: true }
  ]
});
LoteCultivo.belongsTo(Cultivo, { foreignKey: 'cultivoId', as: 'cultivo' });
LoteCultivo.belongsTo(Empresa, { foreignKey: 'empresaId' });
module.exports = LoteCultivo;