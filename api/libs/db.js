const mongoose = require("mongoose");

const db = mongoose.connection;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

db.once("open", () => {
  console.log("Conexión cloud exitosa ...");
});

db.on("error", () => {
  console.log("Hubo un error en la conexión ...");
});
