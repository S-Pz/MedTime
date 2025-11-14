const express = require('express');

const pacienteController = require ('../controllers/pacienteController');
const fichaMedicaController = require('../controllers/fichaMedicaController');
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

// --Rotas ficha médica para o paciente logado
//Paciente busca a própria ficha
router.get('/me/ficha-medica',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['paciente']),
    fichaMedicaController.buscarMinhaFicha
);

//Paciente atualiza a própria ficha
router.put('/me/ficha-medica',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['paciente']),
    fichaMedicaController.atualizarMinhaFicha
);

// --Rotas para ADMIN

// GET /pacientes
router.get('/', 
    authMiddleware.verificarToken, 
    authMiddleware.verificarPermissao(['admin']),
    pacienteController.listarPacientes
);

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
    pacienteController.atualizarPaciente
);

// DELETE /pacientes/:id
router.delete('/:id', 
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin', 'paciente']),
    pacienteController.deletarPaciente
);

// --- Rotas da ficha médica (ADMIN/FUNCIONÁRIO)

//Admin/Funcinário busca ficha de um paciente
router.get('/:id/ficha-medica',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin', 'funcionario']),
    fichaMedicaController.buscarFichaPaciente
);

//Admin/Funcinário atualiza ficha de um paciente
router.put('/:id/ficha-medica',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin', 'funcionario']),
    fichaMedicaController.atualizarFichaPaciente
);

module.exports = router;