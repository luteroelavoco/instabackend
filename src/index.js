const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const credentials = require('./password');

const { user } = credentials;
const password = credentials.pass;

mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.zt5sd.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
});

const connect = 0;

app.use(cors());
app.use((req, res, next) => {
  req.io = io;

  next();
});

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));
app.use(require('./routes'));
server.listen(3333);