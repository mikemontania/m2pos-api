const { DataTypes } = require("sequelize");
const { sequelize } = require("../../dbconfig");
const Empresa = require("./empresa.model");
const Sucursal = require("./sucursal.model"); 
const Numeracion = require("./numeracion.model");
const Usuario = sequelize.define(
  "Usuario",
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

    sucursalId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numPrefId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numNcPrefId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    password: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    img: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    rol: {
      type: DataTypes.STRING,
      allowNull: true
    },

    intentos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:0
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue:true
    },
    bloqueado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue:false
    }
  },
  {
    tableName: "usuarios",
    timestamps: false,
    underscored: true
    // Esto convierte los nombres de modelos de pascalCase a snake_case
  }
);

Usuario.belongsTo(Sucursal, {
  foreignKey: "sucursalId",
  targetKey: "id",
  as:'sucursal'
});
Usuario.belongsTo(Numeracion, {
  foreignKey: "numPrefId",
  targetKey: "id",
  as:'numeracion'
});
Usuario.belongsTo(Numeracion, {
  foreignKey: "numNcPrefId",
  targetKey: "id",
  as:'numeracionNc'
});

Usuario.belongsTo(Empresa, {
  foreignKey: "empresaId",
  targetKey: "id"
});

module.exports = Usuario;
