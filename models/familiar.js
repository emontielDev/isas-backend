module.exports = (sequelize, DataTypes) => {
    var Familiar = sequelize.define(
        "familiar", {
            idAlumno: {
                allowNull: false,
                references: {
                    key: "id",
                    model: "usuario"
                },
                type: DataTypes.INTEGER
            },
            idTutor: {
                allowNull: false,
                references: {
                    key: "id",
                    model: "usuario"
                },
                type: DataTypes.INTEGER
            }
        }, {
            createdAt: false,
            freezeTableName: true,
            updatedAt: false
        }
    );
    Familiar.removeAttribute("id");

    return Familiar;
};