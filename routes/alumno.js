var express = require("express");
var app = express();
var Sequelize = require("sequelize");

// DataBase
var db = require("../models/context");

// Common
var response = require("../Common/response");
// Generador de contraseñas
var generator = require("generate-password");
// Encriptador de contraseñas
var bcryptjs = require("bcryptjs");
var emailService = require("../Common/mailer");

const datatable = require("sequelize-datatables");

// Obtener usuarios
app.get("/", (req, res) => {
    try {
        db.Usuario.findAll({
            where: { perfil: "ALUMNO" }
        }).then(result => {
            return response.Ok(res, result);
        });
    } catch (e) {
        return response.Exception(res, e);
    }
});

// Crear alumno
app.post("/", (req, res) => {
    var body = req.body;
    var promesasEmail = [];
    var password = "";
    //console.log(body);

    if (!String.isNullOrEmpty(body.correoElectronico)) {
        password = generator.generate({
            length: 10,
            numbers: true,
            uppercase: true
        });
        let nombre = body.nombre + " " + body.apaterno + " " + body.amaterno;
        promesasEmail.push(
            emailService.enviarDatosAcceso(
                nombre.trim().toUpperCase(),
                body.correoElectronico.trim().toLowerCase(),
                password
            )
        );
    }

    // emailService.enviarCorreo();

    db.sequelize
        .transaction(t => {
            return db.Usuario.create({
                nombre: body.nombre.trim().toUpperCase(),
                apaterno: body.apaterno.trim().toUpperCase(),
                amaterno: body.amaterno.trim().toUpperCase(),
                sexo: body.sexo,
                calle: body.domicilio.calle.trim().toUpperCase(),
                numeroInterior: String.isNullOrEmpty(body.domicilio.numInterior) ?
                    null :
                    body.domicilio.numInterior.trim().toUpperCase(),
                numeroExterior: body.domicilio.numeroExterior.trim().toUpperCase(),
                colonia: body.domicilio.colonia.trim().toUpperCase(),
                delegacion: body.domicilio.delegacion.trim().toUpperCase(),
                estado: body.domicilio.estado.trim().toUpperCase(),
                codigoPostal: body.domicilio.codigoPostal.trim().toUpperCase(),
                correoElectronico: String.isNullOrEmpty(body.correoElectronico) ?
                    null :
                    body.correoElectronico.trim().toLowerCase(),
                password: String.isNullOrEmpty(password) ?
                    null :
                    bcryptjs.hashSync(password),
                curp: body.curp.trim().toUpperCase(),
                fechaNacimiento: body.fechaNacimiento.trim().toUpperCase(),
                lugarNacimiento: body.lugarNacimiento.trim().toUpperCase(),
                nacionalidad: body.nacionalidad.trim().toUpperCase(),
                estadoCivil: body.estadoCivil,
                hijos: body.hijos,
                trabaja: body.trabaja,
                empresa: String.isNullOrEmpty(body.empresa) ?
                    null :
                    body.empresa.trim().toUpperCase(),
                puesto: String.isNullOrEmpty(body.puesto) ?
                    null :
                    body.puesto.trim().toUpperCase(),
                telefonoTrabajo: String.isNullOrEmpty(body.telefonoTrabajo) ?
                    null :
                    body.telefonoTrabajo,
                viveConP: body.viveConP,
                viveConM: body.viveConM,
                hHombres: body.hHombres,
                hMujeres: body.hMujeres,
                perfil: "ALUMNO"
            }, { transaction: t }).then(alumno => {
                var promesas = [];

                if (!String.isNullOrEmpty(body.mama.correoElectronico)) {
                    password = generator.generate({
                        length: 10,
                        numbers: true,
                        uppercase: true
                    });
                    let nombre =
                        body.mama.nombre +
                        " " +
                        body.mama.apaterno +
                        " " +
                        body.mama.amaterno;
                    promesasEmail.push(
                        emailService.enviarDatosAcceso(
                            nombre.trim().toUpperCase(),
                            body.mama.correoElectronico.trim().toLowerCase(),
                            password
                        )
                    );
                }

                promesas.push(
                    db.Usuario.create({
                        nombre: body.mama.nombre.trim().toUpperCase(),
                        apaterno: body.mama.apaterno.trim().toUpperCase(),
                        amaterno: String.isNullOrEmpty(body.mama.amaterno) ?
                            null :
                            body.mama.amaterno.trim().toUpperCase(),
                        telefono: body.mama.telefono.trim().toUpperCase(),
                        perfil: "TUTOR"
                    }, { transaction: t })
                );

                if (!String.isNullOrEmpty(body.papa.correoElectronico)) {
                    password = generator.generate({
                        length: 10,
                        numbers: true,
                        uppercase: true
                    });
                    let nombre =
                        body.papa.nombre +
                        " " +
                        body.papa.apaterno +
                        " " +
                        body.papa.amaterno;
                    promesasEmail.push(
                        emailService.enviarDatosAcceso(
                            nombre.trim().toUpperCase(),
                            body.papa.correoElectronico.trim().toLowerCase(),
                            password
                        )
                    );
                }

                promesas.push(
                    db.Usuario.create({
                        nombre: body.papa.nombre.trim().toUpperCase(),
                        apaterno: body.papa.apaterno.trim().toUpperCase(),
                        amaterno: String.isNullOrEmpty(body.papa.amaterno) ?
                            null :
                            body.papa.amaterno.trim().toUpperCase(),
                        telefono: body.papa.telefono.trim().toUpperCase(),
                        perfil: "TUTOR"
                    }, { transaction: t })
                );

                return Promise.all(promesas).then(familiares => {
                    //console.log(familiares);
                    var asignarFamiliar = [];
                    for (var i = 0; i < familiares.length; i++) {
                        asignarFamiliar.push(
                            db.Familiar.create({
                                idAlumno: alumno.dataValues.id,
                                idTutor: familiares[i].id
                            }, { transaction: t })
                        );
                    }
                    return Promise.all(asignarFamiliar).then(o => {
                        console.log(promesasEmail.length);
                        if (promesasEmail.length > 0) {
                            return Promise.all(promesasEmail).then(o => {
                                //return o;
                                return alumno.dataValues;
                            });
                        }
                        return alumno.dataValues;
                    });
                });
            });
        })
        .then(result => {
            return response.Created(res, result);
        })
        .catch(err => {
            console.log(err);
            return response.BadRequest(res, err);
        });
});

() => {
    return sequelize.transaction().then(t => {
        return User.create({
                firstName: "Bart",
                lastName: "Simpson"
            }, { transaction: t })
            .then(user => {
                return user.addSibling({
                    firstName: "Lisa",
                    lastName: "Simpson"
                }, { transaction: t });
            })
            .then(() => {
                return t.commit();
            })
            .catch(err => {
                return t.rollback();
            });
    });

    return sequelize
        .transaction(t => {
            // chain all your queries here. make sure you return them.
            return User.create({
                firstName: "Abraham",
                lastName: "Lincoln"
            }, { transaction: t }).then(user => {
                return user.setShooter({
                    firstName: "John",
                    lastName: "Boothe"
                }, { transaction: t });
            });
        })
        .then(result => {
            // Transaction has been committed
            // result is whatever the result of the promise chain returned to the transaction callback
        })
        .catch(err => {
            // Transaction has been rolled back
            // err is whatever rejected the promise chain returned to the transaction callback
        });
};

module.exports = app;