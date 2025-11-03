 // models/tanque-fermentador.model.js
const Variante = require('./variante.model');
const RegistroElaboracion = require('./RegistroElaboracion.model');
 const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 

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
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fechaVencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Calculado según formato de lote'
  },
  // NUEVOS CAMPOS para esencias
  numeroLoteEsencia: {  // NUEVO
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Número de lote de la esencia (solo si aplica)'
  },
  fechaVencimientoEsencia: {  // NUEVO
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Fecha vto de esencia (solo Coco/Vainilla)'
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'detalles_elaboracion_variante',
  timestamps: true,
  underscored: true
});


DetalleElaboracionVariante.belongsTo(RegistroElaboracion, { 
  foreignKey: 'registroElaboracionId', 
  as: 'registroElaboracion' 
});
DetalleElaboracionVariante.belongsTo(Variante, { 
  foreignKey: 'varianteId', 
  as: 'variante' 
}); 
DetalleElaboracionVariante.belongsTo(Empresa, { foreignKey: 'empresaId' });

// Relaciones inversas
RegistroElaboracion.hasMany(DetalleElaboracionVariante, { 
  foreignKey: 'registroElaboracionId',
  as: 'detalles'
});


module.exports = DetalleElaboracionVariante;