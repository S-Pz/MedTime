const prisma = require('../config/prismaClient');

async function criarCalendario(dados) {
    
    try {
        const novoCalendario = await prisma.calendarioMedico.create({
            data: {
                id_medico: parseInt(dados.id_medico),
                id_unidade: parseInt(dados.id_unidade),
                dia_semana: new Date(dados.dia_semana), // Garante que é um objeto Date
                horario_inicio: new Date(dados.horario_inicio), // Garante que é um objeto Date
                horario_fim: new Date(dados.horario_fim) // Garante que é um objeto Date
            },
            include: {
                medico: true,
                unidade: true
            }
        });

        return {
            success: true,
            data: novoCalendario
        };

    } catch (error) {
        console.error('Erro ao criar calendário:', error.message);
        
        if (error.code === 'P2003') { // Foreign key constraint failed
            return {
                success: false,
                error: 'Médico ou Unidade não encontrado(a).',
                status: 404
            };
        }

        return {
            success: false,
            error: 'Erro ao criar calendário.',
            status: 500
        };
    }
}

async function buscarPorId(id) {
    
    try {
        const calendario = await prisma.calendarioMedico.findUnique({
            where: {
                id_calendario_medico: parseInt(id)
            },
            include: {
                medico: true,
                unidade: true
            }
        });

        if (!calendario) {
            return {
                success: false,
                error: 'Registro de calendário não encontrado.',
                status: 404
            };
        }

        return {
            success: true,
            data: calendario
        };

    } catch (error) {
        console.error('Erro ao buscar calendário por ID:', error.message);
        return {
            success: false,
            error: 'Erro ao buscar calendário.',
            status: 500
        };
    }
}

async function buscarTodos() {
    
    try {
        const calendarios = await prisma.calendarioMedico.findMany({
            include: {
                medico: true,
                unidade: true
            }
        });

        return {
            success: true,
            data: calendarios
        };

    } catch (error) {
        console.error('Erro ao buscar todos os calendários:', error.message);
        return {
            success: false,
            error: 'Erro ao listar calendários.',
            status: 500
        };
    }
}

async function atualizarCalendario(id, dados) {
    
    try {
        const dadosAtualizacao = {
            id_medico: dados.id_medico ? parseInt(dados.id_medico) : undefined,
            id_unidade: dados.id_unidade ? parseInt(dados.id_unidade) : undefined,
            dia_semana: dados.dia_semana ? new Date(dados.dia_semana) : undefined,
            horario_inicio: dados.horario_inicio ? new Date(dados.horario_inicio) : undefined,
            horario_fim: dados.horario_fim ? new Date(dados.horario_fim) : undefined
        };
        
        const calendarioAtualizado = await prisma.calendarioMedico.update({
            where: {
                id_calendario_medico: parseInt(id)
            },
            data: dadosAtualizacao,
            include: {
                medico: true,
                unidade: true
            }
        });

        return {
            success: true,
            data: calendarioAtualizado
        };

    } catch (error) {
        console.error('Erro ao atualizar calendário:', error.message);

        if (error.code === 'P2025') {
            return {
                success: false,
                error: 'Registro de calendário não encontrado para atualizar.',
                status: 404
            };
        }

        return {
            success: false,
            error: 'Erro ao atualizar calendário.',
            status: 500
        };
    }
}

async function deleteCalendario(id) {
    
    try {
        await prisma.calendarioMedico.delete({
            where: {
                id_calendario_medico: parseInt(id)
            }
        });

        return {
            success: true,
            data: null
        };

    } catch (error) {
        console.error('Erro ao deletar calendário:', error.message);

        if (error.code === 'P2025') {
            return {
                success: false,
                error: 'Registro de calendário não encontrado para deletar.',
                status: 404
            };
        }
        
        if (error.code === 'P2003') {
            return {
                success: false,
                error: 'Não é possível deletar este calendário, pois ele possui consultas agendadas.',
                status: 409
            };
        }

        return {
            success: false,
            error: 'Erro ao deletar calendário.',
            status: 500
        };
    }
}

module.exports = {
    criarCalendario,
    buscarPorId,
    buscarTodos,
    atualizarCalendario,
    deleteCalendario
};