import * as pacienteService from '../services/pacienteService.js';

export async function criarPaciente (req, res) {
    
    const resultado = await pacienteService.criarPaciente(req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(201).json(resultado.data);
};

export async function listarPacientes (req, res) {
    
    const resultado = await pacienteService.buscarTodos();

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(200).json(resultado.data); 
};

export  async function buscarPaciente (req, res) {
    
    const {id} = req.params;
    const resultado = await pacienteService.buscarPorId(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(200).json(resultado.data);
};

export async function atualizarPaciente (req, res) {
    
    const {id} = req.params;
    const resultado = await pacienteService.atualizarPaciente(id, req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(200).json(resultado.data); 
};

export async function deletarPaciente (req, res) {
    
    const {id} = req.params;
    const resultado = await pacienteService.deletePaciente(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(204).send();
};