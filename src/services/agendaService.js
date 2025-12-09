const prisma = require('../config/prismaClient');

async function agendarConsulta(id_paciente, dadosConsulta) {
    
    try {
        const { id_calendario_medico } = dadosConsulta;

        // Utilizamos uma transação ($transaction) para garantir que
        // a verificação, criação e atualização aconteçam juntas ou falhem juntas.
        const resultado = await prisma.$transaction(async (prismaTx) => {

            // 1. Buscar o horário no calendário para ver se existe e se está livre
            const calendario = await prismaTx.calendarioMedico.findUnique({
                where: { 
                    id_calendario_medico: parseInt(id_calendario_medico) 
                }
            });

            if (!calendario) {
                throw new Error('Horário de calendário não encontrado.');
            }

            // 2. Validação de Segurança: O horário ainda está livre?
            if (calendario.disponivel === false) {
                throw new Error('Este horário já foi reservado por outro paciente.');
            }

            // 3. Criar a consulta vinculando ao paciente logado (id_paciente)
            const novaConsulta = await prismaTx.agendaConsulta.create({
                data: {
                    id_usuario: parseInt(id_paciente), // ID vindo do token
                    id_calendario_medico: parseInt(id_calendario_medico),
                    status: 'agendado',
                    // Pegamos o horário exato do slot do calendário para garantir consistência
                    tempo_consulta: calendario.horario_inicio 
                },
                include: {
                    paciente: {
                        include: { usuario: { select: { nome: true } } } 
                    },
                    calendario_medico: {
                        include: { medico: true, unidade: true }
                    }
                }
            });

            // 4. Atualizar o calendário para INDISPONÍVEL (false)
            await prismaTx.calendarioMedico.update({
                where: { id_calendario_medico: parseInt(id_calendario_medico) },
                data: { disponivel: false }
            });

            return novaConsulta;
        });

        return {
            success: true,
            data: resultado
        };

    } catch (error) {
        console.error('Erro ao agendar consulta:', error.message);
        
        // Retornar erros específicos para o controller saber qual status code usar
        if (error.message === 'Este horário já foi reservado por outro paciente.') {
            return { success: false, error: error.message, status: 409 }; // Conflict
        }
        if (error.message === 'Horário de calendário não encontrado.') {
            return { success: false, error: error.message, status: 404 }; // Not Found
        }

        return {
            success: false,
            error: 'Erro ao agendar consulta.',
            status: 500
        };
    }
}

async function buscarConsultaPorId(id_consulta) {
    
    try {
        const consulta = await prisma.agendaConsulta.findUnique({
            where: {
                id_consulta: parseInt(id_consulta)
            },
            include: {
                paciente: {
                    include: { 
                        usuario: { 
                            select: { 
                                nome: true, 
                                cpf: true 
                            } 
                        } 
                    }
                },
                calendario_medico: {
                    include: { 
                        medico: true, 
                        unidade: true 
                    }
                }
            }
        });

        if (!consulta) {
            return {
                success: false,
                error: 'Consulta não encontrada.',
                status: 404
            };
        }

        return {
            success: true,
            data: consulta
        };

    } catch (error) {
        console.error('Erro ao buscar consulta por ID:', error.message);
        return {
            success: false,
            error: 'Erro ao buscar consulta.',
            status: 500
        };
    }
}

