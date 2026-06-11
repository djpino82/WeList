require('./src/config/env');
const http = require('http');
const app = require('./src/app');
const configurarSocket = require('./src/config/socket');
const { PORT } = require('./src/config/env');

const server = http.createServer(app);

const io = configurarSocket(server);
app.set('io', io);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
