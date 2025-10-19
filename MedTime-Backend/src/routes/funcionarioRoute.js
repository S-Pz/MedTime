import { Router } from 'express';
import * as funcionarioController from '../controllers/funcionarioController.js';

const router = Router();

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

export default router;