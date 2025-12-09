const prisma = require ('../config/prismaClient'); 
const bcrypt = require ('bcryptjs');

async function criarFuncionario (funcionario) {
  
    try {
        
        const { cpf, nome, email, senha, is_admin, id_unidade } = funcionario;

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const isAdminBoolean = is_admin === true || is_admin === 'true';

        const novoFuncionario = await prisma.usuario.create({
            data: {
                cpf: cpf,
                nome: nome,
                senha: senhaHash, 
                email: email,
                funcionario: { 
                    create: {
                        is_admin: isAdminBoolean,
                        unidade: {
                            connect: { 
                                id_unidade: parseInt(id_unidade)
                            }
                        }
                    },
                },
            },
            include: {
                funcionario: {
                    include: {
                        unidade: true
                    }
                },
            },
        });

        // Remove a senha da resposta
        delete novoFuncionario.senha;

        return { 
            success: true,
            data: novoFuncionario
        };

    } catch (error) {
        console.error('Erro ao criar funcionário:', error.message);
        
        if (error.code === 'P2002') {
            return { 
                success: false, 
                error: 'CPF já cadastrado.', 
                status: 409
            };
        }
        
        if (error.code === 'P2025') {
            return { 
                success: false, 
                error: 'Unidade não encontrada para associação.', 
                status: 404
            };
        }
        
        return { 
            success: false, 
            error: 'Erro ao criar funcionário.', 
            status: 500 
        };
    }
};

async function buscarPorId (id) {
    
    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { 
                id_usuario: parseInt(id)
            },
            include: {
                usuario: true,
                unidade: true, 
            },
        });

        if (!funcionario) {
            return { 
                success: false, 
                error: 'Funcionário não encontrado.', 
                status: 404
            };
        }

        return { 
            success: true,
            data: funcionario
        };

    } catch (error) {
        console.error('Erro ao buscar funcionário por ID:', error.message);
        
        return { 
            success: false, 
            error: 'Erro ao buscar funcionário.', 
            status: 500 
        };
    }
};

async function buscarTodos () {
    
    try {
        const funcionarios = await prisma.funcionario.findMany({
            include: {
                usuario: true,
                unidade: true,
            },
        });
        
        return { 
            success: true,
            data: funcionarios
        };
        
    } catch (error) {
        console.error('Erro ao buscar todos os funcionários:', error.message);
        
        return { 
            success: false, 
            error: 'Erro ao listar funcionários.', 
            status: 500 
        };
    }
};

async function atualizarFuncionario (id, funcionario) {
  
    try {
        
        const dadosAtualizacaoFuncionario = {
            
            nome : funcionario.nome,
            funcionario: {
                update: {
                    is_admin: funcionario.is_admin,
                    unidade: funcionario.id_unidade ? {
                        connect: { 
                            id_unidade: parseInt(funcionario.id_unidade)
                        }
                    } : undefined,
                },
            },
        }

        if (funcionario.senha && funcionario.senha.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            
            dadosAtualizacaoFuncionario.senha = await bcrypt.hash(funcionario.senha, salt);
        }

        const funcionarioAtualizado = await prisma.usuario.update({
            where: { 
                id_usuario: parseInt(id)
            },
            data: dadosAtualizacaoFuncionario,
            include: {
                funcionario: {
                    include: {
                        unidade: true
                    }
                },
            },
        });
        
        delete funcionarioAtualizado.senha;

        return { 
            success: true,
            data: funcionarioAtualizado
        };

    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error.message);
        
        if (error.code === 'P2025') {
            return { 
                success: false, 
                error: 'Funcionário não encontrado para atualizar.', 
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
            error: 'Erro ao atualizar funcionário.', 
            status: 500 
        };
    }
};

async function deleteFuncionario (id) {
    
    try {
        
        const deleteFuncionario = prisma.funcionario.delete({
            where: { 
                id_usuario: parseInt(id)
            },
        });
        
        const deleteUsuario = prisma.usuario.delete({
            where: { 
                id_usuario: parseInt(id)
            },
        });

        await prisma.$transaction([deleteFuncionario, deleteUsuario]);

        return { 
            success: true,
            data: null
        };

    } catch (error) {
        console.error('Erro ao deletar funcionário:', error.message);
        
        if (error.code === 'P2025') {
            return { 
                success: false, 
                error: 'Funcionário não encontrado para deletar.', 
                status: 404
            };
        }
        
        return { 
            success: false, 
            error: 'Erro ao deletar funcionário.', 
            status: 500 
        };
    }
};

module.exports = {
    criarFuncionario,
    buscarPorId,
    buscarTodos,
    atualizarFuncionario,
    deleteFuncionario
}