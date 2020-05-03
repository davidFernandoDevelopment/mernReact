const express = require("express");
const passport = require("passport");

const { procesarErrores } = require("../../libs/handleError");
const { validarTarea } = require("./tareas.validate");

const {
  agregarTarea,
  obtenerTareas,
  existeTarea,
  actualizarTarea,
  eliminarTarea,
} = require("./tareas.controller");
const {
  proyectoExiste,
  obtenerProyecto,
} = require("../proyectos/proyectos.controller");

const jwtAutenticate = passport.authenticate("jwt", { session: false });

const tareasRouter = express.Router();

tareasRouter
  .route("/")
  .get(
    jwtAutenticate,
    procesarErrores(async (req, res) => {
      const { proyecto: id } = req.query;
      console.log("req.query: ", id);
      const { respuesta, autor } = await proyectoExiste(id);
      if (!respuesta) {
        res.status(400);
        res.send({ mensaje: `Proyecto con id [${id}] no existe` });
        return;
      }
      if (autor.toString() === req.user._id.toString()) {
        const tareas = await obtenerTareas(id);
        res.status(200);
        res.send(tareas);
      } else {
        res.status(409);
        res.send({
          mensaje:
            "Tu no eres dueño del proyecto, solo puedes ver tus proyectos",
        });
      }
    })
  )
  .post(
    [jwtAutenticate, validarTarea],
    procesarErrores(async (req, res) => {
      const { proyecto } = req.body;
      const { respuesta, autor } = await proyectoExiste(proyecto);
      if (!respuesta) {
        res.status(400);
        res.send({ mensaje: `Proyecto con id [${proyecto}] no existe` });
        return;
      }
      if (autor.toString() === req.user._id.toString()) {
        const nuevaTarea = await agregarTarea(req.body);
        res.status(201);
        res.send({ nuevaTarea });
      } else {
        res.status(409);
        res.send({
          mensaje: "Tu no eres dueño del proyecto",
        });
      }
    })
  );

tareasRouter
  .route("/:id")
  .put(
    [jwtAutenticate, validarTarea],
    procesarErrores(async (req, res) => {
      const { id } = req.params;
      const { respuesta, idProyecto, tarea } = await existeTarea(id);
      let proyecto;
      if (!respuesta) {
        res.status(400);
        res.send({ mensaje: `Tarea con id [${id}] no existe` });
        return;
      }
      proyecto = await obtenerProyecto(idProyecto);
      if (proyecto.autor.toString() === req.user._id.toString()) {
        const task = Object.assign(tarea, req.body);
        const tareaActualizada = await actualizarTarea(id, task);
        res.status(201);
        res.send({
          tareaActualizada,
        });
      } else {
        res.status(409);
        res.send({
          mensaje:
            "Tu no eres dueño del proyecto, por ende no puedes modificar las tareas",
        });
      }
    })
  )
  .delete(
    jwtAutenticate,
    procesarErrores(async (req, res) => {
      const { id } = req.params;
      const { idProyecto, respuesta, tarea } = await existeTarea(id);
      let proyecto;
      if (!respuesta) {
        res.status(400);
        res.send({ mensaje: `Tarea con id [${id}] no existe` });
        return;
      }
      proyecto = await obtenerProyecto(idProyecto);
      if (proyecto.autor.toString() === req.user._id.toString()) {
        await eliminarTarea(id);
        res.status(200);
        res.send({
          mensaje: "Tarea eliminada correctamente",
        });
      } else {
        res.status(409);
        res.send({
          mensaje:
            "Tu no eres dueño del proyecto, por ende no puedes modificar las tareas",
        });
      }
    })
  );

module.exports = tareasRouter;
