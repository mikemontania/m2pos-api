const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');   
const Documento = require('./documento.model');
const Variante = require('./variante.model');

const DocumentoDetalle = sequelize.define('DocumentoDetalle', {
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
  varianteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
 
  cantidad: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  importePrecio: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  importeIva5: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  importeIva10: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  importeIvaExenta: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  porcIva: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  porcDescuento: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  importeDescuento: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  importeNeto: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  importeSubtotal: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  importeTotal: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  anticipo : {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false,
    defaultValue:0
  },
  totalKg: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  }, 
  tipoDescuento: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  ivaTipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue:1
  },
  ivaBase: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue:100
  },
}, {
  tableName: 'documentos_detalle',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});

DocumentoDetalle.belongsTo(Documento, {
  foreignKey: 'documentoId',
  targetKey: 'id',
}); 
DocumentoDetalle.belongsTo(Variante, {
  foreignKey: 'varianteId',
  as:'variante',
  targetKey: 'id',
});
 
module.exports = DocumentoDetalle;
