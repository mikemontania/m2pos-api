const { DataTypes } = require("sequelize");
const { sequelize } = require("../../dbconfig");
const Empresa = require("./empresa.model");
const Certificado = sequelize.define(
  "Certificado ",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    empresaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },

    passphrase: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    validoDesde: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        return moment(this.getDataValue("validoDesde")).format("YYYY-MM-DD");
      }
    },
    validoHasta: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        return moment(this.getDataValue("validoHasta")).format("YYYY-MM-DD");
      }
    },

    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  },
  {
    tableName: "certificados",
    timestamps: false,
    underscored: true
    // Esto convierte los nombres de modelos de pascalCase a snake_case
  }
);

Certificado.belongsTo(Empresa, {
  foreignKey: "empresaId",
  targetKey: "id"
});

module.exports = Certificado;
