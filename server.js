const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const dotenv = require('dotenv');
const process = require('process');
const CryptoJS = require('crypto-js');
const { Server } = require('socket.io');

// Memuat environment
dotenv.config();

const webServer = createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    
    if (process.env.APP_STATE === 'down') {
        console.log('Application down');
        return;
    }

    await handle(req, res, parsedUrl)
}).once('error', () => {
    console.log('Error');
    process.exit(1);
});

const io = new Server(webServer);

// server side env
setInterval(() => {
    dotenv.config();
}, 10000);

const hostname = '0.0.0.0';
const port = 3000;

const app = next({
    dev: process.env.APP_ENV !== 'production',
    hostname,
    port
});
const handle = app.getRequestHandler();

// Env overriding
process.env.APP_KEY = CryptoJS.MD5('simi:' + process.env.APP_KEY);
process.env.DB_CREDENTIAL = CryptoJS.MD5('simi:' + process.env.DB_USERNAME + ';' + process.env.DB_PASSWORD);

app.prepare().then(() => {
    webServer.listen(port, () => {
        console.log('Server started');
    });
});