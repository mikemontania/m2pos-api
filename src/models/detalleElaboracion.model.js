 // models/tanque-fermentador.model.js
const Variante = require('./variante.model');
const RegistroElaboracion = require('./RegistroElaboracion.model');
 const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');
const LoteEsencia = require('./loteEsencia.model');

// ============================================
// 6. MODELO: DetalleElaboracionVariante (Producción por variante)
// ============================================
const DetalleElaboracionVariante = sequelize.define('DetalleElaboracionVariante', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  registroElaboracionId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  varianteId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Variante del producto (Natural 380g, Coco 240g, etc)'
  },
  loteEsenciaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Solo si la variante usa esencia'
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Cantidad de unidades producidas'
  },
  fechaVencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Calculado según formato de lote'
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'detalles_elaboracion_variante',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['registro_elaboracion_id'] },
    { fields: ['variante_id'] }
  ]
});


DetalleElaboracionVariante.belongsTo(RegistroElaboracion, { 
  foreignKey: 'registroElaboracionId', 
  as: 'registroElaboracion' 
});
DetalleElaboracionVariante.belongsTo(Variante, { 
  foreignKey: 'varianteId', 
  as: 'variante' 
});
DetalleElaboracionVariante.belongsTo(LoteEsencia, { 
  foreignKey: 'loteEsenciaId', 
  as: 'loteEsencia' 
});
DetalleElaboracionVariante.belongsTo(Empresa, { foreignKey: 'empresaId' });

// Relaciones inversas
RegistroElaboracion.hasMany(DetalleElaboracionVariante, { 
  foreignKey: 'registroElaboracionId',
  as: 'detalles'
});


module.exports = DetalleElaboracionVariante;