import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import config from "./config";

export default mutation(async ({ db }) => {
    let rooms = [];

    for (let i = 1; i <= config.numberOfRooms; i++) {
        const roomName = `${config.fractalPrefix}Room ${i}`;
        rooms.push(roomName);
    }

    const ids = [];
    
    for (const room of rooms) {
        const id = await db.insert(config.roomsTableName, {
            name: room,
            locked: false,
            ranking: [],
        });
        ids.push(id);
    }

    return ids;
});