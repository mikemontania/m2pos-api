const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');   
const Venta = require('./venta.model');
const Variante = require('./variante.model');

const VentaDetalle = sequelize.define('VentaDetalle', {
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
  totalKg: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  }, 
  tipoDescuento: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
}, {
  tableName: 'ventas_detalle',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});

VentaDetalle.belongsTo(Venta, {
  foreignKey: 'ventaId',
  targetKey: 'id',
}); 
VentaDetalle.belongsTo(Variante, {
  foreignKey: 'varianteId',
  as:'variante',
  targetKey: 'id',
});
 
module.exports = VentaDetalle;
