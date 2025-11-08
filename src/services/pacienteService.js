const prisma = require ('../config/prismaClient'); 
const bcrypt = require('bcryptjs');

async function criarPaciente (paciente) {
  
    try {
        
        const {cpf, nome, email, senha, endereco, telefone, ...dadosFicha} = paciente;

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(paciente.senha, salt);

        const novoPaciente = await prisma.usuario.create({
            data: {
                cpf: cpf,
                nome: nome,
                email: email,
                senha: senhaHash,
                paciente: { 
                    create: {
                        endereco: endereco,
                        telefone: telefone,
                        ficha_medica: {
                            create: dadosFicha
                        }
                    },
                },
            },
            include: {
                paciente: {
                    include:{
                        ficha_medica: true
                    }
                }, 
            },
        });

        // Remove a senha da resposta
        delete novoPaciente.senha;

        return { 
            success: true, 
            data: novoPaciente
        };

    } catch (error) {
        console.error('Erro ao criar paciente:', error.message);
    
        if (error.code === 'P2002') {
            return { 
                success: false, 
                error: 'CPF já cadastrado.', 
                status: 409
            };
        }
    
        return { 
            success: false, 
            error: 'Erro ao criar paciente.', 
            status: 500 
        };
    }
};

async function buscarPorId (id) {
    
    try {
        const paciente = await prisma.paciente.findUnique({
            where: { 
                id_usuario: parseInt(id)
            }, 
            include: {
                usuario: true,
                ficha_medica: true
            },
        });

        if (!paciente) {
            return { 
                success: false, 
                error: 'Paciente não encontrado.', 
                status: 404 
            };
        }

        return { 
            success: true,
            data: paciente
        };

    } catch (error) {
        console.error('Erro ao buscar paciente por ID:', error.message);
        
        return { 
            success: false, 
            error: 'Erro ao buscar paciente.', 
            status: 500 
        };
    }
};

async function buscarTodos () {
  
    try {
        const pacientes = await prisma.paciente.findMany({
            include: {
                usuario: true,
                ficha_medica: true
            },
        });

        return { 
            success: true,
            data: pacientes
        };
    
    } catch (error) {
        console.error('Erro ao buscar todos os pacientes:', error.message);
        
        return { 
            success: false, 
            error: 'Erro ao listar pacientes.', 
            status: 500 
        };
    }
};

async function atualizarPaciente (id, paciente) {
  
    try {
        
       const {cpf, nome, email, senha, endereco, telefone, ...dadosFicha} = paciente;

        const dadosAtualizacaoPaciente = {
            nome: nome,
            paciente: {
                update: {
                    endereco: endereco,
                    telefone: telefone,

                    ficha_medica:{
                        upsert:{
                            create:dadosFicha,
                            update: dadosFicha
                        }
                    }
                },
            },
        };

        if (paciente.senha && paciente.senha.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            
            dadosAtualizacaoPaciente.senha = await bcrypt.hash(paciente.senha, salt);
        }

        const pacienteAtualizado = await prisma.usuario.update({
            where: { 
                id_usuario: parseInt(id)
            },
            data: dadosAtualizacaoPaciente,
            include: {
                paciente: {
                    include:{
                        ficha_medica: true
                    }
                },
            },
        });
        
        delete pacienteAtualizado.senha;
        
        return { 
            success: true,
            data: pacienteAtualizado
        };

    } catch (error) {
        console.error('Erro ao atualizar paciente:', error.message);
        
        if (error.code === 'P2025') {
            return { 
                success: false, 
                error: 'Paciente não encontrado para atualizar.', 
                status: 404
            };
        }
        
        if (error.code === 'P2002') {
            return { 
                success: false, 
                error: 'CPF já cadastrado.', 
                status: 409
            };
        }

        return { 
            success: false, 
            error: 'Erro ao atualizar paciente.', 
            status: 500 
        };
    }
};

async function deletePaciente (id) {
  
    try {
        const deletePaciente = prisma.paciente.delete({
            where: { 
                id_usuario: parseInt(id)
            }, 
        });
    
        const deleteUsuario = prisma.usuario.delete({
            where: { 
                id_usuario: parseInt(id)
            },
        });

        await prisma.$transaction([deletePaciente, deleteUsuario]);

        return { 
            success: true,
            data: null
        };

    } catch (error) {
        console.error('Erro ao deletar paciente:', error.message);
        
        if (error.code === 'P2025') {
            return { 
                success: false, 
                error: 'Paciente não encontrado para deletar.', 
                status: 404
            };
        }
        
        if (error.code === 'P2003') {
            return { 
                success: false, 
                error: 'Não é possível deletar este paciente, pois ele possui consultas agendadas.', 
                status: 409
            };
        }
        
        return { 
            success: false, 
            error: 'Erro ao deletar paciente.', 
            status: 500 
        };
    }
};

module.exports = {
    criarPaciente,
    buscarPorId,
    buscarTodos,
    atualizarPaciente,
    deletePaciente
}