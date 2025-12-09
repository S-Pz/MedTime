const { $executeRawUnsafe } = require('../config/prismaClient');
const unidadeService = require ('../services/unidadeService');

async function listarMedicosPorUnidade(req, res) {
    
    const { id } = req.params;

    const resultado = await unidadeService.buscarMedicosDaUnidade(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(200).json(resultado.data);
};

async function criarUnidade (req, res) {

    const resultado = await unidadeService.criarUnidade(req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(201).json(resultado.data);
};

async function listarUnidades (req, res) {

    const resultado = await unidadeService.buscarTodas();

    if(!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(200).json(resultado.data);
};

async function buscarUnidade (req, res) {

    const {id} = req.params;
    const resultado = await unidadeService.buscarPorId(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(200).json(resultado.data);
};

async function atualizarUnidade (req, res) {

    const {id} = req.params;
    const resultado = await unidadeService.atualizarUnidade(id, req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(200).json(resultado.data);
};

async function deletarUnidade (req, res) {

    const {id} = req.params;
    const resultado = await unidadeService.deleteUnidade(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    
    res.status(204).send();
};

module.exports = {
    criarUnidade,
    listarUnidades,
    buscarUnidade,
    atualizarUnidade,
    deletarUnidade,
    listarMedicosPorUnidade
    
}