// Libraries
var bodyParser = require("body-parser");
var colors = require("colors");
var express = require("express");

// Variable
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(bodyParser.json({ limit: "10mb", extended: false }));

// Funciones ayuda
String.isNullOrEmpty = function(value) {
    return !value || value == undefined || value == "" || value.length == 0;
};

// Importación de rutas
var cicloEscolarRoutes = require("./routes/cicloescolar");
var gradoRoutes = require("./routes/grado");
var grupoRoutes = require("./routes/grupo");
var alumnoRoutes = require("./routes/alumno");
var avatarRoutes = require("./routes/avatar");
var loginRoutes = require("./routes/login");
var materiaRoutes = require("./routes/materia");
var nivelRoutes = require("./routes/nivel");
var profesorRoutes = require("./routes/profesor");

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/ciclo-escolar", cicloEscolarRoutes);
app.use("/grado", gradoRoutes);
app.use("/grupo", grupoRoutes);
app.use("/alumno", alumnoRoutes);
app.use("/avatar", avatarRoutes);
app.use("/login", loginRoutes);
app.use("/materia", materiaRoutes);
app.use("/nivel", nivelRoutes);
app.use("/profesor", profesorRoutes);

// Listen
app.listen(3000, () => {
    console.log("Express Server puerto 3024: " + "online".bgCyan.white);
});