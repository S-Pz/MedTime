const prisma = require('../config/prismaClient');

async function agendarConsulta(id_paciente, dadosConsulta) {
    
    try {
        const {id_calendario_medico, tempo_consulta} = dadosConsulta;

        const calendario = await prisma.calendarioMedico.findUnique({
            where: { 
                id_calendario_medico: parseInt(id_calendario_medico) 
            }
        });

        if (!calendario) {
            return {
                success: false,
                error: 'Horário de calendário não encontrado.',
                status: 404
            };
        }

        const novaConsulta = await prisma.agendaConsulta.create({
            data: {
                id_usuario: parseInt(id_paciente),
                id_calendario_medico: parseInt(id_calendario_medico),
                status: 'agendado',
                tempo_consulta: new Date(tempo_consulta)
            },
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
            }
        });

        return {
            success: true,
            data: novaConsulta
        };

    } catch (error) {
        console.error('Erro ao agendar consulta:', error.message);
        if (error.code === 'P2003') {
            return {
                success: false,
                error: 'Paciente ou Calendário não encontrado.',
                status: 404
            };
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

        if (usuario.role === 'paciente') {
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

            if (consulta.id_usuario !== usuario.id) {
                return {
                    success: false,
                    error: 'Acesso negado. Você só pode cancelar suas próprias consultas.',
                    status: 403
                };
            }
        }
        
        await prisma.agendaConsulta.delete({
            where: {
                id_consulta: id_consulta_int
            }
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
                error: 'Consulta não encontrada para cancelar.',
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