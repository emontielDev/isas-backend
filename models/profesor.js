module.exports = (sequelize, DataTypes) => {
    var Profesor = sequelize.define(
        "profesor", {
            id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
            clave: { allowNull: true, type: DataTypes.STRING(10), unique: true },
            avatar: { allowNull: true, type: DataTypes.STRING(45) },
            nombre: { allowNull: false, type: DataTypes.STRING(100) },
            apaterno: { allowNull: false, type: DataTypes.STRING(50) },
            amaterno: { allowNull: false, type: DataTypes.STRING(50) },
            correo: { allowNull: false, type: DataTypes.STRING(254) },
            fechaNacimiento: { allowNull: false, type: DataTypes.DATEONLY },
            fechaNacimiento: { allowNull: false, type: DataTypes.DATEONLY },
            estatus: { allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true }
        }, {
            freezeTableName: true,
            updatedAt: false
        }
    );

    return Profesor;
};