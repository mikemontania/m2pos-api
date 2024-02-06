const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');   
const Variante = require('./variante.model');
const ListaPrecio = require('./listaPrecio.model');
const moment = require('moment');
const Cliente = require('./cliente.model');
const { REGISTRO, TIPO } = require('./tipos.enum');
const Sucursal = require('./sucursal.model');

const Valoracion = sequelize.define('Valoracion', {
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
  listaPrecioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  varianteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
  defaultValue:true,
    allowNull: false
  },
  cantDesde: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  cantHasta: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  
  fechaDesde: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('fechaDesde')).format('YYYY-MM-DD');
    }
  },
  fechaHasta: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('fechaHasta')).format('YYYY-MM-DD');
    }
  },
  valor: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  clienteId: {
    type: DataTypes.BIGINT,
    allowNull: true
  }, 
  registro: {
    type: REGISTRO,
    allowNull: false
  },
  tipo: {
    type: TIPO,
    allowNull: false
  },
  usuarioCreacion: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  usuarioModificacion: {
    type: DataTypes.BIGINT,
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
  }
 
}, {
  tableName: 'valoraciones',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Valoracion.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
Valoracion.belongsTo(Variante, {
  foreignKey: 'varianteId',
  targetKey: 'id',
  as:'variante'
});
Valoracion.belongsTo(ListaPrecio, {
  foreignKey: 'listaPrecioId',
  targetKey: 'id',
  as:'listaPrecio'
});
Valoracion.belongsTo(Sucursal, {
  foreignKey: 'sucursalId',
  targetKey: 'id',
  as:'sucursal'
});
Valoracion.belongsTo(Cliente, {
  foreignKey: 'clienteId',
  targetKey: 'id',
  as: 'cliente',
});
  
module.exports = Valoracion;