async function buscarTodasConsultas(dataInicio, dataFim) {
    
    try {

        let whereFiltro = {};

        if (dataInicio || dataFim) {
            
            whereFiltro.calendario_medico = {
                dia_semana: {}
            };

            if (dataInicio) {
                whereFiltro.calendario_medico.dia_semana.gte = new Date(dataInicio);
            }

            if (dataFim) {
                whereFiltro.calendario_medico.dia_semana.lte = new Date(dataFim);
            }
        }

        const consultas = await prisma.agendaConsulta.findMany({
            where: whereFiltro,
            include: {
                paciente: {
                    include: { 
                        usuario: { 
                            select: { 
                                nome: true 
                            } 
                        } 
                    }
                },
                calendario_medico: {
                    include: { 
                        medico: true,
                        unidade: true 
                    }
                }
            },
            orderBy: {
                tempo_consulta: 'asc'
            }
        });

        return {
            success: true,
            data: consultas
        };

    } catch (error) {
        console.error('Erro ao buscar todas as consultas:', error.message);
        return {
            success: false,
            error: 'Erro ao listar consultas.',
            status: 500
        };
    }
}

async function buscarConsultasPorPaciente(id_paciente) {
    
    try {
        const consultas = await prisma.agendaConsulta.findMany({
            where: {
                id_usuario: parseInt(id_paciente)
            },
            include: {
                calendario_medico: {
                    include: { 
                        medico: true, 
                        unidade: true 
                    }
                }
            },
            orderBy: {
                tempo_consulta: 'asc'
            }
        });

        return {
            success: true,
            data: consultas
        };

    } catch (error) {
        console.error('Erro ao buscar consultas do paciente:', error.message);
        return {
            success: false,
            error: 'Erro ao listar consultas do paciente.',
            status: 500
        };
    }
}

async function atualizarStatusConsulta(id_consulta, status) {
    
    try {
        const consultaAtualizada = await prisma.agendaConsulta.update({
            where: {
                id_consulta: parseInt(id_consulta)
            },
            data: {
                status: status
            }
        });

        return {
            success: true,
            data: consultaAtualizada
        };

    } catch (error) {
        console.error('Erro ao atualizar status da consulta:', error.message);
        if (error.code === 'P2025') {
            return {
                success: false,
                error: 'Consulta não encontrada para atualizar.',
                status: 404
            };
        }
        return {
            success: false,
            error: 'Erro ao atualizar status da consulta.',
            status: 500
        };
    }
}

async function cancelarConsulta(id_consulta, usuario) {
    
    try {
        const id_consulta_int = parseInt(id_consulta);

        // 1. Buscamos a consulta primeiro para pegar o ID do calendário e validar o dono
        const consulta = await prisma.agendaConsulta.findUnique({
            where: { 
                id_consulta: id_consulta_int 
            }
        });

        if (!consulta) {
            return {
                success: false,
                error: 'Consulta não encontrada.',
                status: 404
            };
        }

        // 2. Verificação de Segurança
        // Se for paciente, verifique se a consulta pertence a ele
        if (usuario.role === 'paciente' && consulta.id_usuario !== usuario.id) {
            return {
                success: false,
                error: 'Acesso negado. Você só pode cancelar suas próprias consultas.',
                status: 403
            };
        }

        // 3. Transação: Deleta a consulta E Libera o horário
        await prisma.$transaction(async (prismaTx) => {
            
            // Passo A: Deleta o registro da consulta
            await prismaTx.agendaConsulta.delete({
                where: {
                    id_consulta: id_consulta_int
                }
            });

            // Passo B: Atualiza o calendário para ficar DISPONÍVEL novamente
            await prismaTx.calendarioMedico.update({
                where: {
                    id_calendario_medico: consulta.id_calendario_medico
                },
                data: {
                    disponivel: true 
                }
            });
        });

        return {
            success: true,
            data: null
        };

    } catch (error) {
        console.error('Erro ao cancelar consulta:', error.message);
        
        if (error.code === 'P2025') {
            return {
                success: false,
                error: 'Consulta já foi excluída ou não existe.',
                status: 404
            };
        }

        return {
            success: false,
            error: 'Erro ao cancelar consulta.',
            status: 500
        };
    }
}

module.exports = {
    agendarConsulta,
    buscarConsultaPorId,
    buscarTodasConsultas,
    buscarConsultasPorPaciente,
    atualizarStatusConsulta,
    cancelarConsulta
};