const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');
const swaggerSpec = require('./config/swaggerConfig');

const app = express();

app.use(cors());
app.use(express.json()); 

//Rota de teste
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API está funcionando!' });
});

app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware para capturar rotas que não existem
app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;