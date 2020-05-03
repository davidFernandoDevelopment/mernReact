const express = require("express");
const passport = require("passport");

const {
  crearProyecto,
  obtenerProyectos,
  obtenerProyecto,
  actualizarProyecto,
  proyectoExiste,
  eliminarProyecto,
} = require("./proyectos.controller");
const { validarProyecto } = require("./proyectos.validate");

const { procesarErrores } = require("../../libs/handleError");

const jwtAuthenticate = passport.authenticate("jwt", { session: false });

const proyectosRouter = express.Router();

proyectosRouter
  .route("/")
  .get(
    jwtAuthenticate,
    procesarErrores(async (req, res) => {
      const proyectos = await obtenerProyectos(req.user._id);
      res.status(200);
      res.send(proyectos);
    })
  )
  .post(
    [jwtAuthenticate, validarProyecto],
    procesarErrores(async (req, res) => {
      const proyectoCreado = await crearProyecto(req.body, req.user._id);
      res.status(201);
      res.send({ proyectoCreado });
    })
  );

proyectosRouter
  .route("/:id")
  .get(
    procesarErrores(async (req, res) => {
      const { respuesta } = await proyectoExiste(req.params.id);
      if (respuesta) {
        const proyecto = await obtenerProyecto(req.params.id);
        res.status(200);
        res.send(proyecto);
      } else {
        res.status(404);
        res.send({ message: `El proyecto con id ${req.params.id} no existe` });
        return;
      }
    })
  )
  .put(
    [jwtAuthenticate, validarProyecto],
    procesarErrores(async (req, res) => {
      const { id } = req.params;
      const { respuesta, autor } = await proyectoExiste(id);
      if (!respuesta) {
        res.status(404);
        res.send({ message: `El proyecto con id ${id} no existe` });
        return;
      }
      if (autor.toString() === req.user._id.toString()) {
        const proyectoModificado = await actualizarProyecto(
          id,
          req.body.nombre
        );
        res.status(201);
        res.send({ proyectoModificado });
      } else {
        res.status(409);
        res.send({ message: "Tu no eres dueño de este proyecto" });
      }
    })
  )
  .delete(
    jwtAuthenticate,
    procesarErrores(async (req, res) => {
      const { id } = req.params;
      const { respuesta, autor } = await proyectoExiste(id);
      if (!respuesta) {
        res.status(404);
        res.send({ message: `El proyecto con id ${id} no existe` });
        return;
      }
      if (autor.toString() === req.user._id.toString()) {
        await eliminarProyecto(id);
        res.status(200);
        res.send({ message: "Proyecto eliminado correctamente" });
      } else {
        res.status(409);
        res.send({ message: "Tu no eres dueño de este proyecto" });
      }
    })
  );

module.exports = proyectosRouter;
