const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 
const Marca = require('./marca.model');
const Categoria = require('./categoria.model');
const SubCategoria = require('./subCategoria.model'); 

const Producto = sequelize.define('Producto', {
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

  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  subCategoriaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  marcaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  }, 
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false
  }, 
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
 
}, {
  tableName: 'productos',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Producto.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
Producto.belongsTo(Marca, {
  foreignKey: 'marcaId',
  targetKey: 'id',as: 'marca'
});
Producto.belongsTo(Categoria, {
  foreignKey: 'categoriaId',
  targetKey: 'id',as: 'categoria'
});
Producto.belongsTo(SubCategoria, {
  foreignKey: 'subCategoriaId',
  targetKey: 'id',as: 'subCategoria'
});
 
module.exports = Producto;
