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
const TablaSifen = require('./tablaSifen.model');

const Documento = sequelize.define('Documento', {
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
  enviado: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  itide: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('fechaInicio')).format('YYYY-MM-DD');
    }
  },
  fechaFin: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('fechaFin')).format('YYYY-MM-DD');
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
  estado: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  codigoSeguridad: {
    type: DataTypes.STRING(9),
    allowNull: false
  },
  cdc: {
    type: DataTypes.STRING(44),
    allowNull: false
  },
  cdcAsociado: {
    type: DataTypes.STRING(44),
    allowNull: true
  },
  docAsociadoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }, 
  tipoDoc: { 
    type: DataTypes.ENUM('FCT', 'NCR', 'NDB','NRM'), 
    allowNull: false, 
    defaultValue: 'FCT' 
  },
  calculables: { 
    type: DataTypes.ENUM('SI', 'NO'), 
    allowNull: false, 
    defaultValue: 'SI' 
  },
  importeAnterior: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false, 
    defaultValue: 0 
  },
  importeDevuelto: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false, 
    defaultValue: 0 
  },

  
}, {
  tableName: 'documentos',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
Documento.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
  as:'empresa'
});
Documento.belongsTo(Sucursal, {
  foreignKey: 'sucursalId',
  targetKey: 'id',
  as:'sucursal'
});
Documento.belongsTo(Usuario, {
  foreignKey: 'usuarioCreacionId',
  targetKey: 'id',
  as: 'vendedorCreacion' // Alias para la asociación de usuario de creación
});
Documento.belongsTo(Cobranza, {
  foreignKey: 'cobranzaId',
  targetKey: 'id',
  as: 'cobranza' // Alias para la asociación de usuario de creación
}); 
Documento.belongsTo(Usuario, {
  foreignKey: 'usuarioAnulacionId',
  targetKey: 'id',
  as: 'vendedorAnulacion' // Alias para la asociación de usuario de anulación
});
Documento.belongsTo(ListaPrecio, {
  foreignKey: 'listaPrecioId',
  targetKey: 'id',
  as:'listaPrecio'
});
Documento.belongsTo(Cliente, {
  foreignKey: 'clienteId',
  targetKey: 'id',
  as:'cliente'
});
Documento.belongsTo(CondicionPago, {
  foreignKey: 'condicionPagoId',
  targetKey: 'id',
  as:'condicionPago'
});
Documento.belongsTo(TablaSifen, {
  foreignKey: 'itide',
  targetKey: 'id',
  as :'tipoDocumento'
});
module.exports = Documento;
