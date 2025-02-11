const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');
const EnvioRespuesta = require('./envioRespuesta.model');
const moment = require('moment');

const Envio = sequelize.define('Envio', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  numeroLote: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  reintentar: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue:'0000'
  },
  obs: {
    type: DataTypes.STRING(200),
    allowNull: false    ,
    defaultValue:''
  },
  respuestaId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  respuestaConsultaId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  empresaId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  fechaHoraEnvio: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return moment(this.getDataValue('fechaHoraEnvio')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}, {
  tableName: 'envios',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Envio.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});

Envio.belongsTo(EnvioRespuesta, {
  foreignKey: 'respuestaConsultaId',
  targetKey: 'id',
});
Envio.belongsTo(EnvioRespuesta, {
  foreignKey: 'respuestaId',
  targetKey: 'id',
});


module.exports = Envio;
