module.exports = (sequelize, DataTypes) => {
    var Alumno = sequelize.define(
        "alumno", {
            id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
            clave: { allowNull: true, type: DataTypes.STRING(10), unique: true },
            avatar: { allowNull: true, type: DataTypes.STRING(45) },
            nombre: { allowNull: false, type: DataTypes.STRING(100) },
            apaterno: { allowNull: false, type: DataTypes.STRING(50) },
            amaterno: { allowNull: false, type: DataTypes.STRING(50) },
            correo: { allowNull: false, type: DataTypes.STRING(254) },
            calle: { allowNull: false, type: DataTypes.STRING(200) },
            numeroInterior: { allowNull: true, type: DataTypes.STRING(10) },
            numeroExterior: { allowNull: true, type: DataTypes.STRING(10) },
            delegacion: { allowNull: true, type: DataTypes.STRING(25) },
            codigoPostal: { allowNull: false, type: DataTypes.STRING(5) },
            fechaNacimiento: { allowNull: false, type: DataTypes.DATEONLY },
            estatus: { allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true }
        }, {
            createdAt: false,
            freezeTableName: true,
            updatedAt: false
        }
    );

    return Alumno;
};