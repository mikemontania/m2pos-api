const Venta = require("./venta.model");
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const ErrorVenta = sequelize.define('ErrorVenta', {
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
    VentaId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      
    }
  }, {
    tableName: 'errores_venta',
    timestamps: false,
    underscored: true, // Convierte automáticamente a snake_case
    
  });
 
  ErrorVenta.belongsTo(Venta, {
    foreignKey: 'ventaId', 
    targetKey: 'id',
  });
   
  
    module.exports = ErrorVenta;
  