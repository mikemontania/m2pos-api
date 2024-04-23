const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 
const Usuario = require('./usuario.model');
const moment = require('moment');

const Auditoria = sequelize.define('Auditoria', {
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
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return moment(this.getDataValue('fecha')).format('YYYY-MM-DD');
    }
   },
   fechaModificacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return moment(this.getDataValue('fechaModificacion')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },  
  metodo: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  path: {
    type: DataTypes.STRING(100),
    allowNull: false
  }, 
  detalles: {
    type: DataTypes.JSONB,  
    allowNull: true
  }, 
  status: {
    type: DataTypes.STRING(50),  
    allowNull: true
  },
  mensaje: {
    type: DataTypes.STRING(50), 
    allowNull: true
  },
  ipCliente: {
    type: DataTypes.STRING(45), // IPv4 o IPv6
    allowNull: true
  },
  
}, {
  tableName: 'auditorias',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Auditoria.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
Auditoria.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  targetKey: 'id',
  as: 'usuario' // Alias para la asociación de usuario de creación
});
 
module.exports = Auditoria;
