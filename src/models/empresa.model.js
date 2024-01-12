const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');

const Empresa = sequelize.define('Empresa', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  razonSocial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
 
  actividad1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  actividad2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  actividad3: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  ruc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  web: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'empresas',
  timestamps: false, // Puedes deshabilitar los campos de timestamp si no los necesitas
  underscored: true, // Convierte automáticamente a snake_case

});

module.exports = Empresa;
