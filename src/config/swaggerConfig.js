const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentação Rotas API',
      version: '1.0.0',
      description: 'Documentação das rotas da api.',
    },
    servers: [
      
      {
        url: '/api',
        description: 'Servidor de desenvolvimento',
      },

    ],
  },
  
  apis: ['./docs/routes/*.yml'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec ;