const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');
const Sucursal = require('./sucursal.model');
const moment = require("moment");

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
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('inicioTimbrado')).format('YYYY-MM-DD');
    }
  },

  finTimbrado: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('finTimbrado')).format('YYYY-MM-DD');
    }
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
    defaultValue:true,
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
