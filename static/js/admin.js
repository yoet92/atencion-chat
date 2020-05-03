var socket = io('/');
var currentUser;
var userSelected;
var form = document.getElementById('form');
var message = document.getElementById('message');
var chat = document.getElementById('chat');

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
}

socket.on('getclients', function (data) {
    console.log(data);
    if (Array.isArray(data) && data.length) {
        var ul = document.getElementById('clients');
        ul.innerHTML = '';
        data.forEach(function (id) {
            var li = document.createElement('li');
            li.innerText = 'Cliente ' + id;
            li.setAttribute('user', id);
            li.addEventListener('click', actionLi);
            ul.appendChild(li);
        })
    }
});

function actionLi() {
    for (var i = 0, len = this.parentNode.childNodes.length; i < len; i++) {
        this.parentNode.childNodes[i].classList.remove('selected');
    }
    userSelected = this.getAttribute('user');
    this.classList.add('selected');
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('submit', message.value);
    if (userSelected) {
        socket.emit("private", {msg: message.value, from: currentUser.name, to: userSelected});
    }
});

socket.on('quest', function (data) {
    console.log(data);
    var user = data.user;
    var msg = data.msg;
    var current = document.querySelector('[user="' + user + '"]');
    if (!current.classList.contains('quest')) {
        current.classList.add('quest');
    }
});
