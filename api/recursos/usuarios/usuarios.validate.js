const Joi = require("@hapi/joi");

const bluePrintUsuario = Joi.object().keys({
  nombre: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const bluePrintLogin = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const validarUsuario = (req, res, next) => {
  const resultado = bluePrintUsuario.validate(req.body, {
    abortEarly: false,
    convert: false,
  });
  if (resultado.error === undefined) {
    next();
  } else {
    let mensaje = resultado.error.details.reduce((mostrar, mensaje) => {
      return mostrar + `\n[${mensaje.message}]`;
    }, "");
    res.status(400);
    res.send(mensaje);
  }
};

const validarLogin = (req, res, next) => {
  const resultado = bluePrintLogin.validate(req.body, {
    abortEarly: false,
    convert: false,
  });
  if (resultado.error === undefined) {
    next();
  } else {
    let mensaje = resultado.error.details.reduce((mostrar, mensaje) => {
      return mostrar + `\n[${mensaje.message}]`;
    }, "");
    res.status(400);
    res.send(mensaje);
  }
};

module.exports = {
  validarUsuario,
  validarLogin,
};
