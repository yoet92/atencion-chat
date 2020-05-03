const usersConnected = {};

module.exports = (io) => {
    io.on('connection', socket => {

        socket.on('register', function (user) {
            user.sid = socket.id;
            usersConnected[user.user] = user;
            io.sockets.emit('getclients', Object.keys(usersConnected));
        });

        socket.on('req', function (data) {
            io.sockets.emit('quest', data);
        });

        socket.on('private', function (data) {
            const {to, ...msg} = data;

            if (usersConnected.hasOwnProperty(to)) {
                socket.broadcast.to(usersConnected[to].sid).emit('private', msg);
            }
        });

        socket.on('disconnect', (reason) => {
            console.log(`user ${socket.id} left the room: ${reason}`);
        });
    })
};

