// Libraries
var bodyParser = require("body-parser");
var colors = require("colors");
var express = require("express");

// Variable
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Funciones ayuda
String.isNullOrEmpty = function(value) {
    return (!value || value == undefined || value == "" || value.length == 0);
}

// Importación de rutas
var cicloEscolarRoutes = require("./routes/cicloescolar");
var alumnoRoutes = require("./routes/alumno");
var loginRoutes = require("./routes/login");
var materiaRoutes = require("./routes/materia");
var nivelRoutes = require("./routes/nivel");

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/cicloescolar", cicloEscolarRoutes);
app.use("/alumno", alumnoRoutes);
app.use("/login", loginRoutes);
app.use("/materia", materiaRoutes);
app.use("/nivel", nivelRoutes);

// Listen
app.listen(3000, () => {
    console.log("Express Server puerto 3024: " + "online".bgCyan.white);
});