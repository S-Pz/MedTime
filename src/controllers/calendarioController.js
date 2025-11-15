const calendarioService = require('../services/calendarioService');

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
    deletarCalendario
};