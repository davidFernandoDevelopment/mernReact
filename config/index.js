const ambiente = process.env.NODE_ENV || "development";

const configuracionBase = {
  jwt: {},
  ambiente: ambiente,
  port: process.env.port,
};

let configuracionAmbiente;

switch (ambiente) {
  case "development":
  case "dev":
    configuracionAmbiente = require("./dev");
  case "production":
  case "pro":
    configuracionAmbiente = require("./pro");
  default:
    configuracionAmbiente = require("./dev");
}

module.exports = {
  ...configuracionBase,
  ...configuracionAmbiente,
};
