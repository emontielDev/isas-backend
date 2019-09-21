var express = require("express");
var app = express();

// DataBase
var db = require("../models/context");

// Common
var response = require("../Common/response");
// Generador de contraseñas
var generator = require("generate-password");
// Encriptador de contraseñas
var bcryptjs = require("bcryptjs");
// Generador GUID
const UUID = require("uuid/v4");

var emailService = require("../Common/mailer");

var fs = require("fs");

const Op = db.Sequelize.Op;
const rutaImagenes = "./avatars/profesores";

// Obtener profesores
app.get("/", (req, res) => {
    try {
        db.Usuario.findAll({
            attributes: [
                "id",
                "avatar",
                "nombre",
                "apaterno",
                "amaterno", [
                    db.Sequelize.fn(
                        "date_format",
                        db.Sequelize.col("fechaNacimiento"),
                        "%Y-%m-%d"
                    ),
                    "fechaNacimiento"
                ],
                "sexo",
                "correoElectronico"
            ],
            order: [
                ["nombre", "ASC"],
                ["apaterno", "ASC"],
                ["amaterno", "ASC"]
            ],
            where: {
                perfil: "PROFESOR",
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

// Crear profesor
app.post("/", (req, res) => {
    var body = req.body;
    try {
        var base64Data = String.isNullOrEmpty(body.avatar) ?
            null :
            body.avatar.split(",")[1];
        if (!String.isNullOrEmpty(base64Data)) {
            var nombreImagen = `${UUID()}.jpg`;
            fs.writeFileSync(`${rutaImagenes}/${nombreImagen}`, base64Data, "base64");
        }

        return db.sequelize
            .transaction(t => {
                return db.Usuario.create({
                    avatar: nombreImagen,
                    nombre: body.nombre.trim().toUpperCase(),
                    apaterno: body.apaterno.trim().toUpperCase(),
                    amaterno: String.isNullOrEmpty(body.amaterno) ?
                        null :
                        body.amaterno.trim().toUpperCase(),
                    fechaNacimiento: body.fechaNacimiento.trim(),
                    sexo: body.sexo,
                    correoElectronico: String.isNullOrEmpty(body.correoElectronico) ?
                        null :
                        body.correoElectronico.trim().toLowerCase(),
                    perfil: "PROFESOR"
                }, { transaction: t }).then(profesor => {
                    return profesor;
                });
            })
            .then(result => {
                //         var nombre = `${result.nombre} ${result.apaterno} ${result.amaterno ||
                //   ""}`.trim();
                //         if (result.correoElectronico) {
                //             emailService.enviarDatosAcceso(
                //                 nombre,
                //                 result.correoElectronico.trim().toLowerCase(),
                //                 password
                //             );
                //         }
                return response.Created(res, result);
            })
            .catch(err => {
                return response.BadRequest(res, err);
            });
    } catch (e) {
        return response.Exception(res, e.toString());
    }
});

// Actualizar datos y avatar del profesor.
app.put("/:id", (req, res) => {
    var id = req.params.id;
    var body = req.body;
    try {
        //,
        db.Usuario.findOne({
            attributes: [
                "id",
                "avatar",
                "nombre",
                "apaterno",
                "amaterno", [
                    db.Sequelize.fn(
                        "date_format",
                        db.Sequelize.col("fechaNacimiento"),
                        "%Y-%m-%d"
                    ),
                    "fechaNacimiento"
                ],
                "sexo",
                "correoElectronico"
            ],
            where: {
                id: id,
                perfil: "PROFESOR"
            }
        }).then(profesor => {
            if (!profesor) {
                return response.NotFound(res, { mensaje: "No existe el profesor." });
            }
            var camposActualizar = [
                "nombre",
                "apaterno",
                "amaterno",
                "fechaNacimiento",
                "sexo",
                "correoElectronico"
            ];
            var base64Data = String.isNullOrEmpty(body.avatar) ?
                null :
                body.avatar.indexOf("data:") > -1 ?
                body.avatar.split(",")[1] :
                null;
            if (!String.isNullOrEmpty(base64Data)) {
                var nombreImagen = `${UUID()}.jpg`;
                if (profesor.avatar) {
                    var rutaAnterior = `${rutaImagenes}/${profesor.avatar}`;
                    if (fs.existsSync(rutaAnterior)) {
                        fs.unlinkSync(rutaAnterior);
                    }
                }
                fs.writeFileSync(
                    `${rutaImagenes}/${nombreImagen}`,
                    base64Data,
                    "base64"
                );
                camposActualizar.push("avatar");
            }
            // return profesor;
            return db.sequelize
                .transaction(t => {
                    //return
                    return profesor
                        .update({
                            avatar: nombreImagen,
                            nombre: body.nombre.trim().toUpperCase(),
                            apaterno: body.apaterno.trim().toUpperCase(),
                            amaterno: String.isNullOrEmpty(body.amaterno) ?
                                null :
                                body.amaterno.trim().toUpperCase(),
                            fechaNacimiento: body.fechaNacimiento.trim(),
                            sexo: body.sexo,
                            correoElectronico: String.isNullOrEmpty(body.correoElectronico) ?
                                null :
                                body.correoElectronico.trim().toLowerCase()
                        }, {
                            fields: camposActualizar,
                            transaction: t
                        })
                        .then(profesorEditado => {
                            return profesorEditado;
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
        return response.Exception(res, e.toString());
    }
});

// Actualizar avatar
app.put("/:id/avatar", (req, res) => {
    var id = req.params.id;
    var body = req.body;
    try {
        db.Usuario.findOne({
            attributes: [
                "id",
                "avatar",
                "nombre",
                "apaterno",
                "amaterno", [
                    db.Sequelize.fn(
                        "date_format",
                        db.Sequelize.col("fechaNacimiento"),
                        "%Y-%m-%d"
                    ),
                    "fechaNacimiento"
                ],
                "sexo",
                "correoElectronico"
            ],
            where: {
                id: id,
                perfil: "PROFESOR"
            }
        }).then(profesor => {
            if (!profesor) {
                return response.NotFound(res, { mensaje: "No existe el profesor." });
            }

            var base64Data = String.isNullOrEmpty(body.avatar) ?
                null :
                body.avatar.indexOf("data:") > -1 ?
                body.avatar.split(",")[1] :
                null;

            if (!String.isNullOrEmpty(base64Data)) {
                var nombreImagen = `${UUID()}.jpg`;
                if (profesor.avatar) {
                    var rutaAnterior = `${rutaImagenes}/${profesor.avatar}`;
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
                    return profesor
                        .update({
                            avatar: nombreImagen
                        }, {
                            fields: ["avatar"],
                            transaction: t
                        })
                        .then(profesorEditado => {
                            if (!profesorEditado) {
                                throw Exception("Error fatal");
                            }
                            return profesorEditado;
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