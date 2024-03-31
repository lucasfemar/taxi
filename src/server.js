import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import createMap from '../public/map.js';
dotenv.config();

const app = express();
const server = createServer(app);
const sockets = new Server(server);

app.use(express.json());
app.use(express.static('public'));

const map = createMap();

map.subscribe((command) => {
    sockets.emit(command.type, command);
});

sockets.on('connection', (socket) => {
    const driverId = socket.id;

    socket.emit('setup', map.state);

    socket.on('add_driver', (driver) => {
        driver.id = driverId;
        console.log(`> Server: Request new driver ${driver.id}`);
        map.addDriver(driver);
    });

    socket.on('update_driver_position', (driver) => {
        console.log(`> Server: Request new driver postition ${driver.position}`);
        map.updateDriverPosition(driver);
    });

    socket.on('disconnect', () => {
        map.removeDriver({ id: driverId });
        console.log(`> Server: Request delete driver ${driverId}`);
    });
});

server.listen(8080, () => {
    console.log('\x1b[36m%s\x1b[0m', 'Server running at http://localhost:8080');
});
