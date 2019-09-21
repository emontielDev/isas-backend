var express = require("express");
var app = express();
var Sequelize = require("sequelize");
// Db Context
var db = require("../models/context");

// Common
var response = require("../Common/response");

const datatable = require("sequelize-datatables");

// Obtener todos los grados de acuerdo al nivel.
// app.get("/:idNivel", (req, res) => {
//     try {
//         db.Grado.findAll({
//                 where: {
//                     idNivel: req.params.idNivel,
//                 }
//             })
//             .then(entities => {
//                 return response.Ok(res, entities);
//             });
//     } catch (e) {
//         return response.Exception(res, e);
//     }
// });

// Crear nuevo grado.
app.post("/", (req, res) => {
    var body = req.body;
    try {
        db.Grado.count({
            where: { idNivel: body.nivel.id, nombre: body.nombre }
        }).then(c => {
            if (c > 0) {
                return response.BadRequest(res, {
                    mensaje: `Ya existe un grado con el nombre '${body.nombre}', por favor verifique.`
                });
            }

            db.Grado.create({ idNivel: body.nivel.id, nombre: body.nombre }).then(
                entity => {
                    return response.Created(res, entity.dataValues);
                }
            );
        });
    } catch (e) {
        return response.Exception(res, e);
    }
});

// Actualizar datos del ciclo escolar
app.put("/:id", (req, res) => {
    var id = req.params.id;
    var body = req.body;

    try {
        db.Grado.findOne({ where: { id: id } }).then(entity => {
            if (!entity) {
                return response.NotFound(
                    res,
                    "El ciclo escolar no existe, es posible que se haya sido eliminado del sistema."
                );
            }

            entity
                .update({
                    nombre: body.nombre,
                    fechaInicio: body.fechainicio,
                    fechaFin: body.fechafin
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