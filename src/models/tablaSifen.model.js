const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig'); 
const Empresa = require('./empresa.model');

const TablaSifen  = sequelize.define('TablaSifen ', {
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
  codigo: {
    type: DataTypes.STRING(15),
    allowNull: false
  }, 
  tabla: {
    type: DataTypes.STRING(15),
    allowNull: false
  }, 
  descripcion: {
    type: DataTypes.STRING(300),
    allowNull: false
  }, 
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue:true,
    allowNull: false
  },
 
}, {
  tableName: 'tablas_sifen',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
TablaSifen.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
 
module.exports = TablaSifen;
