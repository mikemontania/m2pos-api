const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');
const Sucursal = require('./sucursal.model');

const Numeracion = sequelize.define('Numeracion', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sucursalId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  
  inicioTimbrado: {
    type: DataTypes.DATE,
    allowNull: false
  },

  finTimbrado: {
    type: DataTypes.DATE,
    allowNull: false
  },
  numeroInicio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numeroFin: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
 
  serie: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  timbrado: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  tipoTomprobante: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ultimoNumero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
   
  tipoImpresion: {
    type: DataTypes.STRING(20),
    allowNull: false
  },

  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
 
}, {
  tableName: 'numeraciones',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Numeracion.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
Numeracion.belongsTo(Sucursal, {
  foreignKey: 'sucursalId',
  targetKey: 'id',
});
module.exports = Numeracion;
