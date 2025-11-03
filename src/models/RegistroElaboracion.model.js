// models/registroElaboracion.model.js
// ============================================
// 5. MODELO: RegistroElaboracion (Cabecera de producción diaria)
// ============================================
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');
const Usuario = require('./usuario.model'); 
const TanqueFermentador = require('./tanqueFermentador.model');
const Cultivo = require('./cultivo.model');

const RegistroElaboracion = sequelize.define('RegistroElaboracion', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  fechaElaboracion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Fecha en que se adiciona el cultivo'
  },
  numeroLoteProduccion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Lote generado según formato LDDMMAAANNX'
  },
  tanqueFermentadorId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  cultivoId: {  // ⭐ CAMBIO: Relación directa con Cultivo
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Tipo de cultivo utilizado'
  },
  numeroLoteCultivo: {  // ⭐ NUEVO: Campo texto
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Número de lote del cultivo (ej: 4434821414)'
  },
  fechaVencimientoCultivo: {  // ⭐ NUEVO
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Fecha de vencimiento del lote de cultivo'
  },
  cantidadLitros: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  horaCultivo: {
    type: DataTypes.TIME,
    allowNull: false
  },
  temperaturaCultivo: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    comment: 'Temperatura en °C (41 a 44°C)'
  },
  phMaduracion: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    comment: 'pH entre 4.7 y 4.8'
  },
  horaFiltrado: {
    type: DataTypes.TIME,
    allowNull: false
  },
  fechaEnvasado: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Fecha de envasado calculada'
  },
  realizadoPor: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Iniciales (ej: PG)'
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  finalizado: {  // ⭐ NUEVO: Control de edición
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si es true, el registro no se puede editar'
  },
  fechaFinalizacion: {  // ⭐ NUEVO
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Cuándo se finalizó el registro'
  },
  usuarioFinalizacionId: {  // ⭐ NUEVO
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Quién finalizó el registro'
  }
}, {
  tableName: 'registros_elaboracion',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['fecha_elaboracion', 'empresa_id'] },
    //{ fields: ['numero_lote_produccion'], unique: true },
    { fields: ['tanque_fermentador_id'] },
    { fields: ['finalizado'] }
  ]
});

// Relaciones
RegistroElaboracion.belongsTo(TanqueFermentador, { 
  foreignKey: 'tanqueFermentadorId', 
  as: 'tanque' 
});
RegistroElaboracion.belongsTo(Cultivo, { 
  foreignKey: 'cultivoId', 
  as: 'cultivo' 
});
RegistroElaboracion.belongsTo(Empresa, { foreignKey: 'empresaId' });
RegistroElaboracion.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
RegistroElaboracion.belongsTo(Usuario, { 
  foreignKey: 'usuarioFinalizacionId', 
  as: 'usuarioFinalizacion' 
});
module.exports = RegistroElaboracion;