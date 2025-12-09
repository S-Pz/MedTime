const express = require('express');

const unidadeController = require ('../controllers/unidadeController');
const authMiddleware = require ('../middleware/authMiddleware');

const router = express.Router();

router.post('/',
    //authMiddleware.verificarToken,
    //authMiddleware.verificarPermissao(['admin']),
    unidadeController.criarUnidade
);

router.get('/', unidadeController.listarUnidades);
router.get('/:id', unidadeController.buscarUnidade);

router.put('/:id',
    //authMiddleware.verificarToken,
    //authMiddleware.verificarPermissao(['admin']),
    unidadeController.atualizarUnidade
);

router.delete('/:id',
    //authMiddleware.verificarToken,
    //authMiddleware.verificarPermissao(['admin']),
    unidadeController.deletarUnidade
);

module.exports = router;