module.exports = (sequelize, DataTypes) => {
    var CicloEscolar = sequelize.define(
        "cicloescolar", {
            id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
            nombre: { allowNull: false, type: DataTypes.STRING(15), unique: true },
            fechaInicio: { allowNull: false, type: DataTypes.DATEONLY },
            fechaFin: { allowNull: false, type: DataTypes.DATEONLY }
        }, {
            freezeTableName: true
        }
    );

    return CicloEscolar;
};