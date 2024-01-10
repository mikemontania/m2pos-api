const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Banco = require('./banco.model');
const Cobranza = require('./cobranza.model');
const MedioPago = require('./medioPago.model');
const TipoMedioPago = require('./tipoMedioPago.model'); // Assuming you have a "tipoMedioPago" model

const CobranzaDetalle = sequelize.define('CobranzaDetalle', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  fechaEmision: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  fechaVencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  importeAbonado: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  importeCobrado: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  nroCuenta: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  nroRef: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  saldo: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  bancoId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cobranzaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  medioPagoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'cobranzas_detalle',
  timestamps: false,
  underscored: true
});

CobranzaDetalle.belongsTo(Banco, {
  foreignKey: 'bancoId',
  targetKey: 'id'
});
CobranzaDetalle.belongsTo(Cobranza, {
  foreignKey: 'cobranzaId',
  targetKey: 'codCobranza'
});
CobranzaDetalle.belongsTo(MedioPago, {
  foreignKey: 'medioPagoId',
  targetKey: 'id'
});
 

module.exports = CobranzaDetalle;
