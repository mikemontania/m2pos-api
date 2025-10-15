const { DataTypes } = require('sequelize')
const { sequelize } = require('../../dbconfig')
const Departamento = require('./departamento.model')
const Ciudad = require('./ciudad.model')
const Barrio = require('./barrio.model')
const Moneda = require('./moneda.model')

const Empresa = sequelize.define(
  'Empresa',
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
    idCSC: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    csc: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    codMoneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    simboloMoneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipoContId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipoTransaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipoImpId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numCasa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    codDepartamento: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    codCiudad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    codBarrio: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    emailEnvio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailUser: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    emailPass: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    web: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modoSifen: {
      type: DataTypes.ENUM('SI', 'NO'),
      allowNull: false,
      defaultValue: 'SI'
    },
    envioKude: {
      type: DataTypes.ENUM('SI', 'NO'),
      allowNull: false,
      defaultValue: 'NO'
    }
  },
  {
    tableName: 'empresas',
    timestamps: false, // Puedes deshabilitar los campos de timestamp si no los necesitas
    underscored: true // Convierte automáticamente a snake_case
  }
)
Empresa.belongsTo(Departamento, {
  foreignKey: 'codDepartamento',
  targetKey: 'codigo',
  as: 'departamento'
})
Empresa.belongsTo(Ciudad, {
  foreignKey: 'codCiudad',
  targetKey: 'codigo',
  as: 'ciudad'
})
Empresa.belongsTo(Barrio, {
  foreignKey: 'codBarrio',
  targetKey: 'codigo',
  as: 'barrio'
})
Empresa.belongsTo(Moneda, {
  foreignKey: 'codMoneda',
  targetKey: 'codigo',
  as: 'moneda'
})

module.exports = Empresa
