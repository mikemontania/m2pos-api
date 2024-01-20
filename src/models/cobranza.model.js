const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');
const Usuario = require('./usuario.model'); 
const Sucursal = require('./sucursal.model');

const Cobranza = sequelize.define('Cobranza', {
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
  sucursalId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usuarioCreacionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fechaCobranza: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  importeAbonado: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  importeCobrado: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  saldo: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  anulado: {
    type: DataTypes.BOOLEAN,
    defaultValue:false,
    allowNull: false
  }, 
  usuarioAnulacionId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fechaAnulacion: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(40),
    allowNull: true
  }
}, {
  tableName: 'cobranzas',
  timestamps: false,
  underscored: true
});

Cobranza.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id'
});
Cobranza.belongsTo(Usuario, {
  foreignKey: 'usuarioCreacionId',
  targetKey: 'id'
});
Cobranza.belongsTo(Sucursal, {
  foreignKey: 'sucursalId',
  targetKey: 'id'
});

module.exports = Cobranza;
