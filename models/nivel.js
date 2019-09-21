module.exports = (sequelize, DataTypes) => {
    var Nivel = sequelize.define(
        "nivel", {
            id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
            nombre: { allowNull: false, type: DataTypes.STRING(15), unique: true },
            evaluaciones: { allowNull: false, type: DataTypes.SMALLINT }
        }, {
            freezeTableName: true
        }
    );

    return Nivel;
};