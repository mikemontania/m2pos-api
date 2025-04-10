const { DataTypes } = require("sequelize");
const { sequelize } = require("../../dbconfig");
const Empresa = require("./empresa.model");
const Usuario = require("./usuario.model");
const Cliente = require("./cliente.model");
const moment = require("moment");
const CondicionPago = require("./condicionPago.model");
const dayjs = require("dayjs");
const Documento = require("./documento.model");

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
    condicionPagoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    documentoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    anulado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    
     fecha: {
       type: DataTypes.DATEONLY,
       allowNull: false,
       get() {
         return moment(this.getDataValue('fecha')).format('YYYY-MM-DD');
       }
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
    cantDias: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, 
    fechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        return moment(this.getDataValue("fechaVencimiento")).format("YYYY-MM-DD");
      },
    }, 
    importeTotal: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    }, 
    saldoPendiente: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    }, 
    estado: {
      type: DataTypes.ENUM("PENDIENTE", "PAGADO"), // Puedes ajustar los valores según tu enum
      allowNull: true,
    }, 
    fechaPago: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      get() {
        const val = this.getDataValue("fechaPago");
        return val ? moment(val).format("YYYY-MM-DD") : null;
      },
    }, 
    diasRestantes: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.anulado || this.estado === 'PAGADO') return 0;
        return Math.max(0, dayjs(this.fechaVencimiento).diff(dayjs(), 'day'));
      }
    },
    diasMora: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.anulado || this.estado === 'PAGADO') return 0;
        return Math.max(0, dayjs().diff(dayjs(this.fechaVencimiento), 'day'));
      }
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
Credito.belongsTo(Documento, {
  foreignKey: "documentoId",
  targetKey: "id", 
});
Credito.belongsTo(Usuario, {
  foreignKey: "usuarioCreacionId",
  targetKey: "id",
  as: "usuarioCreacion" // Alias para la asociación de usuario de creación
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
Credito.belongsTo(CondicionPago, {
  foreignKey: "condicionPagoId",
  targetKey: "id",
  as: "condicionPago"
});
module.exports = Credito;
