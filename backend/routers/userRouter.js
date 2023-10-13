const express = require("express");
const router = express.Router();

const validatorInicialUser = require('../middleware/middlewareValidatorUser')
const {
  registerUser,
   
} = require("../controllers/controllerUsers");
const { errorMonitor } = require("nodemailer/lib/xoauth2");


router.post("/register", validatorInicialUser, registerUser);
// router.post("/clientes/login", AutenticarCliente );
// router.get("/clientes", MostrarClientes);
// router.get("/clientes/:id", BuscarCliente);
// router.put("/clientes/:id", ActualizarCliente);
// router.delete("/clientes/:id", EliminarCliente);

module.exports = router;
 