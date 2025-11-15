const express = require('express');

const usuarioController = require ('../controllers/usuarioController');

const router = express.Router();

// POST /usuarios
router.post('/', usuarioController.criarUsuario);

// GET /usuarios
router.get('/', usuarioController.listarUsuarios);

// GET /usuarios/:id
router.get('/:id', usuarioController.buscarUsuario);

// PUT /usuarios/:id
router.put('/:id', usuarioController.atualizarUsuario);

// DELETE /usuarios/:id
router.delete('/:id', usuarioController.deletarUsuario);

module.exports = router;