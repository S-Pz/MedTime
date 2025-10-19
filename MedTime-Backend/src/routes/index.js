import {Router} from 'express';

import usuarioRoutes from './usuarioRoutes.js';
import pacienteRoutes from './pacienteRoutes.js';
import funcionarioRoutes from './funcionarioRoutes.js';

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/usuarios/pacientes', pacienteRoutes);
router.use('/usuarios/funcionarios', funcionarioRoutes);

export default router;