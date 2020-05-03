const Joi = require("@hapi/joi");

const bluePrintProyecto = Joi.object().keys({
  nombre: Joi.string().trim().required(),
  autor: Joi.object().required(),
});

const validarProyecto = (req, res, next) => {
  const proyecto = {
    ...req.body,
    autor: req.user._id,
  };
  const respuesta = bluePrintProyecto.validate(proyecto, {
    abortEarly: false,
    convert: false,
  });
  if (respuesta.error === undefined) {
    next();
  } else {
    let mensaje = respuesta.error.details.reduce((mostrar, mensaje) => {
      return mostrar + `\n[${mensaje.message}]`;
    }, "");
    res.status(400);
    res.send(mensaje);
  }
};

module.exports = {
  validarProyecto,
};
