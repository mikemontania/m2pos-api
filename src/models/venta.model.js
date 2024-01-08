const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');  
const Sucursal = require('./sucursal.model');
const Usuario = require('./usuario.model');
const ListaPrecio = require('./listaPrecio.model');
const Cliente = require('./cliente.model');
const moment = require('moment');
const FormaVenta = require('./formaVenta.model');

const Venta = sequelize.define('Venta', {
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
  sucursalId: {
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
  anulado: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  enviado: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  
  usuarioCreacionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }, 
   usuarioAnulacionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  fechaModificacion: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  fechaAnulacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('fechaAnulacion')).format('YYYY-MM-DD');
    }
   },
  fechaVenta: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('fechaVenta')).format('YYYY-MM-DD');
    }
   },
  

  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('fechaInicio')).format('YYYY-MM-DD');
    }
   },
   fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('fechaInicio')).format('YYYY-MM-DD');
    }
   },
   timbrado: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
   nroComprobante: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  
  porcDescuento: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  }, 
  importeIva5: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  importeIva10: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  importeIvaExenta: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  importeDescuento: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  importeNeto: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  importeSubtotal: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  importeTotal: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  
  clienteId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
   
  modoEntrega: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  totalKg: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
   
 
}, {
  tableName: 'ventas',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Venta.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
Venta.belongsTo(Sucursal, {
  foreignKey: 'sucursalId',
  targetKey: 'id',
});
Venta.belongsTo(Usuario, {
  foreignKey: 'usuarioCreacionId',
  targetKey: 'id',
});

Venta.belongsTo(Usuario, {
  foreignKey: 'usuarioAnulacionId',
  targetKey: 'id',
});
Venta.belongsTo(ListaPrecio, {
  foreignKey: 'listaPrecioId',
  targetKey: 'id',
});
Venta.belongsTo(Cliente, {
  foreignKey: 'clienteId',
  targetKey: 'id',
});
Venta.belongsTo(FormaVenta, {
  foreignKey: 'formaVentaId',
  targetKey: 'id',
});
module.exports = Venta;
