import express from 'express';
import cors from 'cors';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json()); 

//Rota de teste
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API está funcionando!' });
});

app.use('/api', routes);

// Middleware para capturar rotas que não existem
app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;