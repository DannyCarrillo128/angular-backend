require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

dbConnection();

app.use('/api/login', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/global', require('./routes/global'));
app.use('/api/uploads', require('./routes/uploads'));

app.listen(process.env.PORT, () => {
  console.log('Server started on port ' + process.env.PORT);
});
