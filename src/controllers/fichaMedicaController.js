const fichaMedicaService = require('../services/fichaMedicaServie');

//--Funções para o Paciente LOGADO
async function buscarMinhaFicha(req, res) {

    const {id} = req.usuario;
    const resultado = await fichaMedicaService.buscarPorIdPaciente(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    res.status(200).json(resultado.data);
}

async function atualizarMinhaFicha(req, res) {

    const {id} = req.usuario;
    const dadosFicha = req.body;

    delete dadosFicha.id_ficha_medica;
    delete dadosFicha.id_usuario;

    const resultado = await fichaMedicaService.atualizarFicha(id, dadosFicha);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    res.status(200).json(resultado.data);
}

//--Funções para o ADMIN/FUNCIONÁRIO
async function buscarFichaPaciente(req, res) {

    const {id} = req.params;
    const resultado = await fichaMedicaService.buscarPorIdPaciente(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    res.status(200).json(resultado.data);
}

async function atualizarFichaPaciente(req, res){

    const {id} = req.params;
    const dadosFicha = req.body;

    delete dadosFicha.id_ficha_medica;
    delete dadosFicha.id_usuario;

    const resultado = await fichaMedicaService.atualizarFicha(id, dadosFicha);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    res.staus(200).json(resultado.data);
}

module.exports = {
    buscarMinhaFicha,
    atualizarMinhaFicha,
    buscarFichaPaciente,
    atualizarFichaPaciente
};