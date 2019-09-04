module.exports = (sequelize, DataTypes) => {
    var GrupoAlumno = sequelize.define(
        "grupoalumno", {
            id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
            idCicloEscolar: {
                allowNull: false,
                references: {
                    key: "id",
                    model: "cicloescolar"
                },
                type: DataTypes.INTEGER
            },
            idGrado: {
                allowNull: false,
                references: {
                    key: "id",
                    model: "grado"
                },
                type: DataTypes.INTEGER
            },
            nombre: { allowNull: false, type: DataTypes.STRING(10) }
        }, {
            createdAt: false,
            freezeTableName: true,
            updatedAt: false
        }
    );

    return GrupoAlumno;
};