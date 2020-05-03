const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usuario",
    },
  },
  {
    timestamps: {
      createdAt: "fecha_de_creacion",
      updatedAt: "fecha_de_actualizacion",
    },
  }
);

module.exports = mongoose.model("proyecto", productoSchema);
