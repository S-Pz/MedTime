const express = require('express');

const usuarioRoutes = require ('./usuarioRoute');
const pacienteRoutes = require ('./pacienteRoute');
const funcionarioRoutes = require ('./funcionarioRoute');
const authRoutes = require('./authRoutes');

const router = express.Router();

//Rotas de autenticação
router.use(authRoutes);

router.use('/usuarios/pacientes', pacienteRoutes);
router.use('/usuarios/funcionarios', funcionarioRoutes);

router.use('/usuarios', usuarioRoutes);

module.exports = router;