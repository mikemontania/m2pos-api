const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Empresa = require('./empresa.model');  
const Sucursal = require('./sucursal.model');
const Usuario = require('./usuario.model');
const ListaPrecio = require('./listaPrecio.model');
const Cliente = require('./cliente.model');
const moment = require('moment');
const CondicionPago = require('./condicionPago.model');
const Cobranza = require('./cobranza.model'); 
const ClienteSucursal = require('./ClienteSucursal.model');

const Pedido = sequelize.define('Pedido', {
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
  clienteId: {
    type: DataTypes.BIGINT,
    allowNull: false
  }, 
  clienteSucursalId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  listaPrecioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }, 
  condicionPagoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },  
  cobranzaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }, 
  anulado: {
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
    defaultValue: DataTypes.NOW,
    get() {
      return moment(this.getDataValue('fechaCreacion')).format('YYYY-MM-DD HH:mm:ss');
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
  fechaAnulacion: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    get() {
      return moment(this.getDataValue('fechaAnulacion')).format('YYYY-MM-DD');
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('fecha')).format('YYYY-MM-DD');
    }
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
  valorNeto: {
    type: DataTypes.DECIMAL(19, 2),
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
  estado: {
    type: DataTypes.STRING(25),
    allowNull: false,
    defaultValue:'Pendiente'
  },  
   canal: { 
    type: DataTypes.ENUM('web','ecommerce','whatsapp','local','instagram','facebook','telegram'), 
    allowNull: false, 
    defaultValue: 'web' 
  }, 
  obsPedido: { 
    type: DataTypes.ENUM('pendiente','entregado','anulado','rechazado'), 
    allowNull: false, 
    defaultValue: 'pendiente' 
  }, 
    observacion: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
}, {
  tableName: 'pedidos',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Pedido.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
  as:'empresa'
});
Pedido.belongsTo(Sucursal, {
  foreignKey: 'sucursalId',
  targetKey: 'id',
  as:'sucursal'
});
Pedido.belongsTo(Usuario, {
  foreignKey: 'usuarioCreacionId',
  targetKey: 'id',
  as: 'vendedorCreacion' // Alias para la asociación de usuario de creación
});
Pedido.belongsTo(Cobranza, {
  foreignKey: 'cobranzaId',
  targetKey: 'id',
  as: 'cobranza' // Alias para la asociación de usuario de creación
}); 
Pedido.belongsTo(Usuario, {
  foreignKey: 'usuarioAnulacionId',
  targetKey: 'id',
  as: 'vendedorAnulacion' // Alias para la asociación de usuario de anulación
});
Pedido.belongsTo(ListaPrecio, {
  foreignKey: 'listaPrecioId',
  targetKey: 'id',
  as:'listaPrecio'
});
Pedido.belongsTo(Cliente, {
  foreignKey: 'clienteId',
  targetKey: 'id',
  as:'cliente'
});
Pedido.belongsTo(ClienteSucursal, {
  foreignKey: 'clienteSucursalId',
  targetKey: 'id',
  as:'clienteSucursal'
});
Pedido.belongsTo(CondicionPago, {
  foreignKey: 'condicionPagoId',
  targetKey: 'id',
  as:'condicionPago'
});
 
module.exports = Pedido;
