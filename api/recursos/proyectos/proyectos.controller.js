const Proyecto = require("./proyectos.model");

const crearProyecto = (proyecto, autor) => {
  return new Proyecto({
    ...proyecto,
    autor,
  }).save();
};

const obtenerProyectos = (idUsuario) => {
  return Proyecto.find({ autor: idUsuario });
};

const obtenerProyecto = (idProyecto) => {
  return Proyecto.findById(idProyecto);
};

const actualizarProyecto = (idProyecto, nombre) => {
  return Proyecto.findByIdAndUpdate(idProyecto, { nombre }, { new: true });
};

const proyectoExiste = (idProyecto) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resultado = await Proyecto.find({ _id: idProyecto });
      resolve({
        respuesta: resultado.length > 0 ? true : false,
        autor: resultado.length === 0 ? null : resultado[0].autor,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const eliminarProyecto = (idProyecto) => {
  return Proyecto.findByIdAndRemove(idProyecto);
};

module.exports = {
  crearProyecto,
  obtenerProyectos,
  obtenerProyecto,
  actualizarProyecto,
  proyectoExiste,
  eliminarProyecto,
};
