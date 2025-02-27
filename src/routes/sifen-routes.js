const { Router } = require("express");
const sifenController = require("../controllers/sifen-controller");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

// Ruta para buscar todos los sucursales
router.get("/cdc/:id/:cdc", validarJWT, sifenController.consultarcdc);
// Ruta para actualizar una lista de precio por ID
router.put("/anular/:id", validarJWT, sifenController.anular);
router.post("/reintentar/:id", validarJWT, sifenController.reintentar);

module.exports = router;
