const express = require('express');

const calendarioController = require('../controllers/calendarioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/gerar-periodo',
    //authMiddleware.verificarToken,
    //authMiddleware.verificarPermissao(['admin', 'funcionario']),
    calendarioController.gerarAgendaPeriodo
);
router.get('/disponiveis', 
    // authMiddleware.verificarToken, (Se quiseres proteger)
    calendarioController.listarDisponiveis
);
router.post('/',
    //authMiddleware.verificarToken,
    //authMiddleware.verificarPermissao(['admin', 'funcionario']),
    calendarioController.criarCalendario
);

router.get('/',
    //authMiddleware.verificarToken,
    //authMiddleware.verificarPermissao(['admin', 'funcionario']),
    calendarioController.listarCalendarios
);

router.get('/:id',
    //authMiddleware.verificarToken,
    //authMiddleware.verificarPermissao(['admin', 'funcionario']),
    calendarioController.buscarCalendario
);

router.put('/:id',
    //authMiddleware.verificarToken,
    //authMiddleware.verificarPermissao(['admin', 'funcionario']),
    calendarioController.atualizarCalendario
);


router.delete('/:id',
    //authMiddleware.verificarToken,
    //authMiddleware.verificarPermissao(['admin', 'funcionario']),
    calendarioController.deletarCalendario
);

module.exports = router;