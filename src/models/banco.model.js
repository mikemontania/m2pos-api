const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 

const Banco  = sequelize.define('Banco ', {
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
    allowNull: false
  }, 
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue:true,
    allowNull: false
  },
 
}, {
  tableName: 'bancos',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Banco.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
 
module.exports = Banco;
