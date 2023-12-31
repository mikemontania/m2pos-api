const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');   
const Variante = require('./variante.model');
const ListaPrecio = require('./listaPrecio.model');

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
  prodVarianteId: {
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
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaHasta: {
    type: DataTypes.DATE,
    allowNull: false
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
    allowNull: true
  },
  fechaModificacion: {
    type: DataTypes.DATE,
    allowNull: true
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
  foreignKey: 'prodVarianteId',
  targetKey: 'id',
});
Precio.belongsTo(ListaPrecio, {
  foreignKey: 'listaPrecioId',
  targetKey: 'id',
});
 
 
module.exports = Precio;
