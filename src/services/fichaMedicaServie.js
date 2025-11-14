const prisma = require('../config/prismaClient');

//Buscar ficha médica pelo id do paciente
async function buscarPorIdPaciente(id_usuario) {

    try {
        const fichaMedica = await prisma.fichaMedica.findUnique({
            where: {
                id_usuario: parseInt(id_usuario)
            },
            include: {
                paciente:{
                    select: {
                        usuario: {
                            select:{
                                nome: true,
                                cpf: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!fichaMedica) {
            return {
                success: false,
                error: 'Ficha médica não encontrada.',
                status: 404
            };
        }

        return {
            success: true,
            data: fichaMedica
        }

    } catch (error){
        console.error('Erro ao buscar ficha médica.', error.message);
        
        return {
            success: false,
            error: 'Erro ao buscar ficha médica.',
            status: 500
        };
    }
}

//Atualizar ficha médica pelo id do paciente
async function atualizarFicha(id_usuario, dadosFicha) {

    try {
        const fichaAtualizada = await prisma.fichaMedica.update({
            where: {
                id_usuario: parseInt(id_usuario)
            },
        });

        return {
            success: true,
            data: fichaAtualizada
        }

    } catch (error){
        console.error('Erro ao atualizar ficha médica:', error.message);

        if (error.code === 'P2025'){
            return {
                success: false,
                error: 'Ficha médica não encontrada para atualizar.',
                status: 404
            };
        }

        return {
            success: false,
            error: 'Erro ao atualizar ficha médica.',
            status: 500
        };
    }
}

module.exports = {
    buscarPorIdPaciente,
    atualizarFicha
};