const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');   
const Documento = require('./documento.model'); 
const moment = require('moment');

const DocumentoXml = sequelize.define('DocumentoXml', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  documentoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  xml: {
    type: DataTypes.BLOB('long'), // Usa BLOB para datos binarios grandes
    allowNull: false,
  },

  estado: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },  
   fechaCreacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return moment(this.getDataValue('fechaCreacion')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
}, {
  tableName: 'documentos_xml',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});

DocumentoXml.belongsTo(Documento, {
  foreignKey: 'documentoId',
  targetKey: 'id',
}); 
DocumentoXml.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  as:'empresa',
  targetKey: 'id',
});
 
module.exports = DocumentoXml;
