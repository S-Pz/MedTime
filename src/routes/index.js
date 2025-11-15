const express = require('express');

const usuarioRoutes = require ('./usuarioRoute');
const pacienteRoutes = require ('./pacienteRoute');
const funcionarioRoutes = require ('./funcionarioRoute');
const authRoutes = require('./authRoutes');

const unidadeRoutes = require('./unidadeRoutes');
const medicoRoutes = require('./medicoRoute');
const calendarioRoutes = require('./calendarioRoutes');

const router = express.Router();

//Rotas de autenticação
router.use(authRoutes);

router.use('/unidades', unidadeRoutes);
router.use('/medicos', medicoRoutes);
router.use('/calendarios', calendarioRoutes);

router.use('/usuarios/pacientes', pacienteRoutes);
router.use('/usuarios/funcionarios', funcionarioRoutes);

router.use('/usuarios', usuarioRoutes);

module.exports = router;