const app = require('./src/app');
const config = require('./src/config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});