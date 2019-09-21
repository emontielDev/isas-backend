var express = require("express");
var app = express();

const path = require("path");
const fs = require("fs");

// Common
var response = require("../Common/response");

app.get("/", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "../assets/no-img.jpg"));
});

// Imagenes de usuarios
app.get("/:tipo/:img", (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    // Tipos de colección
    var tiposValidos = ["alumnos", "profesores"];
    if (tiposValidos.indexOf(tipo) < 0) {
        return response.NotFound(res, `No se encontró el repositorio '${tipo}'.`);
    }

    var pathImagen = path.resolve(__dirname, `../avatars/${tipo}/${img}`);
    // console.log(pathImagen);
    if (!fs.existsSync(pathImagen)) {
        pathImagen = path.resolve(__dirname, "../assets/no-img.jpg");
    }

    res.sendFile(pathImagen);
});

module.exports = app;