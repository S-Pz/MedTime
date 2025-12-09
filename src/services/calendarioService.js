const prisma = require('../config/prismaClient');

async function gerarHorariosPorPeriodo(dados) {
    try {
        const { 
            id_medico, 
            id_unidade, 
            dataInicio,      // Ex: "2023-10-01"
            dataFim,         // Ex: "2023-10-31"
            horaInicioDia,   // Ex: "08:00"
            horaFimDia,      // Ex: "18:00"
            tempoConsultaMinutos 
        } = dados;

        // Converter strings para objetos Date (zerando horas para evitar problemas de fuso no loop de dias)
        // Nota: Tratamento de data em JS puro pode ser chato com fuso horário. 
        // O ideal é garantir que a string venha formato ISO YYYY-MM-DD.
        let diaAtual = new Date(dataInicio + 'T00:00:00'); 
        const diaFinal = new Date(dataFim + 'T00:00:00');
        
        const slotsParaCriar = [];

        // 1º Loop: Percorre dia a dia, do inicio ao fim do período
        while (diaAtual <= diaFinal) {
            
            const diaSemana = diaAtual.getDay(); // 0 = Domingo, 6 = Sábado

            // Verifica se é dia útil (ignora 0-Domingo e 6-Sábado)
            if (diaSemana !== 0 && diaSemana !== 6) {
                
                // Monta o horário de abertura e fechamento para AQUELE dia específico
                // Convertendo para string YYYY-MM-DD para garantir a montagem correta
                const ano = diaAtual.getFullYear();
                const mes = String(diaAtual.getMonth() + 1).padStart(2, '0');
                const dia = String(diaAtual.getDate()).padStart(2, '0');
                const dataFormatada = `${ano}-${mes}-${dia}`;

                let momentoSlot = new Date(`${dataFormatada}T${horaInicioDia}:00`);
                const fimExpediente = new Date(`${dataFormatada}T${horaFimDia}:00`);

                // 2º Loop: Dentro do dia, cria os slots de horário
                while (momentoSlot < fimExpediente) {
                    
                    const fimDoSlot = new Date(momentoSlot.getTime() + tempoConsultaMinutos * 60000);

                    if (fimDoSlot > fimExpediente) break; 

                    slotsParaCriar.push({
                        id_medico: parseInt(id_medico),
                        id_unidade: parseInt(id_unidade),
                        dia_semana: new Date(diaAtual), // Salva a data de referência
                        horario_inicio: new Date(momentoSlot),
                        horario_fim: new Date(fimDoSlot),
                        disponivel: true
                    });

                    // Avança para o próximo slot
                    momentoSlot = fimDoSlot;
                }
            }

            // Avança para o próximo dia
            diaAtual.setDate(diaAtual.getDate() + 1);
        }

        if (slotsParaCriar.length === 0) {
            return {
                success: false,
                error: 'Nenhum horário foi gerado. Verifique as datas e se o intervalo não cai apenas em finais de semana.',
                status: 400
            };
        }

        // Inserção em massa no banco
        const resultado = await prisma.calendarioMedico.createMany({
            data: slotsParaCriar
        });

        return {
            success: true,
            data: `${resultado.count} horários criados entre ${dataInicio} e ${dataFim} (exceto finais de semana).`
        };

    } catch (error) {
        console.error('Erro ao gerar horários por período:', error.message);
        return {
            success: false,
            error: 'Erro interno ao gerar agenda.',
            status: 500
        };
    }
}

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
        // 1. Converte e valida o ID antes de chamar o banco
        const idInt = parseInt(id);

        if (isNaN(idInt)) {
            return {
                success: false,
                error: 'ID inválido fornecido. O ID deve ser um número.',
                status: 400
            };
        }

        // 2. Agora chama o Prisma com a garantia de que é um número
        const calendario = await prisma.calendarioMedico.findUnique({
            where: {
                id_calendario_medico: idInt
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

async function listarHorariosDisponiveis(idMedico, idUnidade) {
    try {
        const filtros = {
            disponivel: true, // Apenas os livres
            // dia_semana: {
            //     gte: new Date() // Opcional: Apenas datas de hoje em diante (evita agendar no passado)
            // }
        };

        // Adiciona filtros se forem passados
        if (idMedico) filtros.id_medico = parseInt(idMedico);
        if (idUnidade) filtros.id_unidade = parseInt(idUnidade);

        const horarios = await prisma.calendarioMedico.findMany({
            where: filtros,
            include: {
                medico: {
                    select: { nome: true, especialidade: true }
                },
                unidade: {
                    select: { nome: true }
                }
            },
            orderBy: [
                { dia_semana: 'asc' },
                { horario_inicio: 'asc' }
            ]
        });

        return {
            success: true,
            data: horarios
        };

    } catch (error) {
        console.error('Erro ao listar horários disponíveis:', error.message);
        return {
            success: false,
            error: 'Erro ao buscar horários disponíveis.',
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
    deleteCalendario,
    gerarHorariosPorPeriodo,
    listarHorariosDisponiveis,
};