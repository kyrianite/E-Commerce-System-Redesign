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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
