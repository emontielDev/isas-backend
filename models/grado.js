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
            nombre: {
                allowNull: false,
                type: DataTypes.STRING(30)
            }
        }, {
            freezeTableName: true
        }
    );

    return Grado;
};