const jwt = require ('jsonwebtoken');

const config = require ('../config');

const jwtSecret = config.jwtSecret;

function verificarToken(req, res, next) {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        
        return res.status(401).json({ 
            status: false, 
            message: 'Token de autenticação não fornecido.' 
        });
    }

    jwt.verify(token, jwtSecret, (err, usuarioLogado) => {
        
        if (err) {    
            return res.status(403).json({ 
                status: false, 
                message: 'Token inválido ou expirado.' 
            });
        }

        req.usuario = usuarioLogado;

        next(); 
    });
}

function verificarPermissao(rolesPermitidas) {
    
    return (req, res, next) => {
        
        const {role} = req.usuario;

        if (!rolesPermitidas.includes(role)) {
            return res.status(403).json({ 
                status: false, 
                message: 'Acesso negado. Você não tem permissão.' 
            });
        }

        next(); 
    };
}

module.exports = {
    verificarToken,
    verificarPermissao
};