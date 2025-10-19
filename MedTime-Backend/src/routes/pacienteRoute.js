import {Router} from 'express';
import * as pacienteController from '../controllers/pacienteController.js';

const router = Router();

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

export default router;