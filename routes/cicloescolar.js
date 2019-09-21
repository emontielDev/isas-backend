var express = require("express");
var app = express();
var Sequelize = require("sequelize")
    // Db Context
var db = require("../models/context");

// Common
var response = require("../Common/response");

const datatable = require("sequelize-datatables");

// Obtener todos los ciclo escolares
app.get("/", (req, res) => {
    try {
        db.CicloEscolar.findAll({
                order: [
                    ['id', 'DESC']
                ]
            })
            .then(entities => {
                return response.Ok(res, entities);
            });
    } catch (e) {
        return response.Exception(res, e);
    }
});

// Crear nuevo ciclo escolar.
app.post("/", (req, res) => {
    var body = req.body;
    try {
        db.CicloEscolar.count({
                where: { nombre: body.nombre }
            })
            .then(c => {
                if (c > 0) {
                    return response.BadRequest(res, { mensaje: 'Ya existe un ciclo escolar registrado con la información proporcionada.' })
                }

                db.CicloEscolar.create({ nombre: body.nombre, fechaInicio: body.fechainicio, fechaFin: body.fechafin })
                    .then(entity => {
                        return response.Created(res, entity.dataValues);
                    });
            });
    } catch (e) {
        return response.Exception(res, e);
    }
});

// Actualizar datos del ciclo escolar
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    try {
        db.CicloEscolar.findOne({ where: { id: id } })
            .then(entity => {
                if (!entity) {
                    return response.NotFound(res, 'El ciclo escolar no existe, es posible que se haya sido eliminado del sistema.');
                }

                entity.update({
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