const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 

const Marca = sequelize.define('Marca', {
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
  descripcion: {
    type: DataTypes.STRING(40),
    allowNull: false,
    set(value) {
      this.setDataValue('descripcion', value.toUpperCase());
    }
  }, 
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue:true,
    allowNull: false
  }, 
}, {
  tableName: 'marcas',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Marca.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
 
module.exports = Marca;
