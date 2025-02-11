const Venta = require("./venta.model");
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Evento= sequelize.define('Evento', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stacktrace: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  ventId: {
    type: DataTypes.BIGINT,
    allowNull: true,

  },
  rangoInutilizadoId: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  peticion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'eventos',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
 
Evento.belongsTo(Venta, {
    foreignKey: 'ventaId', 
    targetKey: 'id',
  });
  Evento.belongsTo(Rang, {
    foreignKey: 'rangoInutilizadoId', 
    targetKey: 'id',
  });
  
    module.exports = Evento;
  