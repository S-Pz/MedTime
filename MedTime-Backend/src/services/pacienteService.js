const prisma = require ('../config/prismaClient'); 

async function criarPaciente (paciente) {
  
    try {
        const novoPaciente = await prisma.usuario.create({
            data: {
                cpf: paciente.cpf,
                nome: paciente.nome,
                senha: paciente.senha,
                paciente: { 
                    create: {
                        endereco: paciente.endereco,
                        telefone: paciente.telefone,
                    },
                },
            },
            include: {
                paciente: true, 
            },
        });

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
        const pacienteAtualizado = await prisma.usuario.update({
            where: { 
                id_usuario: parseInt(id)
            },
            data: {
                nome: paciente.nome,
                senha: paciente.senha,
                paciente: {
                    update: {
                        endereco: paciente.endereco,
                        telefone: paciente.telefone,
                    },
                },
            },
            include: {
                paciente: true,
            },
        });
        
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