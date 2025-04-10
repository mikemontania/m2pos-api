const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');

const EnvioRespuesta = sequelize.define('EnvioRespuesta', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  respuesta: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  },
  stacktrace: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'envios_respuestas',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
module.exports = EnvioRespuesta;
  