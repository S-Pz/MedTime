const express = require('express');

const funcionarioController = require ('../controllers/funcionarioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//--Funcionário LOGADO
// Funcionário busca o próprio perfil
router.get('/me',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin','funcionario']),
    funcionarioController.buscarMeuPerfil
);

//Funcionário atualiza o próprio perfil
router.put('/me',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin','funcionario']),
    funcionarioController.atualizarMeuPerfil
);

//Funcionário deleta o próprio perfil
router.delete('/me',
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin', 'funcionario']),
    funcionarioController.deletarMeuPerfil
);

//--Rotas ADMIN
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
router.get('/:id', 
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin']),
    funcionarioController.buscarFuncionario
);

// PUT /funcionarios/:id
router.put('/:id', 
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin']),
    funcionarioController.atualizarFuncionario
);

// DELETE /funcionarios/:id
router.delete('/:id', 
    authMiddleware.verificarToken,
    authMiddleware.verificarPermissao(['admin']),
    funcionarioController.deletarFuncionario
);

module.exports = router;