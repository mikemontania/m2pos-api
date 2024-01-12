const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model'); 
const ListaPrecio = require('./listaPrecio.model');
const FormaVenta = require('./formaVenta.model');

const Usuario = require('./usuario.model');
const moment = require('moment');


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
    allowNull: false,
  }, 
  formaVentaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  },
  razonSocial: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nroDocumento: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING(400),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(50),
    allowNull: true
  }, 
  cel: {
    type: DataTypes.STRING(50),
    allowNull: true
  }, 
  email: {
    type: DataTypes.STRING(50),
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
  puntos: {
    type: DataTypes.DECIMAL(19, 2),
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
Cliente.belongsTo(FormaVenta, {
  foreignKey: 'formaVentaId',
  targetKey: 'id',
});
Cliente.belongsTo(Usuario, {
  foreignKey: 'usuarioCreacionId',
  targetKey: 'id',
});
 
module.exports = Cliente;
