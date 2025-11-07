const prisma = require ('../config/prismaClient');

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
        await prisma.medico.delete({
            where: {
                id_medico: parseInt(id)
            },
        });

        return {
            success: true,
            data: null
        };

    } catch (error) {
        console.error('Erro ao deletar médico', error.message);

        if (error.code === 'P2025') {
            return {
                success: false,
                error: 'Médico não encontrado para deletar.',
                status: 404
            };
        }

        if (error.code === 'P2003') {
            return {
                success: false,
                error: 'Não é possível deletar este médico, pois está associado a um calendário.',
                status: 409
            };
        }

        return {
            success: false,
            error: 'Erro ao deletar médico.',
            status: 500
        };
    }
}

module.exports = {
    criarMedico,
    buscarPorId,
    buscarTodos,
    atualizarMedico,
    deleteMedico
}