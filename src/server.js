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
        console.log(`> Server: request new driver ${driver.id}`);
        map.addDriver(driver);
    });

    socket.on('delete_driver', (driver) => {
        console.log(`> Server: request remove driver ${driver.id}`);
        map.removeDriver(driver);
    });

    socket.on('update_driver_position', (driverData) => {
        console.log(`> Server: request new driver postition ${driverData.id}`);
        map.updateDriverPosition(driverData);
    });

    socket.on('disconnect', () => {
        map.removeDriver({ id: driverId });
    });
});

server.listen(8080, () => {
    console.log('\x1b[36m%s\x1b[0m', 'Server running at http://localhost:8080');
});
