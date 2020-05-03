const Joi = require("@hapi/joi");

const bluePrintTarea = Joi.object().keys({
  nombre: Joi.string().trim().required(),
  estado: Joi.boolean().default(false),
  proyecto: Joi.string().required(),
});

const validarTarea = (req, res, next) => {
  const respuesta = bluePrintTarea.validate(req.body, {
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
  validarTarea,
};
