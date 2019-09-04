var express = require("express");
var app = express();
var Sequelize = require("sequelize");
// Db Context
var db = require("../models/context");

// Common
var response = require("../Common/response");

const datatable = require("sequelize-datatables");
const Op = Sequelize.Op;

// Obtener todas las materias
app.post("/", (req, res) => {
    try {
        //console.log(req.body.params);
        datatable(db.Materia, req.body.params, {}).then(result => {
            // result is response for datatables
            return res.json(result);
        });
    } catch (e) {
        return response.Exception(res, e);
    }
});

// Crear nueva materia.
app.post("/crear", (req, res) => {
    var body = req.body;
    try {
        var arr = [];

        arr.push({ nombre: body.nombre });

        if (!String.isNullOrEmpty(body.clave)) {
            arr.push({ clave: body.clave });
        }

        db.Materia.count({
            where: {
                [Op.or]: arr
            }
        }).then(c => {
            if (c > 0) {
                return response.BadRequest(res, {
                    mensaje: "Ya existe una materia registrada con la información proporcionada."
                });
            }

            db.Materia.create({
                clave: String.isNullOrEmpty(body.clave) ? null : body.clave,
                nombre: body.nombre,
                curricular: body.curricular
            }).then(entity => {
                return response.Created(res, entity.dataValues);
            });
        });
    } catch (e) {
        return response.Exception(res, e);
    }
});
// Actualizar datos de la materia
app.put("/:id", (req, res) => {
    var id = req.params.id;
    var body = req.body;

    try {
        db.Materia.findOne({ where: { id: id } }).then(entity => {
            if (!entity) {
                return response.NotFound(
                    res,
                    "El usuario no existe, es posible que se haya sido eliminado del sistema."
                );
            }

            entity
                .update({
                    clave: String.isNullOrEmpty(body.clave) ? null : body.clave,
                    nombre: body.nombre,
                    curricular: body.curricular
                })
                .then(flag => {
                    return response.Ok(res, flag);
                });
        });
    } catch (e) {
        return response.Exception(res, e);
    }
});

module.exports = app;