export default function createMap() {
    const state = {
        drivers: {},
    };
    const observers = [];

    function subscribe(observerFunction) {
        observers.push(observerFunction);
    }

    function notifyAll(command) {
        observers.forEach((observerFunction) => {
            observerFunction(command);
        });
    }

    function setState(newState) {
        Object.assign(state, newState);
    }

    function addDriver(command) {
        const id = command.id;
        const name = command.name;
        const credential = command.credential;
        const carModel = command.carModel;
        const carPlate = command.carPlate;
        const position = command.position;

        state.drivers[command.id] = {
            id,
            name,
            credential,
            carModel,
            carPlate,
            position,
        };
        console.log(`> Map: Driver added ${JSON.stringify(state.drivers[id])}`);

        notifyAll({
            type: 'new_driver',
            id,
            name,
            credential,
            carModel,
            carPlate,
            position,
        });
    }

    function removeDriver(command) {
        const id = command.id;
        console.log(`> Map: Removing driver ${JSON.stringify(id)}`);

        delete state.drivers[id];

        notifyAll({
            type: 'remove_driver',
            id,
        });
    }

    function updateDriverPosition(command) {
        const id = command.id;
        const name = command.name;
        const credential = command.credential;
        const carModel = command.carModel;
        const carPlate = command.carPlate;
        const position = command.position;
        console.log(`> Map: Updating driver position ${JSON.stringify(position)}`);

        notifyAll({
            type: 'update_driver',
            id,
            name,
            credential,
            carModel,
            carPlate,
            position,
        });
    }

    return {
        state,
        addDriver,
        removeDriver,
        updateDriverPosition,
        subscribe,
        setState,
    };
}
