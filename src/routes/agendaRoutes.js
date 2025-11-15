const express = require('express');
const agendaController = require('../controllers/agendaController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// --- Rotas do Paciente
//Paciente agenda uma consulta
router.post('/',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['paciente']),
    agendaController.agendarConsulta
);

//Paciente lista suas consultas
router.get('/minhas-consultas',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['paciente']),
    agendaController.listarMinhasConsultas
);

// --- Rotas de Admin / Funcionário

// Admin/Funcionário lista TODAS as consultas
router.get('/',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin', 'funcionario']),
    agendaController.listarTodasConsultas
);

//Admin/Funcionário busca uma consulta específica
router.get('/:id',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin', 'funcionario']),
    agendaController.buscarConsulta
);

//Admin/Funcionário atualiza o STATUS
router.patch('/:id',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin', 'funcionario']),
    agendaController.atualizarStatusConsulta
);

// --- Rota Comum

//Todos podem cancelar
// (O service/controller irá verificar se o paciente é o dono)
router.delete('/:id',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin', 'funcionario', 'paciente']),
    agendaController.cancelarConsulta
);

module.exports = router;