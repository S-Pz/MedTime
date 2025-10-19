import * as funcionarioService from '../services/funcionarioService.js';

export async function criarFuncionario (req, res) {
    
    const resultado = await funcionarioService.criarFuncionario(req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(201).json(resultado.data);
};

export async function listarFuncionarios (req, res) {

    const resultado = await funcionarioService.buscarTodos();

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(200).json(resultado.data);
};

export async function buscarFuncionario (req, res) {

    const {id} = req.params;
    const resultado = await funcionarioService.buscarPorId(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(200).json(resultado.data);
};

export async function atualizarFuncionario (req, res) {
  
    const {id} = req.params;
    const resultado = await funcionarioService.atualizarFuncionario(id, req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(200).json(resultado.data);
};

export async function deletarFuncionario (req, res) {
    
    const {id} = req.params;
    const resultado = await funcionarioService.deleteFuncionario(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }
    
    res.status(204).send(); 
};