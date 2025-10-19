const express = require('express');

const usuarioRoutes = require ('./usuarioRoute');
const pacienteRoutes = require ('./pacienteRoute');
const funcionarioRoutes = require ('./funcionarioRoute');

const router = express.Router();

router.use('/usuarios/pacientes', pacienteRoutes);
router.use('/usuarios/funcionarios', funcionarioRoutes);

router.use('/usuarios', usuarioRoutes);

module.exports = router;