module.exports = (sequelize, DataTypes) => {
    var Grado = sequelize.define(
        "grado", {
            id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
            idNivel: {
                allowNull: false,
                references: {
                    key: "id",
                    model: "nivel"
                },
                type: DataTypes.INTEGER
            },
            evaluaciones: { allowNull: false, type: DataTypes.SMALLINT }
        }, {
            createdAt: false,
            freezeTableName: true,
            updatedAt: false
        }
    );

    return Grado;
};