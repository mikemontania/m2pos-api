const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');

const Sucursal = sequelize.define('Sucursal', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
 
}, {
  tableName: 'sucursales',
  timestamps: false,
  underscored: true
});

// Definir la relación con la tabla de empresas
Sucursal.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});

module.exports = Sucursal;
