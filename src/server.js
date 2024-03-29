import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path, { dirname, join } from 'node:path';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

const drivers = [];

app.use(express.json());
app.use(express.static('public'));

app.post('/', (request, response) => {
    const { name, credential, carModel, carPlate } = request.body;
    console.log({ name, credential, carModel, carPlate });
    const token = new Date();
    try {
        drivers.push({
            name,
            credential,
            carModel,
            carPlate,
            token,
        });
        response.status(200).json({
            token,
            credential,
        });
    } catch (error) {
        response.status(500).json({ error });
    }
});

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(8080, () => {
    console.log('\x1b[36m%s\x1b[0m', 'Server running at http://localhost:8080');
});
