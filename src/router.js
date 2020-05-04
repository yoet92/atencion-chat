const express = require('express');
const router = express.Router();
const path = require('path');
const users = require('./users-admin');
const staticUrl = path.join(__dirname, '../', 'static');


function requireAuth(req, res, next) {
    const user = req.session.user;
    if (user && users.find(u => u.user === user.user)) {
        next();
    } else {
        res.status(200)
            .redirect('/login');
    }
}

router.get('/', (req, res) => {
    res.status(200)
        .sendFile(path.join(staticUrl, '/client', 'index.html'));
});

router.get('/admin', requireAuth, (req, res) => {
    res.status(200)
        .sendFile(path.join(staticUrl, '/admin', 'index.html'));
});

router.get('/login', (req, res) => {
    res.status(200)
        .sendFile(path.join(staticUrl, '/login', 'index.html'));
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.post('/login', (req, res) => {
    const user = users.find(u => u.user === req.body.user);
    if (user && user.pass === req.body.pass) {
        const {pass, ...currentUser} = user;
        req.session.user = {...currentUser};
        res.redirect('/admin')
    } else {
        res.status(403).json({
            msg: 'NO AUTORIZADO!!!'
        })
    }
});

router.get('/getuser', (req, res) => {

    if (req.session.user) {
        res.status(200).json({
            data: req.session.user
        })
    } else {
        res.json({
            data: 1
        })
    }

});

router.get('/getclients', requireAuth, (req, res) => {
    res.status(200).json({
        data: clients
    })
});

module.exports = router;
