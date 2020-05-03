const Usuario = require("./usuarios.model");

const crearUsuario = (usuario, hash) => {
  return new Usuario({
    ...usuario,
    password: hash,
  }).save();
};

const usuarioExiste = ({ email, nombre }) => {
  return new Promise((resolve, reject) => {
    Usuario.find()
      .or([{ email }, { nombre }])
      .then((resultado) => {
        resolve(resultado.length > 0);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const obtenerUsuario = ({ email, nombre, id }) => {
  if (email) {
    return consultarQuery({ email });
  } else if (nombre) {
    return consultarQuery({ nombre });
  } else if (id) {
    return consultarQuery({ _id: id });
  } else {
    throw new Error("Para obtener usuario debe pasar el email, nombre o id");
  }
};

const consultarQuery = (query) => {
  return Usuario.findOne(query);
};

module.exports = {
  crearUsuario,
  usuarioExiste,
  obtenerUsuario,
};
