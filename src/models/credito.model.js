const { DataTypes } = require("sequelize");
const { sequelize } = require("../../dbconfig");
const Empresa = require("./empresa.model");
const Sucursal = require("./sucursal.model");
const Usuario = require("./usuario.model");
const Cliente = require("./cliente.model");
const moment = require("moment");
const FormaVenta = require("./formaVenta.model");
const Cobranza = require("./cobranza.model");
const Venta = require("./venta.model");

const Credito = sequelize.define(
  "Credito",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
     empresaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sucursalId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    formaVentaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cobranzaId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ventaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }, 
    pagado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },

    usuarioCreacionId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    fechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        return moment(this.getDataValue("fechaVencimiento")).format(
          "YYYY-MM-DD"
        );
      }
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        return moment(this.getDataValue("fecha")).format("YYYY-MM-DD");
      }
    },

    observacion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    importeTotal: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
    },

    clienteId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  },
  {
    tableName: "creditos",
    timestamps: false,
    underscored: true // Convierte automáticamente a snake_case
  }
);
Credito.belongsTo(Empresa, {
  foreignKey: "empresaId",
  targetKey: "id",
  as: "empresa"
});
Credito.belongsTo(Sucursal, {
  foreignKey: "sucursalId",
  targetKey: "id",
  as: "sucursal"
});
Credito.belongsTo(Venta, {
  foreignKey: "ventaId",
  targetKey: "id", 
});
Credito.belongsTo(Usuario, {
  foreignKey: "usuarioCreacionId",
  targetKey: "id",
  as: "vendedorCreacion" // Alias para la asociación de usuario de creación
});
Credito.belongsTo(Cobranza, {
  foreignKey: "cobranzaId",
  targetKey: "id",
  as: "cobranza" // Alias para la asociación de usuario de creación
});
Credito.belongsTo(Usuario, {
  foreignKey: "usuarioAnulacionId",
  targetKey: "id",
  as: "vendedorAnulacion" // Alias para la asociación de usuario de anulación
});

Credito.belongsTo(Cliente, {
  foreignKey: "clienteId",
  targetKey: "id",
  as: "cliente"
});
Credito.belongsTo(FormaVenta, {
  foreignKey: "formaVentaId",
  targetKey: "id",
  as: "formaVenta"
});
module.exports = Credito;
