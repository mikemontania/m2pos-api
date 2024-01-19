const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');
const Producto = require('./producto.model');
const Presentacion = require('./presentacion.model');
const Variedad = require('./variedad.model');
const Unidad = require('./unidad.model');

const Variante = sequelize.define('Variante', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  codBarra: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  codErp: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  porcIva: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  presentacionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  variedadId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  unidadId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }, 
  activo: {
    type: DataTypes.BOOLEAN,
  defaultValue:true,
    allowNull: false
  },
 
}, {
  tableName: 'variantes',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Variante.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
Variante.belongsTo(Producto, {
  foreignKey: 'productoId',
  targetKey: 'id',
  as: 'producto',
});
 
Variante.belongsTo(Presentacion, {
  foreignKey: 'presentacionId',
  targetKey: 'id',as: 'presentacion'
});
Variante.belongsTo(Variedad, {
  foreignKey: 'variedadId',
  targetKey: 'id', as: 'variedad'
});
Variante.belongsTo(Unidad, {
  foreignKey: 'unidadId',
  targetKey: 'id', as: 'unidad'
});
module.exports = Variante;
