const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');
const moment = require('moment');

const RangoInutilizado = sequelize.define('RangoInutilizado', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  establecimiento: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fechaHoraIngreso: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return moment(this.getDataValue('fechaHoraIngreso')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  motivo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  puntoExpedicion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rangoDesde: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  rangoHasta: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  timbrado: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  tipoDocumento: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  numeroserie: {
    type: DataTypes.STRING(2),
    allowNull: true
  }
}, {
  tableName: 'rangos_inutilizados',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
RangoInutilizado.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
module.exports = RangoInutilizado;
