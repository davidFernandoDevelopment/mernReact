const Tarea = require("./tareas.model");

const agregarTarea = (tarea) => {
  return new Tarea(tarea).save();
};

const obtenerTareas = (idProyecto) => {
  return Tarea.find({ proyecto: idProyecto });
};

const actualizarTarea = (idTarea, tarea) => {
  return Tarea.findOneAndUpdate({ _id: idTarea }, tarea, { new: true });
};

const existeTarea = (idTarea) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tarea = await Tarea.find({ _id: idTarea });
      resolve({
        respuesta: tarea.length === 0 ? false : true,
        idProyecto: tarea.length === 0 ? null : tarea[0].proyecto,
        tarea: tarea.length === 0 ? null : tarea[0],
      });
    } catch (error) {
      reject(error);
    }
  });
};

const eliminarTarea = (idTarea) => {
  return Tarea.findByIdAndRemove(idTarea);
};

module.exports = {
  agregarTarea,
  obtenerTareas,
  actualizarTarea,
  existeTarea,
  eliminarTarea,
};
