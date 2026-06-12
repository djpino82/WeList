const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { CLIENT_URL } = require('./config/env');

const authRoutes = require('./modules/auth/auth.routes');
const listsRoutes = require('./modules/lists/lists.routes');
const itemsRoutes = require('./modules/items/items.routes');
const invitationsRoutes = require('./modules/invitations/invitations.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || CLIENT_URL.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/listas', listsRoutes);
app.use('/api/listas/:listaId/elementos', itemsRoutes);
app.use('/api', invitationsRoutes);

app.use(errorHandler);

module.exports = app;
