const medicoService = require ('../services/medicoService');

async function criarMedico (req, res) {

    const resultado = await medicoService.criarMedico(req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(201).json(resultado.data);
};

async function listarMedicos (req, res) {

    const resultado = await medicoService.buscarTodos();

    if(!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(200).json(resultado.data);
};

async function buscarMedico (req, res) {

    const {id} = req.params;
    const resultado = await medicoService.buscarPorId(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(200).json(resultado.data);
};

async function atualizarMedico (req, res) {

    const {id} = req.params;
    const resultado = await medicoService.atualizarMedico(id, req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    
    res.status(200).json(resultado.data);
};

async function deletarMedico (req, res) {

    const {id} = req.params;
    const resultado = await medicoService.deleteMedico(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(204).send();
};

module.exports = {
    criarMedico,
    listarMedicos,
    buscarMedico,
    atualizarMedico,
    deletarMedico
}