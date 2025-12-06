const prisma = require('../config/prismaClient');

async function contarConsultasPorEspecialidade() {
    try {

        const consultas = await prisma.agendaConsulta.findMany({
    
            include: {
                calendario_medico: {
                    include: {
                        medico: true
                    }
                }
            }
        });

        // Processamento dos dados (Agrupamento)
        const contagem = {};

        consultas.forEach(consulta => {
            // Verifica se existe o caminho completo dos dados para evitar erros
            if (consulta.calendario_medico && consulta.calendario_medico.medico) {
                const especialidade = consulta.calendario_medico.medico.especialidade;
                
                // Incrementa a contagem
                if (contagem[especialidade]) {
                    contagem[especialidade]++;
                } else {
                    contagem[especialidade] = 1;
                }
            }
        });

        // Formata para um array, que é mais fácil para gráficos no front-end
        // Exemplo de saída: [{ especialidade: 'Cardiologia', quantidade: 10 }, ...]
        const dadosFormatados = Object.keys(contagem).map(key => ({
            especialidade: key,
            quantidade: contagem[key]
        }));

        return {
            success: true,
            data: dadosFormatados
        };

    } catch (error) {
        console.error('Erro ao gerar relatório de especialidades:', error.message);
        return {
            success: false,
            error: 'Erro interno ao gerar relatório.',
            status: 500
        };
    }
}

module.exports = {
    contarConsultasPorEspecialidade
};