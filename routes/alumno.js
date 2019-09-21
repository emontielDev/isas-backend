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

const UUID = require("uuid/v4");
var fs = require("fs");

const datatable = require("sequelize-datatables");
const Op = Sequelize.Op;
const rutaImagenes = "./avatars/alumnos";

// Obtener usuarios
app.get("/", (req, res) => {
    try {
        console.log(req.query);
        db.Usuario.findAll({
            attributes: ["id", "avatar", "nombre", "apaterno", "amaterno", "curp"],
            where: {
                perfil: "ALUMNO",
                [Op.or]: {
                    nombre: {
                        [Op.like]: `%${req.query.q}%`
                    },
                    apaterno: {
                        [Op.like]: `%${req.query.q}%`
                    },
                    amaterno: {
                        [Op.like]: `%${req.query.q}%`
                    }
                }
            }
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

    // db.Usuario.count({
    //     where: {
    //         correoElectronico: boddy.correoElectronico
    //     }
    // }).then(c => {
    //     if (c > 0) {
    //         return response.BadRequest(res, {
    //             mensaje: "Ya existe una materia registrada con la información proporcionada."
    //         });
    //     }

    //     db.Materia.create({
    //         clave: String.isNullOrEmpty(body.clave) ? null : body.clave,
    //         nombre: body.nombre,
    //         curricular: body.curricular
    //     }).then(entity => {
    //         return response.Created(res, entity.dataValues);
    //     });
    // });

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
                estadoCivil: String.isNullOrEmpty(body.adicionales.estadoCivil) ?
                    null :
                    body.adicionales.estadoCivil.trim().toLowerCase(),
                hijos: body.adicionales.hijos,
                trabaja: body.trabaja,
                empresa: String.isNullOrEmpty(body.adicionales.empresa) ?
                    null :
                    body.adicionales.empresa.trim().toUpperCase(),
                puesto: String.isNullOrEmpty(body.adicionales.puesto) ?
                    null :
                    body.adicionales.puesto.trim().toUpperCase(),
                telefonoTrabajo: String.isNullOrEmpty(
                        body.adicionales.telefonoTrabajo
                    ) ?
                    null :
                    body.adicionales.telefonoTrabajo,
                viveConP: body.adicionales.viveConP,
                viveConM: body.adicionales.viveConM,
                hHombres: body.adicionales.hermanos ?
                    body.adicionales.hhombres :
                    null,
                hMujeres: body.adicionales.hermano ? body.hmujeres : null,
                perfil: "ALUMNO"
            }, { transaction: t }).then(
                alumno => {
                    var promesas = [];

                    // if (!String.isNullOrEmpty(body.mama.correoElectronico)) {
                    //     password = generator.generate({
                    //         length: 10,
                    //         numbers: true,
                    //         uppercase: true
                    //     });
                    //     let nombre =
                    //         body.mama.nombre +
                    //         " " +
                    //         body.mama.apaterno +
                    //         " " +
                    //         body.mama.amaterno;
                    //     promesasEmail.push(
                    //         emailService.enviarDatosAcceso(
                    //             nombre.trim().toUpperCase(),
                    //             body.mama.correoElectronico.trim().toLowerCase(),
                    //             password
                    //         )
                    //     );
                    // }

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

                    // if (!String.isNullOrEmpty(body.papa.correoElectronico)) {
                    //     password = generator.generate({
                    //         length: 10,
                    //         numbers: true,
                    //         uppercase: true
                    //     });
                    //     let nombre =
                    //         body.papa.nombre +
                    //         " " +
                    //         body.papa.apaterno +
                    //         " " +
                    //         body.papa.amaterno;
                    //     promesasEmail.push(
                    //         emailService.enviarDatosAcceso(
                    //             nombre.trim().toUpperCase(),
                    //             body.papa.correoElectronico.trim().toLowerCase(),
                    //             password
                    //         )
                    //     );
                    // }

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
                },
                e => {
                    console.log(e);
                    if (e.name.indexOf("SequelizeUniqueConstraintError") > -1) {
                        return response.BadRequest(res, {
                            mensaje: `Ya existe una cuenta creada con el correo electrónico '${body.correoElectronico
                .trim()
                .toLowerCase()}'.`
                        });
                    }
                }
            );
        })
        .then(result => {
            return response.Created(res, result);
        })
        .catch(err => {
            console.log(err);
            return response.BadRequest(res, err);
        });
});

// Actualizar avatar
app.put("/:id/avatar", (req, res) => {
    var id = req.params.id;
    var body = req.body;
    try {
        db.Usuario.findOne({
            attributes: ["id", "avatar", "nombre", "apaterno", "amaterno"],
            where: {
                id: id,
                perfil: "ALUMNO"
            }
        }).then(alumno => {
            if (!alumno) {
                return response.NotFound(res, { mensaje: "No existe el alumno." });
            }

            var base64Data = String.isNullOrEmpty(body.avatar) ?
                null :
                body.avatar.indexOf("data:") > -1 ?
                body.avatar.split(",")[1] :
                null;

            if (!String.isNullOrEmpty(base64Data)) {
                var nombreImagen = `${UUID()}.jpg`;
                if (alumno.avatar) {
                    var rutaAnterior = `${rutaImagenes}/${alumno.avatar}`;
                    if (fs.existsSync(rutaAnterior)) {
                        fs.unlinkSync(rutaAnterior);
                    }
                }
                fs.writeFileSync(
                    `${rutaImagenes}/${nombreImagen}`,
                    base64Data,
                    "base64"
                );
            } else {
                return response.BadRequest(res, {
                    mensaje: "No a indicado la imagen para actualizar."
                });
            }
            return db.sequelize
                .transaction(t => {
                    return alumno
                        .update({
                            avatar: nombreImagen
                        }, {
                            fields: ["avatar"],
                            transaction: t
                        })
                        .then(alumnoEditado => {
                            if (!alumnoEditado) {
                                throw Exception("Error fatal");
                            }
                            return alumnoEditado;
                        });
                })
                .then(result => {
                    return response.Ok(res, result);
                })
                .catch(err => {
                    return response.BadRequest(res, err);
                });
        });
    } catch (e) {
        console.log(e);
        return response.Exception(res, e.toString());
    }
});

module.exports = app;