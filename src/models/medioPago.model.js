const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Usuario = require('./usuario.model');
const moment = require('moment');
const Empresa = require('./empresa.model');

const MedioPago = sequelize.define('MedioPago', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }, 
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  esCheque: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  tieneBanco: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  tieneRef: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  tieneTipo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  esObsequio: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  usuarioCreacionId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  usuarioModificacionId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  fechaModificacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
}, {
  tableName: 'medio_pago',
  timestamps: false,
  underscored: true
});
MedioPago.belongsTo(Empresa, {
    foreignKey: 'empresaId',
    targetKey: 'id'
  });
MedioPago.belongsTo(Usuario, {
  foreignKey: 'usuarioCreacionId',
  targetKey: 'id'
});
MedioPago.belongsTo(Usuario, {
  foreignKey: 'usuarioModificacionId',
  targetKey: 'id'
});

module.exports = MedioPago;
