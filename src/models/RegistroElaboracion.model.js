// models/registroElaboracion.model.js
// ============================================
// 5. MODELO: RegistroElaboracion (Cabecera de producción diaria)
// ============================================
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');
const Usuario = require('./usuario.model');
const LoteCultivo = require('./loteCultivo.model');
const TanqueFermentador = require('./tanqueFermentador.model');

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
    allowNull: false,
    comment: 'Tanque del cual proviene esta producción (necesario para generar lote)'
  },
  loteCultivoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Lote de cultivo utilizado'
  },
  cantidadLitros: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Cantidad de litros producidos'
  },
  horaCultivo: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Hora en que se adiciona el cultivo'
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
    allowNull: false,
    comment: 'Hora de filtrado'
  },
  fechaEnvasado: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Fecha de envasado (calculada según código 01, 02, 03)'
  },
  realizadoPor: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Iniciales o nombre (PG = Paola Granco)'
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Usuario que registró'
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'registros_elaboracion',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['fecha_elaboracion', 'empresa_id'] },
    { fields: ['numero_lote_produccion'], unique: true },
    { fields: ['tanque_fermentador_id'] }
  ]
});

// Relaciones
RegistroElaboracion.belongsTo(TanqueFermentador, { 
  foreignKey: 'tanqueFermentadorId', 
  as: 'tanque' 
});

RegistroElaboracion.belongsTo(LoteCultivo, { 
  foreignKey: 'loteCultivoId', 
  as: 'loteCultivo' 
});

RegistroElaboracion.belongsTo(Empresa, { 
  foreignKey: 'empresaId' 
});

RegistroElaboracion.belongsTo(Usuario, { 
  foreignKey: 'usuarioId', 
  as: 'usuario' 
});

module.exports = RegistroElaboracion;