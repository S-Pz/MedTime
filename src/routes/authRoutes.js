const {Router} = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.post('/login/funcionario', authController.loginFuncionario);
router.post('/login/paciente', authController.loginPaciente);

module.exports = router;