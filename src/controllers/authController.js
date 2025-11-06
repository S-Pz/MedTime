const authService = require('../services/authService');

async function loginFuncionario(req, res) {
    
    const {cpf, senha} = req.body;

    if (!cpf || !senha) {
        return res.status(400).json({ 
            error: 'CPF e senha são obrigatórios.' 
        });
    }

    const resultado = await authService.loginFuncionario(cpf, senha);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(resultado.status).json(resultado.data);
}

async function loginPaciente(req, res) {
    
    const {cpf, senha} = req.body;

    if (!cpf || !senha) {
        return res.status(400).json({ 
            error: 'CPF e senha são obrigatórios.' 
        });
    }

    const resultado = await authService.loginPaciente(cpf, senha);

    if (!resultado.success) {
        return res.status(resultado.status).json({
            error: resultado.error
        });
    }

    res.status(resultado.status).json(resultado.data);
}

module.exports = {
    loginFuncionario,
    loginPaciente,
};