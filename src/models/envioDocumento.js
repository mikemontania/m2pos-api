const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig'); 
const Documento = require('./documento.model');
const Envio = require('./envio.model');

const EnvioDocumento = sequelize.define('EnvioDocumento', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  documentoId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  envioId: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  tableName: 'envios_documentos',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});

EnvioDocumento.belongsTo(Documento, {
  foreignKey: 'documentoId',
  targetKey: 'id',
});
EnvioDocumento.belongsTo(Envio, {
  foreignKey: 'envioId', 
  targetKey: 'id',
});
 

  module.exports = EnvioDocumento;
  