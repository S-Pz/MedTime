const funcionarioService = require ('../services/funcionarioService');

// Adicione esta função junto com as do "Funcionário LOGADO"
async function buscarMinhaUnidade(req, res) {
    
    // O ID vem do middleware de autenticação (token)
    const { id } = req.usuario; 

    // Reutilizamos o serviço existente que já faz o join com Unidade
    const resultado = await funcionarioService.buscarPorId(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    // O serviço retorna o funcionário completo. Aqui extraímos só a unidade.
    const unidade = resultado.data.unidade;

    if (!unidade) {
        return res.status(404).json({
            error: 'Nenhuma unidade associada ao seu perfil.'
        });
    }

    // Retorna o objeto da unidade diretamente
    res.status(200).json(unidade);
};

async function criarFuncionario (req, res) {
    
    const resultado = await funcionarioService.criarFuncionario(req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(201).json(resultado.data);
};

async function listarFuncionarios (req, res) {

    const resultado = await funcionarioService.buscarTodos();

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(200).json(resultado.data);
};

async function buscarFuncionario (req, res) {

    const {id} = req.params;
    const resultado = await funcionarioService.buscarPorId(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(200).json(resultado.data);
};

async function atualizarFuncionario (req, res) {
  
    const {id} = req.params;
    const resultado = await funcionarioService.atualizarFuncionario(id, req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }

    res.status(200).json(resultado.data);
};

async function deletarFuncionario (req, res) {
    
    const {id} = req.params;
    const resultado = await funcionarioService.deleteFuncionario(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({ 
            error: resultado.error 
        });
    }
    
    res.status(204).send(); 
};

// Funções para o funcionario logado
async function buscarMeuPerfil(req, res) {
    
    const {id} = req.usuario;
    const resultado = await funcionarioService.buscarPorId(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    res.status(200).json(resultado.data);
};

async function atualizarMeuPerfil(req, res) {

    const {id} = req.usuario;
    const resultado = await funcionarioService.atualizarFuncionario(id, req.body);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }
    res.status(200).json(resultado.data);
};

async function deletarMeuPerfil(req, res) {

    const {id} = req.usuario;
    const resultado = await funcionarioService.deleteFuncionario(id);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.erro
        });
    }
    res.status(204).send();
};

module.exports = {
    criarFuncionario,
    listarFuncionarios,
    buscarFuncionario,
    atualizarFuncionario,
    deletarFuncionario,
    buscarMeuPerfil,
    atualizarMeuPerfil,
    deletarMeuPerfil,
    buscarMinhaUnidade
}