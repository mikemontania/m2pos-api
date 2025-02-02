const { DataTypes } = require("sequelize");
const { sequelize } = require("../../dbconfig");
const Empresa = require("./empresa.model");
const Actividad = require("./actividad.model");

const EmpresaActividad = sequelize.define(
  "EmpresaActividad",
  {
    empresaId: {
      type: DataTypes.INTEGER,
      references: {
        model: Empresa,
        key: "id"
      }
    },
    actividadId: {
      type: DataTypes.BIGINT,
      references: {
        model: Actividad,
        key: "id"
      }
    }
  },
  {
    tableName: "empresa_actividades",
    timestamps: false,
    underscored: true
  }
);

EmpresaActividad.belongsTo(Empresa, {
  foreignKey: 'empresaId',
  targetKey: 'id',
});
EmpresaActividad.belongsTo(Actividad, {
  foreignKey: 'actividadId',
  as: 'actividades',   
  targetKey: 'id',
});
 
  

module.exports = EmpresaActividad;
