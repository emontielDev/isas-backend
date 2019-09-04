var express = require("express");
var app = express();

// DataBase
var db = require("../models/context");

// Common
var response = require("../Common/response");

// Login de usuario
app.post("/", (req, res, next) => {
    var body = req.body;
    db.Alumno.findOne({ where: { clave: body.clave } }).then(alumno => {
        if (!alumno) return response.UserNotFound(res);

        return response.Ok(res, { usuario: alumno, token: "token" });
    });
});

// Restablecer contraseña
app.post("/forgot", (req, res, next) => {
    var body = req.body;
});

// Resetear password
app.put("reset", (req, res, next) => {
    var body = req.body;
});

module.exports = app;