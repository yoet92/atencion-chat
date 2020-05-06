var socket = io('/');
var currentUser;
var chat = document.getElementById('chat');
var messagesContainer = document.querySelector('.messages-container');
var svgIn = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" fill="#0000000" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path><path fill="currentColor" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"></path></svg>';
var svgOut = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path><path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path></svg>';

var messages = (function () {

    function add(msg) {
        putMsg(msg);
    }

    function putMsg(message) {
        var containerMsg = document.createElement('div');
        var isOwn = message.from.user === currentUser.user;
        containerMsg.classList.add('copyable-area', 'msg', isOwn ? 'out' : 'in');
        var bodyMsg = '<div class="msg-body">' +
            '<span class="icon">' + (isOwn ? svgOut : svgIn) + '</span>' +
            '<div class="msg">' +
            '<span>' + message.msg.text + '</span>' +
            '<span class="time">' + message.msg.time + '</span>' +
            '</div>' +
            '</div>';
        containerMsg.innerHTML = bodyMsg;
        chat.appendChild(containerMsg);
    }
    function notify(message) {
        var containerMsg = document.createElement('div');
        containerMsg.classList.add('copyable-area', 'msg');
        var bodyMsg = '<div class="msg-body">' +
            '<div class="notify">' +
            '<span>' + message + '</span>' +
            '</div>' +
            '</div>';
        containerMsg.innerHTML = bodyMsg;
        chat.appendChild(containerMsg);
    }
    return {
        add: add,
        notify: notify
    }

})();

function goButton() {
    var csh = chat.scrollHeight;
    var eh = messagesContainer.offsetHeight;
    messagesContainer.scrollTop = csh - eh;
}

function currentTime() {
    return new Date().toLocaleTimeString().split(':').slice(0, 2).join(':');
}
