var express = require("express");
var app = express();
var Sequelize = require("sequelize")
// Db Context
var db = require("../models/context");

// Common
var response = require("../Common/response");

const datatable = require("sequelize-datatables");
const model = require("../models/nivel"); // Sequelize model
const Op = Sequelize.Op;

// Obtener todos los niveles
app.get("/", (req, res) => {
    try {
        datatable(db.Nivel, req.query, {}).then(result => {
            // result is response for datatables
            return res.json(result);
        });
        // return response.Ok(res, {});
    } catch (e) {
        return response.Exception(res, e);
    }
});

// Crear nuevo nivel.
app.post("/", (req, res) => {
    var body = req.body;
    try {

        db.Nivel.count({
            where: { nombre: body.nombre }
        })
        .then(c=> {
            if (c > 0) {
                return response.BadRequest(res, { mensaje: 'Ya existe un nivel registrada con la información proporcionada.'})
            }

            db.Nivel.create({nombre: body.nombre, evaluaciones: body.evaluaciones})
            .then(entity => {
                return response.Created(res, entity.dataValues);
            });
        });
    } catch (e) {
        return response.Exception(res, e);
    }
});
// Actualizar datos del nivel
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    try {
        db.Nivel.findOne({ where: { id: id } })
        .then(entity => {
            if (!entity) {
                return response.NotFound(res, 'El nivel no existe, es posible que se haya sido eliminado del sistema.');
            }

            entity.update({
                nombre: body.nombre,
                evaluaciones: body.evaluaciones
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