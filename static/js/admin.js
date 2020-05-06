var userSelected;
var form = document.getElementById('form');
var message = document.getElementById('message');
var clientsStore = {};
var userActive = document.getElementById('userActive');
var clients = document.getElementById('clients');

function httpGet(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();
    request.onload = function () {
        if (this.status === 200) {
            var res = JSON.parse(this.response);
            callback(res);
        }
    }
}

window.addEventListener('load', function () {
    httpGet('/getuser', function (res) {
        currentUser = res.data;
        init();
    })
});

function init() {
    document.getElementById('userName').innerText = currentUser.name;
    socket.emit('getclients');
}

socket.on('clients', function (data) {
    Object.keys(data).forEach(function (userName) {
        var current = data[userName];
        if (!clientsStore[current.user]) {
            var model = Object.assign({}, {
                name: 'Cliente ' + current.user,
                newMessages: [],
                chat: []
            }, current);

            var userElement = getUserElement(model);
            userElement.setAttribute('user', current.user);
            userElement.removeEventListener('click', actionLi);
            userElement.addEventListener('click', actionLi);
            model.element = userElement;
            clientsStore[current.user] = model;
            clients.appendChild(model.element);
        }
    });
});

function getUserElement(data) {
    function pennding(msgs) {
        if (Array.isArray(msgs) && msgs.length) {
            return '<div class="info"><span>' + msgs.length + '</span></div>';
        } else {
            return '';
        }
    }

    var body =
        '<div class="user-li-content">' +
        '<div class="avatar">' +
        '<div class="avatar-container">' +
        '<img src="/static/img/hombre.svg"/>' +
        '</div>' +
        '</div>' +
        '<div class="user-info">' +
        '<div class="name">' +
        '<span>' + data.name + '</span>' +
        pennding(data.newMessages) +
        '</div>' +
        '</div>' +
        '</div>';

    var userElement = document.createElement('div');
    userElement.classList.add('user-li');
    userElement.innerHTML = body;
    return userElement;
}

function actionLi() {
    Object.keys(clientsStore).forEach(function (c) {
        clientsStore[c].element.classList.remove('active');
    });
    userSelected = this.getAttribute('user');
    userActive.innerText = clientsStore[userSelected].name;
    this.classList.add('active');
    openClientMessages(userSelected);
    goButton();
    message.focus();
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (userSelected && message.value.trim() !== '') {
        if (clientsStore[userSelected]) {
            var send = {msg: {text: message.value, time: currentTime()}, from: currentUser, to: userSelected};
            socket.emit("private", send);
            clientsStore[userSelected].chat.push(send);
            messages.add(send);
        } else {
            messages.notify('El usuario se ha desconectado')
        }

        goButton();
        message.value = '';
        message.focus();
    }
});

socket.on('quest', function (data) {
    if (userSelected === data.from.user) {
        clientsStore[data.from.user].chat.push(data);
        messages.add(data);
        goButton();
        socket.emit('delNewMessages', data.from.user);
    } else {
        clientsStore[data.from.user].newMessages.push(data.msg);
        updateNroPending(data.from.user);
    }
});

function openClientMessages(clientId) {
    chat.innerHTML = '';
    var client = clientsStore[clientId];
    client.chat = client.chat.concat(client.newMessages.map(function (message) {
        return {from: {user: client.user, name: client.name}, msg: message};
    }));
    client.chat.forEach(function (msg) {
        messages.add(msg);
    });
    socket.emit('delNewMessages', clientId);
    clientsStore[clientId].newMessages = [];
    updateNroPending(clientId);
}

function updateNroPending(clientId) {
    var client = clientsStore[clientId];
    var count = client.newMessages.length;
    var name = client.element.querySelector('.name');
    var info = name.querySelector('.info');
    if (count) {
        if (info) {
            info.innerHTML = '<span>' + count + '</span>';
        } else {
            var div = document.createElement('div');
            div.classList.add('info');
            div.innerHTML = '<span>' + count + '</span>';
            name.appendChild(div);
        }
    } else {
        if (info) {
            name.removeChild(info);
        }
    }
}

socket.on('userleft', function (user) {
    clientsStore[user].element.parentNode.removeChild(clientsStore[user].element);
    delete clientsStore[user];
});

socket.on('deletedNewMessages', function (user) {
    updateNroPending(user);
});
