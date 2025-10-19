import * as usuarioService from '../services/usuarioService.js';

export async function criarUsuario (req, res) {
  
    const resultado = await usuarioService.criarUsuario(req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error
        });
    }

    res.status(201).json(resultado.data);
};

export async function listarUsuarios (req, res) {

    const resultado = await usuarioService.buscarTodos();

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error
        });
    }

    res.status(200).json(resultado.data);
};

export async function buscarUsuario (req, res) {
  
    const {id} = req.params;
    const resultado = await usuarioService.buscarPorId(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error
        });
    }

    res.status(200).json(resultado.data);
};

export async function atualizarUsuario (req, res) {
    
    const {id} = req.params;
    const resultado = await usuarioService.atualizarUsuario(id, req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error
        });
    }
    res.status(200).json(resultado.data);
};

export async function deletarUsuario (req, res) {
    
    const {id} = req.params;
    const resultado = await usuarioService.deletarUsuario(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error
        });
    }
    
    res.status(204).send();
};