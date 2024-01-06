const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');   
const Variante = require('./variante.model');
const ListaPrecio = require('./listaPrecio.model');
const moment = require('moment');

const Precio = sequelize.define('Precio', {
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
    allowNull: false
  },
  cantDesde: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantHasta: {
    type: DataTypes.INTEGER,
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
  precio: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  codCliente: {
    type: DataTypes.BIGINT,
    allowNull: true
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
  tableName: 'precios',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Precio.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
Precio.belongsTo(Variante, {
  foreignKey: 'varianteId',
  targetKey: 'id',
});
Precio.belongsTo(ListaPrecio, {
  foreignKey: 'listaPrecioId',
  targetKey: 'id',
});
 
 
module.exports = Precio;
