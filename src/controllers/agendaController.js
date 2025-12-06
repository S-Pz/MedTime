const agendaService = require('../services/agendaService');

async function agendarConsulta(req, res) {
    
    const {id} = req.usuario;
    const dadosConsulta = req.body;

    const resultado = await agendaService.agendarConsulta(id, dadosConsulta);
    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    res.status(201).json(resultado.data);
}

async function listarMinhasConsultas(req, res) {
    
    const {id} = req.usuario;

    const resultado = await agendaService.buscarConsultasPorPaciente(id);
    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    res.status(200).json(resultado.data);
}

async function listarTodasConsultas(req, res) {
    
    const { dataInicio, dataFim } = req.query;

    const resultado = await agendaService.buscarTodasConsultas(dataInicio, dataFim);
    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    res.status(200).json(resultado.data);
}

async function buscarConsulta(req, res) {
    
    const {id} = req.params;
    
    const resultado = await agendaService.buscarConsultaPorId(id);
    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    res.status(200).json(resultado.data);
}

async function atualizarStatusConsulta(req, res) {
    
    const {id} = req.params;
    const {status} = req.body;

    if (!status) {
        return res.status(400).json({ error: 'O campo "status" é obrigatório.' });
    }

    const resultado = await agendaService.atualizarStatusConsulta(id, status);
    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    res.status(200).json(resultado.data);
}

async function cancelarConsulta(req, res) {
    
    const {id} = req.params;
    const usuario = req.usuario;

    const resultado = await agendaService.cancelarConsulta(id, usuario);
    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    res.status(204).send();
}

module.exports = {
    agendarConsulta,
    listarMinhasConsultas,
    listarTodasConsultas,
    buscarConsulta,
    atualizarStatusConsulta,
    cancelarConsulta
};