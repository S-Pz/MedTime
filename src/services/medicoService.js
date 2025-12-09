const prisma = require ('../config/prismaClient');

async function buscarHorariosDisponiveis(id) {
    try {
        const horarios = await prisma.calendarioMedico.findMany({
            where: {
                id_medico: parseInt(id),
                disponivel: true // Apenas horários livres
            },
            include: {
                unidade: { // Inclui os dados da unidade para saber onde é o atendimento
                    select: {
                        nome: true,
                        endereco: true
                    }
                }
            },
            orderBy: [
                { dia_semana: 'asc' },   // Ordena por dia
                { horario_inicio: 'asc' } // Ordena por hora
            ]
        });

        return {
            success: true,
            data: horarios
        };

    } catch (error) {
        console.error('Erro ao buscar horários do médico:', error.message);
        return {
            success: false,
            error: 'Erro ao listar horários disponíveis.',
            status: 500
        };
    }
}

async function criarMedico(medico) {

    try {
        const novoMedico = await prisma.medico.create({
            data: {
                nome: medico.nome,
                crm: parseInt(medico.crm),
                especialidade: medico.especialidade
            },
        });

        return {
            success: true,
            data: novoMedico
        };

    } catch (error) {
        console.error('Erro ao criar médico', error.message);

        if (error.code === 'P2002') {
            return {
                success: false,
                error: 'CRM já cadastrado',
                status: 409
            };
        }

        return {
            success: false,
            error: 'Erro ao criar médico.',
            status: 500
        };
    }
}

async function buscarPorId(id) {

    try { 
        const medico = await prisma.medico.findUnique({
            where: {
                id_medico: parseInt(id)
            },

        });

        if(!medico) {
            return {
                success: false,
                error: 'Médico não encontrado',
                status: 404
            };
        }

        return {
            success: true,
            data: medico
        };

    } catch (error) {
        console.error('Erro ao buscar médico por ID:', error.message);
        return {
            success: false,
            error: 'Erro ao buscar médico.',
            status: 500
        };
    }
}

async function buscarTodos(){

    try {
        const medicos = await prisma.medico.findMany();

        return {
            success: true,
            data: medicos
        };

    } catch (error) {
        console.error('Erro ao buscar todos os médicos:', error.message);
        return {
            success: false,
            error: 'Erro ao listar médicos.',
            status: 500
        };
    }
}

async function atualizarMedico(id, medico){

    try {
        const dadosAtualizacao = {
            nome: medico.nome,
            especialidade: medico.especialidade,
        };

        if(medico.crm) {
            dadosAtualizacao.crm = parseInt(medico.crm);
        }

        const medicoAtualizado = await prisma.medico.update({
            where: {
                id_medico: parseInt(id)
            },
            data: dadosAtualizacao,
        });

        return {
            success: true,
            data: medicoAtualizado
        };

    } catch (error) {
        console.error('Erro ao atualizar médico:', error.message);

        if (error.code === 'P2025') {
            return {
                success: false,
                error: 'Médico não encontrado para atualizar.',
                status: 404
            };
        }

        if (error.code === 'P2002') {
            return {
                success: false,
                error: 'CRM já cadastrado.',
                status: 409
            };
        }

        return {
            success: false,
            error: 'Erro ao atualizar médico.',
            status: 500
        };
    }
}

async function deleteMedico(id) {
    try {
        const idMedico = parseInt(id);

        // Usamos $transaction para garantir que tudo seja deletado ou nada seja
        await prisma.$transaction(async (prismaTx) => {
            
            // 1. Apaga todas as consultas agendadas para os horários deste médico
            // Precisamos filtrar através do relacionamento com o calendario_medico
            await prismaTx.agendaConsulta.deleteMany({
                where: {
                    calendario_medico: {
                        id_medico: idMedico
                    }
                }
            });

            // 2. Apaga todos os horários (calendários) deste médico
            await prismaTx.calendarioMedico.deleteMany({
                where: {
                    id_medico: idMedico
                }
            });

            // 3. Finalmente, apaga o médico
            await prismaTx.medico.delete({
                where: {
                    id_medico: idMedico
                }
            });
        });

        return {
            success: true,
            data: null
        };

    } catch (error) {
        console.error('Erro ao deletar médico (cascade):', error.message);

        if (error.code === 'P2025') {
            return {
                success: false,
                error: 'Médico não encontrado para deletar.',
                status: 404
            };
        }

        return {
            success: false,
            error: 'Erro ao deletar médico e seus registros associados.',
            status: 500
        };
    }
}

module.exports = {
    criarMedico,
    buscarPorId,
    buscarTodos,
    atualizarMedico,
    deleteMedico,
    buscarHorariosDisponiveis
}