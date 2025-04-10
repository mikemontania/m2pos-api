const Documento = require("./documento.model");
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const ErrorDocumento = sequelize.define('ErrorDocumento', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    codigo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mensaje: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DocumentoId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      
    }
  }, {
    tableName: 'errores_documento',
    timestamps: false,
    underscored: true, // Convierte automáticamente a snake_case
    
  });
 
  ErrorDocumento.belongsTo(Documento, {
    foreignKey: 'documentoId', 
    targetKey: 'id',
  });
   
  
    module.exports = ErrorDocumento;
  