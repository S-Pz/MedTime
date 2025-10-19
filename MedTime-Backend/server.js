import app from './src/app.js';
import config from './src/config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});