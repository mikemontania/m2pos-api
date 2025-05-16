const { DataTypes } = require("sequelize");
const { sequelize } = require("../../dbconfig");
const Empresa = require("./empresa.model");
 const Usuario = require("./usuario.model");
const moment = require("moment");
 const Cliente = sequelize.define("Cliente", {
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
    razonSocial: {
      type: DataTypes.STRING(100),
      allowNull: true,
    set(value) {
      if (value) { 
        this.setDataValue('razonSocial', value.toUpperCase());
      }
    }
    },
  nombreFantasia: {
    type: DataTypes.STRING(100),
    allowNull: true,
    set(value) {
      if (value) { 
        this.setDataValue('nombreFantasia', value.toUpperCase());
      }
    }
  },
  nroDocumento: {
    type: DataTypes.STRING(30),
    allowNull: false, 
  },
  tipoOperacionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[1, 2, 3, 4]]
    },
    comment: `1=B2B, 2=B2C, 3=B2G, 4=B2F`
  }, 
  email: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  excentoIva: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  puntos: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false,
    defaultValue: 0
  },
  naturalezaReceptor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { isIn: [[1, 2]] },
    comment: "1=Contribuyente, 2=No contribuyente"
  },
  codigoPais: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  tipoContribuyente: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { isIn: [[1, 2]] }
  },
  tipoDocIdentidad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { isIn: [[1, 2, 3, 4, 5, 6, 9]] }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  predeterminado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }, 
  propietario: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  tableName: "clientes",
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      name: "unique_nroDocumento_empresa",
      fields: ["nro_documento", "empresa_id"]
    },
    {
      unique: true,
      name: "unique_predeterminado_empresa",
      fields: ["empresa_id"],
      where: {
        predeterminado: true
      }
    },
    {
      unique: true,
      name: "unique_propietario_empresa",
      fields: ["empresa_id"],
      where: {
        propietario: true
      }
    }
  ]
});

// Relaciones
Cliente.belongsTo(Empresa, { foreignKey: "empresaId" });
Cliente.belongsTo(Usuario, { foreignKey: "usuarioCreacionId" });
Cliente.belongsTo(Usuario, { foreignKey: "usuarioModificacionId" });

module.exports = Cliente;