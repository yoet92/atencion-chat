var form = document.getElementById('form');
var message = document.getElementById('message');
var userActive = document.getElementById('userActive');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

window.addEventListener('load', function () {
    var localUser = localStorage.getItem('user');
    if (localUser) {
        currentUser = JSON.parse(localUser);
    } else {
        var id = uuidv4();
        currentUser = {
            name: null,
            user: id
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
    }

    socket.emit('register', currentUser);
    messages.add({
        from: {user: 'admin', name: 'Admin'},
        msg: {text: 'Hola, ¿Cómo podemos ayudarte?', time: currentTime()}
    });
    message.focus();
});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (message.value.trim() !== '') {
        var msg = {from: currentUser, msg: {text: message.value, time: currentTime()}};
        messages.add(msg);
        socket.emit('req', msg);
        goButton();
        message.value = '';
        message.focus();
    }
});

socket.on('private', function (data) {
    messages.add(data);
    userActive.innerText = data.from.name;
    goButton();
});



