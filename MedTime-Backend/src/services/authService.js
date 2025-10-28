const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = require('../config/prismaClient');

async function loginFuncionario(cpf, senha) {
    
    try {
        
        const usuario = await prisma.usuario.findUnique({
            where: { cpf },
            include: {
                funcionario: true,
            },
        });

        if (!usuario || !usuario.funcionario) {
            return {
                success: false,
                error: 'Credenciais inválidas.',
                status: 401
            };
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return {
                success: false,
                error: 'Senha Inválida.',
                status: 401
            };
        }

        const role = usuario.funcionario.is_admin ? 'admin' : 'funcionario';

        const payload = {
            id: usuario.id_usuario,
            nome: usuario.nome,
            role: role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '8h', // Token expira em 8 horas
        });

        const responseData = {
            status: true,
            data: {
                token,
                nome: usuario.nome,
                role: role,
            },
        };

        return {
            success: true,
            data: responseData,
            status: 200
        };

    } catch (error) {
        console.error('Erro no serviço de login do funcionário:', error.message);
        return {
            success: false,
            error: 'Erro interno no servidor.',
            status: 500
        };
    }
}

async function loginPaciente(cpf, senha) {
    
    try {
        
        const usuario = await prisma.usuario.findUnique({
            where: { cpf },
            include: {
                paciente: true,
            },
        });

        if (!usuario || !usuario.paciente) {
            return {
                success: false,
                error: 'Credenciais inválidas.',
                status: 401
            };
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return {
                success: false,
                error: 'Senha Inválida.',
                status: 401
            };
        }

        const role = 'paciente';

        const payload = {
            id: usuario.id_usuario,
            nome: usuario.nome,
            role: role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '8h',
        });

        const responseData = {
            status: true,
            data: {
                token,
                nome: usuario.nome,
                role: role,
            },
        };

        return {
            success: true,
            data: responseData,
            status: 200
        };

    } catch (error) {
        console.error('Erro no serviço de login do paciente:', error.message);
        
        return {
            success: false,
            error: 'Erro interno no servidor.',
            status: 500
        };
    }
}

module.exports = {
    loginFuncionario,
    loginPaciente,
};