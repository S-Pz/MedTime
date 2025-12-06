const express = require('express');
const relatorioController = require('../controllers/relatorioQtdEspecialidadeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/especialidades',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin', 'funcionario']),
    relatorioController.consultasPorEspecialidade
);

module.exports = router;