const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');   
const Venta = require('./venta.model');
const Variante = require('./variante.model');

const VentaXml = sequelize.define('VentaXml', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  ventaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  xml: {
    type: DataTypes.TEXT('long'), // Almacena el XML como texto largo
    allowNull: false,
  },
  fechaFirma: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'ventas_xml',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});

VentaXml.belongsTo(Venta, {
  foreignKey: 'ventaId',
  targetKey: 'id',
}); 
VentaXml.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  as:'empresa',
  targetKey: 'id',
});
 
module.exports = VentaXml;
