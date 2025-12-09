const express = require('express');

const medicoController = require('../controllers/medicoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/',
    //authMiddleware.verificarToken,
    //authMiddleware.verificarPermissao(['admin']),
    medicoController.criarMedico
);

router.get('/', medicoController.listarMedicos);
router.get('/:id', medicoController.buscarMedico);

router.put('/:id', 
    //authMiddleware.verificarToken,
    //authMiddleware.verificarPermissao(['admin']),
    medicoController.atualizarMedico
);

router.delete('/:id',
    //authMiddleware.verificarToken,
    //authMiddleware.verificarPermissao(['admin']),
    medicoController.deletarMedico
);

module.exports = router;