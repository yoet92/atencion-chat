const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const sio = require('socket.io');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({secret: 'KEY'}));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.set('port', process.env.PORT || 3000);
app.use('/', require(path.join(__dirname, 'src/router')));
const port = app.get('port');
const server = app.listen(port, function () {
    console.log('SERVER RUNNING IN PORT:', port);
});
const io = sio(server);
require('./src/io')(io);
