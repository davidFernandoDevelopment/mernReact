const passportJWT = require("passport-jwt");

const config = require("../../config");

const { obtenerUsuario } = require("../recursos/usuarios/usuarios.controller");

const jwtOptions = {
  secretOrKey: config.jwt.secretOrKey,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = new passportJWT.Strategy(jwtOptions, (payload, done) => {
  obtenerUsuario({ id: payload.usuarioRegistrado._id })
    .then((usuario) => {
      if (!usuario) {
        console.log(
          `Usuario con ${payload.usuarioRegistrado._id} no existe ...`
        );
        next(null, false);
        return;
      }
      done(null, usuario);
    })
    .catch((error) => {
      console.log(error.message);
      done(error);
    });
});
