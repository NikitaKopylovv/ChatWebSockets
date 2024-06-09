import express from 'express';
import http from 'http';
import WebSocket from 'ws';

interface Message {
    sender: string;
    text: string;
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', (message: string) => {
        const parsedMessage = (message);

        // Отправляем сообщение всем подключенным клиентам, включая отправителя
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(parsedMessage);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
