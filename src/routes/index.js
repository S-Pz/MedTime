const express = require('express');

const usuarioRoutes = require ('./usuarioRoutes');
const pacienteRoutes = require ('./pacienteRoutes');
const funcionarioRoutes = require ('./funcionarioRoutes');
const authRoutes = require('./authRoutes');

const unidadeRoutes = require('./unidadeRoutes');
const medicoRoutes = require('./medicoRoutes');
const calendarioRoutes = require('./calendarioRoutes');
const agendaRoutes = require('./agendaRoutes');

const relatorioQtdEspecialidadeRoutes = require('./relatorioQtdEspecialidadeRoutes')
const relatorioQtdUnidadeRoutes = require('./relatorioQtdUnidadeRoutes');
const router = express.Router();

//Rotas de autenticação
router.use(authRoutes);

router.use('/unidades', unidadeRoutes);
router.use('/medicos', medicoRoutes);
router.use('/calendarios', calendarioRoutes);
router.use('/agendas', agendaRoutes);

router.use('/relatorios/quantidade', relatorioQtdEspecialidadeRoutes, relatorioQtdUnidadeRoutes);

router.use('/usuarios/pacientes', pacienteRoutes);
router.use('/usuarios/funcionarios', funcionarioRoutes);

router.use('/usuarios', usuarioRoutes);

module.exports = router;