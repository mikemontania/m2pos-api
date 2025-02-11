const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig'); 
const Venta = require('./venta.model');
const Envio = require('./envio.model');

const EnvioVenta = sequelize.define('EnvioVenta', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  ventaId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  envioId: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  tableName: 'envios_ventas',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});

EnvioVenta.belongsTo(Venta, {
  foreignKey: 'ventaId',
  targetKey: 'id',
});
EnvioVenta.belongsTo(Envio, {
  foreignKey: 'envioId', 
  targetKey: 'id',
});
 

  module.exports = EnvioVenta;
  