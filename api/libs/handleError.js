exports.procesarErrores = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};

exports.erroresDesarrollo = (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    stack: err.stack,
    status: err.status,
  });
};

exports.erroresProduccion = (err, req, res, next) => {
  req.status(err.status || 500);
  res.send({
    message: err.message,
  });
};
