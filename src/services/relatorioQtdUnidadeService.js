const prisma = require('../config/prismaClient');

async function contarConsultasPorUnidade() {
    try {
        // Busca as consultas incluindo o calendário e a unidade vinculada
        const consultas = await prisma.agendaConsulta.findMany({
            include: {
                calendario_medico: {
                    include: {
                        unidade: true
                    }
                }
            }
        });

        const contagem = {};

        consultas.forEach(consulta => {
            // Verifica se a relação existe para evitar erros
            if (consulta.calendario_medico && consulta.calendario_medico.unidade) {
                // Usa o nome da unidade ou 'Sem Nome' se for null
                const nomeUnidade = consulta.calendario_medico.unidade.nome || 'Unidade Sem Nome';
                
                if (contagem[nomeUnidade]) {
                    contagem[nomeUnidade]++;
                } else {
                    contagem[nomeUnidade] = 1;
                }
            }
        });

        // Formata para o front-end: [{ unidade: 'Centro', quantidade: 15 }, ...]
        const dadosFormatados = Object.keys(contagem).map(key => ({
            unidade: key,
            quantidade: contagem[key]
        }));

        return {
            success: true,
            data: dadosFormatados
        };

    } catch (error) {
        console.error('Erro ao gerar relatório de unidades:', error.message);
        return {
            success: false,
            error: 'Erro interno ao gerar relatório.',
            status: 500
        };
    }
}

// Lembre-se de adicionar a nova função no module.exports
module.exports = {
    // contarConsultasPorEspecialidade, (a função anterior)
    contarConsultasPorUnidade
};