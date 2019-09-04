var fs = require("fs"),
    path = require("path"),
    Sequelize = require("sequelize"),
    lodash = require("lodash"),
    moment = require("moment"),
    sequelize = new Sequelize(
        "isas-demo", // DataBase Name
        "root", // UserName
        "root", // Password
        {
            dialect: "mysql",
            dialectOptions: {
                timezone: "-05:00",
                typeCast: function(field, next) {
                        // if (field.type == "DATETIME") {
                        //     console.log("paso");
                        //     return moment(new Date(field.string()).toString()).format();
                        //return moment(new Date(field.string()).toString()).format('YYYY-MM-DDTHH:mm:ss'); // can be 'Z' for UTC or an offset in the form '+HH:MM' or '-HH:MM'
                        //}
                        return next();
                    }
                    // timestamps: false
            },
            host: "localhost",
            logging: false,
            timezone: "-05:00"
        }
    ),
    db = {
        // Alumno: sequelize.import("./alumno"),
        CicloEscolar: sequelize.import("./cicloescolar"),
        Familiar: sequelize.import("./familiar"),
        Grado: sequelize.import("./grado"),
        Grupo: sequelize.import("./grupo"),
        GrupoAlumno: sequelize.import("./grupoalumno"),
        Nivel: sequelize.import("./nivel"),
        Materia: sequelize.import("./materia"),
        // Profesor: sequelize.import("./profesor"),
        Usuario: sequelize.import("./usuario")
            // Marca: sequelize.import('./marca'),
            // Modelo: sequelize.import('./modelo'),
            // ClienteMoto: sequelize.import('./cliente_moto'),
            // Servicio: sequelize.import('./servicio')
    };

// Foreign Keys
//db.Usuario.belongsTo(db.Familiar); // Will also add userId to Task model
//db.Familiar.belongsTo(db.Usuario, { foreignKey: "idAlumno" }); // Will add userId to Task model
//db.Familiar.Alumno = db.Familiar.hasMany(db.Usuario);
// db.Modelo.belongsTo(db.Marca, { foreignKey: 'idmarca' });

fs.readdirSync(__dirname)
    .filter(function(file) {
        return file.indexOf(".") !== 0 && file !== "context.js";
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if (db[modelName].options.hasOwnProperty("associate")) {
        db[modelName].options.associate(db);
    }
});

sequelize.sync();
module.exports = lodash.extend({
        sequelize: sequelize,
        Sequelize: Sequelize
    },
    db
);