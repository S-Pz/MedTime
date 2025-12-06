const express = require('express');
const relatorioController = require('../controllers/relatorioQtdUnidadeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/unidades',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin', 'funcionario']),
    relatorioController.consultasPorUnidade
);

module.exports = router;