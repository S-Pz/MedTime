const relatorioService = require('../services/relatorioQtdUnidadeService');

async function consultasPorUnidade(req, res) {
    
    const resultado = await relatorioService.contarConsultasPorUnidade();

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(200).json(resultado.data);
}

module.exports = {
    consultasPorUnidade
};