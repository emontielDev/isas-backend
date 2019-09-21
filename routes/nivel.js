var express = require("express");
var app = express();
var Sequelize = require("sequelize");
// Db Context
var db = require("../models/context");

// Common
var response = require("../Common/response");

const Op = db.Sequelize.Op;

// Obtener todos los niveles
app.get("/", (req, res) => {
    try {
        db.Nivel.findAll({
            attributes: ["id", "nombre", "evaluaciones"],
            order: [
                ["nombre", "ASC"]
            ],
            where: {
                [Op.or]: {
                    nombre: {
                        [Op.like]: `%${req.query.q || ""}%`
                    }
                }
            }
        }).then(result => {
            return response.Ok(res, result);
        });
    } catch (e) {
        console.log(e);
        return response.Exception(res, e.toString());
    }
});

// Obtener nivel por id
app.get("/:id", (req, res) => {
    var id = req.params.id;
    try {
        db.Nivel.findOne({
            attributes: ["id", "nombre", "evaluaciones"],
            where: {
                id: id
            }
        }).then(result => {
            if (!result) {
                return response.NotFound(res, {
                    mensaje: `No existe un nivel con el identificador ${id}`
                });
            }
            return response.Ok(res, result);
        });
    } catch (e) {
        console.log(e);
        return response.Exception(res, e.toString());
    }
});

// Obtener grados de un cierto nivel
app.get("/:id/grados", (req, res) => {
    var id = req.params.id;
    try {
        db.Grado.findAll({
            attributes: ["id", "nombre"],
            where: {
                idNivel: id,
                nombre: {
                    [Op.like]: `%${req.query.q || ""}%`
                }
            }
        }).then(result => {
            return response.Ok(res, result);
        });
    } catch (e) {
        console.log(e);
        return response.Exception(res, e.toString());
    }
});

// Crear nuevo nivel.
app.post("/", (req, res) => {
    var body = req.body;
    try {
        db.Nivel.count({
            where: { nombre: body.nombre }
        }).then(c => {
            if (c > 0) {
                return response.BadRequest(res, {
                    mensaje: "Ya existe un nivel registrado con la información proporcionada."
                });
            }

            db.Nivel.create({
                nombre: body.nombre,
                evaluaciones: body.evaluaciones
            }).then(entity => {
                return response.Created(res, entity.dataValues);
            });
        });
    } catch (e) {
        return response.Exception(res, e);
    }
});
// Actualizar datos del nivel
app.put("/:id", (req, res) => {
    var id = req.params.id;
    var body = req.body;

    try {
        db.Nivel.findOne({ where: { id: id } }).then(nivel => {
            if (!nivel) {
                return response.NotFound(
                    res,
                    "El nivel no existe, es posible que se haya sido eliminado del sistema."
                );
            }

            db.Nivel.findOne({
                where: { nombre: body.nombre, id: {
                        [Op.ne]: id } }
            }).then(nivelRepetido => {
                if (nivelRepetido) {
                    return response.BadRequest(res, {
                        mensaje: `Ya existe un nivel con el nombre '${body.nombre}', por favor verifique.`
                    });
                }

                nivel
                    .update({
                        nombre: body.nombre,
                        evaluaciones: body.evaluaciones
                    })
                    .then(flag => {
                        return response.Ok(res, flag);
                    });
            });
        });
    } catch (e) {
        return response.Exception(res, e.toString());
    }
});

module.exports = app;