const mongoose = require("mongoose");

const tareaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    estado: {
      type: Boolean,
      default: false,
    },
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "proyecto",
    },
  },
  {
    timestamps: {
      createdAt: "fecha_de_creacion",
      updatedAt: "fecha_de_actualizacion",
    },
  }
);

module.exports = mongoose.model("tarea", tareaSchema);
