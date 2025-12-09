const calendarioService = require('../services/calendarioService');
async function listarDisponiveis(req, res) {
    // Pegamos os IDs da URL (Query Params)
    const { id_medico, id_unidade } = req.query;

    // Validação básica
    if (!id_medico && !id_unidade) {
        return res.status(400).json({
            error: 'É necessário fornecer pelo menos o id_medico ou id_unidade para filtrar.'
        });
    }

    const resultado = await calendarioService.listarHorariosDisponiveis(id_medico, id_unidade);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(200).json(resultado.data);
}

async function gerarAgendaPeriodo(req, res) {
    // Exemplo de body:
    // {
    //   "id_medico": 1,
    //   "id_unidade": 1,
    //   "dataInicio": "2023-11-01",
    //   "dataFim": "2023-11-30",
    //   "horaInicioDia": "08:00",
    //   "horaFimDia": "18:00",
    //   "tempoConsultaMinutos": 30
    // }

    const resultado = await calendarioService.gerarHorariosPorPeriodo(req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(201).json({ message: resultado.data });
}

async function criarCalendario(req, res) {
    
    const resultado = await calendarioService.criarCalendario(req.body);
    
    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    
    res.status(201).json(resultado.data);
}

async function listarCalendarios(req, res) {
    
    const resultado = await calendarioService.buscarTodos();
    
    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    
    res.status(200).json(resultado.data);
}

async function buscarCalendario(req, res) {
    
    const {id} = req.params;
    const resultado = await calendarioService.buscarPorId(id);
    
    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    
    res.status(200).json(resultado.data);
}

async function atualizarCalendario(req, res) {
    
    const {id} = req.params;
    const resultado = await calendarioService.atualizarCalendario(id, req.body);
    
    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    
    res.status(200).json(resultado.data);
}

async function deletarCalendario(req, res) {
    
    const {id} = req.params;
    const resultado = await calendarioService.deleteCalendario(id);
    
    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    
    res.status(204).send();
}

module.exports = {
    criarCalendario,
    listarCalendarios,
    buscarCalendario,
    atualizarCalendario,
    deletarCalendario,
    gerarAgendaPeriodo,
    listarDisponiveis
};