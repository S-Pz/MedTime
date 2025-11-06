const express = require('express');

const funcionarioController = require ('../controllers/funcionarioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /funcionarios
router.post('/', 
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin']),
    funcionarioController.criarFuncionario
);

// GET /funcionarios
router.get('/', 
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin', 'funcionario']),
    funcionarioController.listarFuncionarios
);

// GET /funcionarios/:id
router.get('/:id', funcionarioController.buscarFuncionario);

// PUT /funcionarios/:id
router.put('/:id', funcionarioController.atualizarFuncionario);

// DELETE /funcionarios/:id
router.delete('/:id', funcionarioController.deletarFuncionario);

module.exports = router;