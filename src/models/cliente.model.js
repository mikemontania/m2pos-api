const { DataTypes } = require("sequelize");
const { sequelize } = require("../../dbconfig");
const Empresa = require("./empresa.model");
const ListaPrecio = require("./listaPrecio.model"); 
const Usuario = require("./usuario.model");
const moment = require("moment");
const CondicionPago = require("./condicionPago.model");

const Cliente = sequelize.define(
  "Cliente",
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
    tipoOperacionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, 2, 3, 4]] // Solo permite estos valores
      },
      comment: `  
        1 = B2B (Business to Business)  
        2 = B2C (Business to Consumer)  
        3 = B2G (Business to Government)  
        4 = B2F (Business to Freelancer o servicios a empresas o profesionales)  
      `
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
    fechaModif: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    usuarioModif: {
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
    razonSocial: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nombreFantasia: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nroDocumento: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: {
        name: 'unique_nroDocumento_empresaId',
        msg: 'Ya existe un cliente con este número de documento',
        fields: ['nroDocumento', 'empresaId'],
      },
      validate: {
        notNull: {
          msg: 'El número de documento no puede ser nulo.',
        },
      },
    }, 
    direccion: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cel: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    excentoIva: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    latitud: {
      type: DataTypes.DECIMAL(18, 15),
      allowNull: true,    defaultValue:0
    },
    longitud: {
      type: DataTypes.DECIMAL(18, 15),
      allowNull: true,    defaultValue:0
    },
    predeterminado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    empleado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    propietario: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    puntos: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
      defaultValue: 0
    },
// Campos requeridos por SIFEN
naturalezaReceptor: {
  type: DataTypes.INTEGER,
  allowNull: false,
  validate: {
    isIn: [[1, 2]]
  },
  comment: "1= Contribuyente, 2= No contribuyente"
},
codigoPais: {
  type: DataTypes.STRING(3),
  allowNull: false,
  comment: "Código de país del receptor según XSD"
},
tipoContribuyente: {
  type: DataTypes.INTEGER,
  allowNull: true,
  validate: {
    isIn: [[1, 2]]
  },
  comment: "1= Persona Física, 2= Persona Jurídica. Obligatorio si naturalezaReceptor=1"
},
tipoDocIdentidad: {
  type: DataTypes.INTEGER,
  allowNull: true,
  validate: {
    isIn: [[1, 2, 3, 4, 5, 6, 9]]
  },
  comment: "1= Cédula paraguaya, 2= Pasaporte, 3= Cédula extranjera, 4= Carnet de residencia, 5= Innominado, 6= Tarjeta Diplomática, 9= Otro"
},
 

  },
  {
    tableName: "clientes",
    timestamps: false,
    underscored: true // Convierte automáticamente a snake_case
  }
);
Cliente.belongsTo(Empresa, {
  foreignKey: "empresaId",
  targetKey: "id"
});
Cliente.belongsTo(ListaPrecio, {
  foreignKey: "listaPrecioId",
  targetKey: "id",
  as: "listaPrecio"
});
Cliente.belongsTo(CondicionPago, {
  foreignKey: "condicionPagoId",
  targetKey: "id",
  as: "condicionPago"
});
Cliente.belongsTo(Usuario, {
  foreignKey: "usuarioCreacionId",
  targetKey: "id"
});
Cliente.belongsTo(Usuario, {
  foreignKey: "usuarioModificacionId",
  targetKey: "id"
});
module.exports = Cliente;
