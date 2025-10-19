const express = require('express');

const pacienteController = require ('../controllers/pacienteController');

const router = express.Router();

// POST /pacientes
router.post('/', pacienteController.criarPaciente);

// GET /pacientes
router.get('/', pacienteController.listarPacientes);

// GET /pacientes/:id
router.get('/:id', pacienteController.buscarPaciente);

// PUT /pacientes/:id
router.put('/:id', pacienteController.atualizarPaciente);

// DELETE /pacientes/:id
router.delete('/:id', pacienteController.deletarPaciente);

module.exports = router;