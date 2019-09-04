var Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
    var Usuario = sequelize.define(
        "usuario", {
            id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
            avatar: { allowNull: true, type: DataTypes.STRING(100) },
            nombre: { allowNull: false, type: DataTypes.STRING(100) },
            apaterno: { allowNull: false, type: DataTypes.STRING(50) },
            amaterno: { allowNull: true, type: DataTypes.STRING(50) },
            correoElectronico: { allowNull: true, type: DataTypes.STRING(254) },
            password: { allowNull: true, type: DataTypes.STRING(150) },
            curp: { allowNull: true, type: DataTypes.STRING(18) },
            calle: { allowNull: true, type: DataTypes.STRING(200) },
            numeroInterior: { allowNull: true, type: DataTypes.STRING(10) },
            numeroExterior: { allowNull: true, type: DataTypes.STRING(10) },
            delegacion: { allowNull: true, type: DataTypes.STRING(25) },
            estado: { allowNull: true, type: DataTypes.STRING(30) },
            codigoPostal: { allowNull: true, type: DataTypes.STRING(5) },
            telefono: { allowNull: true, type: DataTypes.STRING(20) },
            sexo: { allowNull: true, type: DataTypes.BOOLEAN },
            nacionalidad: { allowNull: true, type: DataTypes.STRING(20) },
            lugarNacimiento: { allowNull: true, type: DataTypes.STRING(70) },
            fechaNacimiento: { allowNull: true, type: DataTypes.DATEONLY },
            estadoCivil: {
                allowNull: true,
                type: Sequelize.ENUM,
                values: ["DIVORCIADO", "SOLTERO", "CASADO", "UNION_LIBRE", "VIUDO"]
            },
            hijos: { allowNull: true, type: DataTypes.BOOLEAN },
            viveConp: { allowNull: true, type: DataTypes.BOOLEAN },
            viveConm: { allowNull: true, type: DataTypes.BOOLEAN },
            hHombres: { allowNull: true, type: DataTypes.SMALLINT },
            hMujeres: { allowNull: true, type: DataTypes.SMALLINT },
            trabaja: { allowNull: true, type: DataTypes.BOOLEAN },
            empresa: { allowNull: true, type: DataTypes.STRING(100) },
            puesto: { allowNull: true, type: DataTypes.STRING(50) },
            telefonoTrabajo: { allowNull: true, type: DataTypes.STRING(25) },
            perfil: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: [
                    "ADMINISTRADOR",
                    "ALUMNO",
                    "CONTROL_ESCOLAR",
                    "TUTOR",
                    "PROFESOR"
                ]
            },
            confirmada: {
                allowNull: false,
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            estatus: { allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true }
        }, {
            freezeTableName: true,
            indexes: [{
                unique: true,
                fields: ["correoElectronico"],
                where: {
                    correoElectronico: {
                        [Op.not]: null
                    }
                }
            }]
        }
    );

    return Usuario;
};