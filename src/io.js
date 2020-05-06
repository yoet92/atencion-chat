const usersConnected = {};

module.exports = (io) => {
    io.on('connection', socket => {

        socket.on('register', function (newUser) {
            newUser.sid = socket.id;
            newUser.newMessages = [];
            newUser.address = socket.handshake.address;
            newUser.name = socket.handshake.address; // Temporal
            usersConnected[newUser.user] = newUser;
            io.sockets.emit('clients', usersConnected);
        });

        socket.on('getclients', function () {
            io.sockets.emit('clients', usersConnected);
        });

        socket.on('req', function (data) {
            usersConnected[data.from.user].newMessages.push(data.msg);
            io.sockets.emit('quest', data);
        });

        socket.on('delNewMessages', function (user) {
            if (usersConnected[user]) {
                usersConnected[user].newMessages = [];
            }
            io.sockets.emit('deletedNewMessages', user);
        });

        socket.on('private', function (data) {
            const {to, ...msg} = data;

            if (usersConnected.hasOwnProperty(to)) {
                socket.broadcast.to(usersConnected[to].sid).emit('private', msg);
            }
        });

        socket.on('disconnect', (reason) => {
            const current = Object.keys(usersConnected).find(function (u) {
                return usersConnected[u].sid === socket.id;
            });
            if (current) {
                delete usersConnected[current];
                io.sockets.emit('userleft', current);
            }
        });
    })
};

