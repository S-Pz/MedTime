const relatorioService = require('../services/relatorioQtdEspecialidadeService');

async function consultasPorEspecialidade(req, res) {
    
    const resultado = await relatorioService.contarConsultasPorEspecialidade();

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(200).json(resultado.data);
}

module.exports = {
    consultasPorEspecialidade
};