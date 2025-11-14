const express = require('express');

const pacienteController = require ('../controllers/pacienteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /pacientes
router.post('/', pacienteController.criarPaciente);

//--Paciente LOGADO
//Paciente buscar o próprio perfil
router.get('/me',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['paciente']),
    pacienteController.buscarMeuPerfil
);

//Paciente atualizar o próprio perfil
router.put('/me',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['paciente']),
    pacienteController.atualizarMeuPerfil
);

//Paciente deleta o próprio perfil
router.delete('/me',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['paciente']),
    pacienteController.deletarMeuPerfil
);

// --Rotas para ADMIN

// GET /pacientes
router.get('/', 
    authMiddleware.verificarToken, 
    authMiddleware.verificarPermissao(['admin']),
    pacienteController.listarPacientes);

// GET /pacientes/:id
router.get('/:id', 
    authMiddleware.verificarToken, 
    authMiddleware.verificarPermissao(['admin', 'funcionario']),
    pacienteController.buscarPaciente
);

// PUT /pacientes/:id
router.put('/:id', 
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin']),
    pacienteController.atualizarPaciente);

// DELETE /pacientes/:id
router.delete('/:id', 
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin', 'paciente']),
    pacienteController.deletarPaciente
);

module.exports = router;