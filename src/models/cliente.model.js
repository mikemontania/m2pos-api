const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 
const ListaPrecio = require('./listaPrecio.model');
const Usuario = require('./usuario.model');
 
const Cliente = sequelize.define('Cliente', {
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
  usuarioCreacionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }, 
  fechaModif: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
   },
   usuarioModif: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }, 
  fechaCreacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
   },
  razonSocial: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nroDocumento: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING(400),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(30),
    allowNull: true
  }, 
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  excentoIva: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }, 
  latitud: {
    type: DataTypes.DECIMAL(18, 15),
    allowNull: true
  },
  longitud: {
    type: DataTypes.DECIMAL(18, 15),
    allowNull: true
  },
  predeterminado: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  empleado: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  propietario: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
 
}, {
  tableName: 'clientes',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Cliente.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
Cliente.belongsTo(ListaPrecio, {
  foreignKey: 'listaPrecioId',
  targetKey: 'id',
});
Cliente.belongsTo(Usuario, {
  foreignKey: 'usuarioCreacionId',
  targetKey: 'id',
});
 
module.exports = Cliente;
