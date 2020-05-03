//ACCESO A LAS VARIABLES DE ENTORNO
require("dotenv").config();
//CONFIGURACION SEGUN EL AMBIENTE
const config = require("./config");
//CONEXION CON LA BASE DE DATOS
require("./api/libs/db");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

//IMPORTACION DE LA ESTRATEGIA DE AUTENTICACIÓN
const authJWT = require("./api/libs/auth");

const cors = require("cors");

//RECURSOS DE LA API
const {
  usuariosRouter,
  proyectosRouter,
  tareasRouter,
} = require("./api/recursos");

//MANEJADORES DE ERRORES
const {
  erroresDesarrollo,
  erroresProduccion,
} = require("./api/libs/handleError");

//CREACION DEL SERVIDOR
const app = express();

//HABILITAR CORS
app.use(cors());

//REQUEST ACEPTA FORMATO JSON
app.use(bodyParser.json());

//ASIGNACION DE LA ESTRATEGIA DE AUTENTICACION
passport.use(authJWT);
//ACTIVACION DE PASSPORT
app.use(passport.initialize());

//RUTAS DE LA API
app.use("/api/usuarios", usuariosRouter);
app.use("/api/proyectos", proyectosRouter);
app.use("/api/tareas", tareasRouter);

//MANEJANDO LOS ERRORES
if (config.ambiente === "production") {
  app.use(erroresProduccion);
} else {
  app.use(erroresDesarrollo);
}

//LEVANTANDO EL SERVIDOR
const server = app.listen(config.port, "0.0.0.0", () => {
  console.log(`Corriendo en el puerto ${config.port}`);
});

module.exports = {
  app,
  server,
};
