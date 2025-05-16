const { DataTypes } = require("sequelize");
const { sequelize } = require("../../dbconfig");
const Empresa = require("./empresa.model");
const ListaPrecio = require("./listaPrecio.model"); 
const Usuario = require("./usuario.model");
const moment = require("moment");
const CondicionPago = require("./condicionPago.model");
const Cliente = require("./cliente.model");

const ClienteSucursal = sequelize.define("ClienteSucursal", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  clienteId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING(400),
    allowNull: true,
    set(value) {
      if (value) { 
        this.setDataValue('direccion', value.toUpperCase());
      }
    }
  },
  telefono: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  cel: {
    type: DataTypes.STRING(50),
    allowNull: true
  }, 
  latitud: {
    type: DataTypes.DECIMAL(18, 15),
    allowNull: true,
    defaultValue: 0
  },
  longitud: {
    type: DataTypes.DECIMAL(18, 15),
    allowNull: true,
    defaultValue: 0
  },
  principal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  listaPrecioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  condicionPagoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }, 
  usuarioCreacionId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  usuarioModificacionId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return moment(this.getDataValue("fechaCreacion")).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }
  },
  fechaModificacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return moment(this.getDataValue("fechaModificacion")).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }
  },
}, {
  tableName: "cliente_sucursales",
  timestamps: false,
  underscored: true,
  indexes: [  
    {
      unique: true,
      name: "unique_principal_cliente",
      fields: ["cliente_id"],
      where: {
        principal: true
      }
    }
  ]
});

// Relaciones
ClienteSucursal.belongsTo(Cliente, {
  foreignKey: 'clienteId',
  targetKey: 'id',
  as:'cliente'
});
ClienteSucursal.belongsTo(Empresa, {targetKey: 'id', foreignKey: "empresaId" });
ClienteSucursal.belongsTo(ListaPrecio, {targetKey: 'id', foreignKey: "listaPrecioId", as: "listaPrecio" });
ClienteSucursal.belongsTo(CondicionPago, { targetKey: 'id',foreignKey: "condicionPagoId", as: "condicionPago" });
ClienteSucursal.belongsTo(Usuario, {targetKey: 'id', foreignKey: "usuarioCreacionId" });
ClienteSucursal.belongsTo(Usuario, {targetKey: 'id', foreignKey: "usuarioModificacionId" });

module.exports = ClienteSucursal;