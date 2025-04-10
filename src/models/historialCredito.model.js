const { DataTypes } = require("sequelize");
const { sequelize } = require("../../dbconfig");
const Empresa = require("./empresa.model");
const Usuario = require("./usuario.model");
const moment = require("moment"); 
const Credito = require("./credito.model");

const HistorialCredito = sequelize.define(
  "HistorialCredito",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    // Fecha real del movimiento (no del registro en la DB)
  fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        return moment(this.getDataValue('fecha')).format('YYYY-MM-DD');
      }
    },

 fechaCreacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return moment(this.getDataValue('fechaCreacion')).format('YYYY-MM-DD HH:mm:ss');
    }
  },

    importe: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },

    saldoAnterior: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },

    saldoNuevo: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },

    observacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // Redundancia opcional: solo si necesitás filtrar mucho por empresa
    empresaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    creditoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    usuarioCreacionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    timbrado: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    nroComprobante: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: "historial_creditos",
    timestamps: false,
    underscored: true,
  }
);
HistorialCredito.belongsTo(Empresa, {
  foreignKey: "empresaId",
  targetKey: "id",
  as: "empresa"
}); 
HistorialCredito.belongsTo(Credito, {
  foreignKey: "creditoId",
  targetKey: "id", 
});
HistorialCredito.belongsTo(Usuario, {
  foreignKey: "usuarioCreacionId",
  targetKey: "id",
  as: "usuarioCreacion" // Alias para la asociación de usuario de creación
}); 
 
module.exports = HistorialCredito;
