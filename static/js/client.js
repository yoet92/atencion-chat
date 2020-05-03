var socket = io('/');
var currentUser;
var form = document.getElementById('form');
var message = document.getElementById('message');
var chat = document.getElementById('chat');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

window.addEventListener('load', function () {
    var id = uuidv4();
    currentUser = {
        name: 'Cliente ' + id,
        user: id,
        group: 'user'
    };
    socket.emit('register', currentUser);
    init();
});

function init() {
    document.getElementById('userName').innerText = currentUser.name;
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    socket.emit('req', {user: currentUser.user, msg: message.value});
});

socket.on('private', function (data) {

    console.log(data)
});



