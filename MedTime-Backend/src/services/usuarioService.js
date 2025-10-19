import {prisma} from '../config/prismaClient'

export async function criarUsuario (usuario) {
    
    try {
        const novoUsuario = await prisma.usuario.create({
            data: usuario,
        });

        return {
            success: true,
            data: novoUsuario
        };

    } catch (error) {
        console.error('Erro ao criar usuário:', error.message); 
        
        if (error.code === 'P2002') {
            return { 
                success: false, 
                error: 'CPF já cadastrado.', 
                status: 409 
            };
        }
    
        return { 
            success: false, 
            error: 'Erro ao criar usuário.', 
            status: 500 
        };
    }
}

export async function buscarPorId (id) {
    
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                id_usuario: parseInt(id)
            },
        });

        if(!usuario) {
            return { 
                success: false, 
                error: 'Usuário não encontrado.', 
                status: 404  
            };
        }
        
        return { 
            success: true, 
            data: usuario
        };

    } catch (error) {
        console.error('Erro ao buscar usuário por ID:', error.message);
        return { 
            success: false, 
            error: 'Erro ao buscar usuário.', 
            status: 500 
        };
    }
}

export async function buscarTodos () {
    
    try {
        const usuarios = await prisma.usuario.findMany();
        
        return { 
            success: true, 
            data: usuarios
        };

    } catch (error) {
        console.error('Erro ao buscar todos os usuários:', error.message);
        return { 
            success: false, 
            error: 'Erro ao listar usuários.', 
            status: 500 
        };
    }
}

export async function atualizarUsuario (id, usuario){
    
    try {
        const usuarioAtualizado = await prisma.usuario.update({
            where: { 
                id_usuario: parseInt(id)
            },
            data: usuario,
        });

        return { 
            success: true,
            data: usuarioAtualizado
        };

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error.message);

        if (error.code === 'P2025') {
            return { 
                success: false, 
                error: 'Usuário não encontrado para atualizar.', 
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
            error: 'Erro ao atualizar usuário.', 
            status: 500 
        };
    }
}

export async function deletarUsuario (id) {
    
    try {
        await prisma.usuario.delete({
            where: { 
                id_usuario: parseInt(id)
            },
        });
        
        return { 
            success: true,
            data: null 
        }; 

    } catch (error) {
        console.error('Erro ao deletar usuário:', error.message);

        if (error.code === 'P2025') {
            return { 
                success: false, 
                error: 'Usuário não encontrado para deletar.', 
                status: 404
            };
        }
        
        if (error.code === 'P2003') {
            return { 
                success: false, 
                error: 'Não é possível deletar este usuário, pois ele está associado a um paciente ou funcionário.', 
                status: 409
            };
        }

        return { 
            success: false, 
            error: 'Erro ao deletar usuário.', 
            status: 500 
        };
    }
}