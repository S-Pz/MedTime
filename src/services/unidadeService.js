const prisma = require ('../config/prismaClient');

async function buscarMedicosDaUnidade(id) {
    try {
        const medicos = await prisma.medico.findMany({
            where: {
                calendario_medico: {
                    some: {
                        id_unidade: parseInt(id)
                    }
                }
            },
            // Opcional: ordenar por nome
            orderBy: {
                nome: 'asc'
            }
        });

        return {
            success: true,
            data: medicos
        };

    } catch (error) {
        console.error('Erro ao buscar médicos da unidade:', error.message);
        return {
            success: false,
            error: 'Erro ao listar médicos da unidade.',
            status: 500
        };
    }
}

async function criarUnidade(unidade) {

    try {
        const novaUnidade = await prisma.unidade.create({
            data: {
                nome: unidade.nome,
                endereco: unidade.endereco,
            },
        });

        return {
            success: true,
            data: novaUnidade
        };

    } catch (error) {
        console.error("Erro ao criar unidade", error.message);
        
        return {
            success: false,
            error: 'Erro ao criar unidade.',
            status: 500
        };
    }
}

async function buscarPorId(id) {

    try {
        const unidade = await prisma.unidade.findUnique({
            where: {
                id_unidade: parseInt(id)
            },
        });

        if(!unidade) {
            return {
                success: false,
                error: 'Unidade não encontrada.',
                status: 404
            };
        }

        return {
            success: true,
            data: unidade
        };

    } catch (error) {
        console.error("Erro ao buscar unidade por ID:", error.message);
        return {
            success: false,
            error: 'Erro ao buscar unidade.',
            status: 500
        };
    }
}

async function buscarTodas(){

    try {
        const unidades = await prisma.unidade.findMany();
        
        return {
            success: true,
            data: unidades
        };

    } catch (error) {
        console.error('Erro ao buscar todas as unidades:', error.message);
        return {
            success: false,
            error: 'Erro ao listar unidades.',
            status: 500
        };
    }
}

async function atualizarUnidade(id, unidade){

    try {
        const unidadeAtualizada = await prisma.unidade.update({
            where: {
                id_unidade: parseInt(id)
            },
            data: unidade,
        });

        return {
            success: true,
            data: unidadeAtualizada
        };

    } catch (error) {
        console.error('Erro ao atualizar unidade:', error.message);

        if (error.code === 'P2025') {
            return {
                success: false,
                error: 'Unidade não encontrada para atualizar.',
                status: 404
            };
        }

        return {
            success: false,
            error: 'Erro ao atualizar unidade.',
            status: 500
        };
    }
}

async function deleteUnidade(id) {

    try {
        await  prisma.unidade.delete({
            where: {
                id_unidade: parseInt(id)
            },
        });

        return {
            success: true,
            data: null
        };

    } catch (error) {
        console.error('Erro ao deletar unidade:', error.message);

        if (error.code === 'P2025') {
            return {
                success: false,
                error: 'Unidade não encontrar para deletar.',
                status: 404
            }
        }

        if (error.code === 'P2003'){
            return {
                success: false,
                error: 'Não é possívle deletar esta unidade, pois ela está associada a funcionário ou a um calendário médico.',
                status: 409
            };
        }

        return {
            success: false,
            error: 'Erro ao deletar unidade.',
            status: 500
        };
    }
}

module.exports = {
    criarUnidade,
    buscarPorId,
    buscarTodas,
    atualizarUnidade,
    deleteUnidade,
    buscarMedicosDaUnidade
}