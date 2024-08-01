const { DataTypes } = require("sequelize");
const { sequelize } = require("../../dbconfig");

const Empresa = sequelize.define(
  "Empresa",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    razonSocial: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombreFantasia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    moneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codigoMoneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    simboloMoneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipoContId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipoTransaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipoImpId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numCasa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    depEmiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    disEmiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ciuEmiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    actividadcode1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actividad1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actividadcode2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actividad2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actividadcode3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actividad3: {
      type: DataTypes.STRING,
      allowNull: true,
    },  
    ruc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    web: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "empresas",
    timestamps: false, // Puedes deshabilitar los campos de timestamp si no los necesitas
    underscored: true // Convierte automáticamente a snake_case
  }
);

module.exports = Empresa;
