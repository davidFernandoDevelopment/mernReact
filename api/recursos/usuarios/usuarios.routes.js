const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const config = require("../../../config");

const jwtAuthenticate = passport.authenticate("jwt", { session: false });

const {
  crearUsuario,
  usuarioExiste,
  obtenerUsuario,
} = require("./usuarios.controller");
const { validarUsuario, validarLogin } = require("./usuarios.validate");
const { UsuarioExiste, CredencialesIncorrectas } = require("./usuarios.error");
const { procesarErrores } = require("../../libs/handleError");

const usuariosRouter = express.Router();

usuariosRouter.post(
  "/",
  validarUsuario,
  procesarErrores((req, res) => {
    const usuario = req.body;
    return usuarioExiste({
      email: usuario.email,
      nombre: usuario.nombre,
    })
      .then((respuesta) => {
        if (respuesta) {
          console.log(`Email  o username ya existen en la base de datos`);
          throw new UsuarioExiste();
        }
        return bcrypt.hash(usuario.password, 10);
      })
      .then((hash) => {
        return crearUsuario(usuario, hash).then((nuevoUsuario) => {
          const token = jwt.sign(
            { usuarioRegistrado: nuevoUsuario },
            config.jwt.secretOrKey,
            {
              expiresIn: config.jwt.expiracion,
            }
          );
          res.status(201);
          res.send({ nuevoUsuario, token });
        });
      });
  })
);

usuariosRouter.post(
  "/login",
  validarLogin,
  procesarErrores((req, res) => {
    const login = req.body;
    let usuarioRegistrado;
    return obtenerUsuario({ email: login.email })
      .then((usuario) => {
        if (!usuario) {
          throw new CredencialesIncorrectas();
        }
        usuarioRegistrado = usuario;
        return bcrypt.compare(login.password, usuario.password);
      })
      .then((respuesta) => {
        if (respuesta) {
          const token = jwt.sign(
            { usuarioRegistrado },
            config.jwt.secretOrKey,
            {
              expiresIn: config.jwt.expiracion,
            }
          );
          res.status(200);
          res.send({ usuarioRegistrado, token });
        } else {
          throw new CredencialesIncorrectas();
        }
      });
  })
);

usuariosRouter.route("/whoami").get(jwtAuthenticate, (req, res) => {
  res.send(protegerCampos(req.user));
});

const protegerCampos = (usuario) => {
  return {
    _id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
  };
};

module.exports = usuariosRouter;
