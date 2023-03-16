require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(router);

app.get('/', (req, res) => {
  res.json({ info: 'RR SDC API' });
});

app.get('/loaderio-2050313de725f14a69bc1d7492f0a3a4', (req, res) => {
  res.send('loaderio-2050313de725f14a69bc1d7492f0a3a4');
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
server.keepAliveTimeout = 30000;
