var Sequelize = require("sequelize")
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
    var Materia = sequelize.define(
        "materia", {
            id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
            clave: { allowNull: true, type: DataTypes.STRING(15) },
            nombre: { allowNull: false, type: DataTypes.STRING(40) },
            curricular: {
                allowNull: false,
                type: DataTypes.BOOLEAN
            }
        }, {
            freezeTableName: true,
            indexes: [
            {
                unique: true,
                fields: ['clave'],
                where: {
                    clave: {
                        [Op.not]: null
                            }
                        },
                    },
            ]
        }        
    );

    return Materia;
};