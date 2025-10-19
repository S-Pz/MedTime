const express = require('express');

const funcionarioController = require ('../controllers/funcionarioController');

const router = express.Router();

// POST /funcionarios
router.post('/', funcionarioController.criarFuncionario);

// GET /funcionarios
router.get('/', funcionarioController.listarFuncionarios);

// GET /funcionarios/:id
router.get('/:id', funcionarioController.buscarFuncionario);

// PUT /funcionarios/:id
router.put('/:id', funcionarioController.atualizarFuncionario);

// DELETE /funcionarios/:id
router.delete('/:id', funcionarioController.deletarFuncionario);

module.exports = router;