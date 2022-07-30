import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import config from "./config";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default mutation(async ({ db }) => {
    let rooms = [];

    const d = new Date();
    const fractalPrefix = `${monthNames[d.getMonth()]} ${d.getDate()} `;

    for (let i = 1; i <= config.numberOfRooms; i++) {
        const roomName = `${fractalPrefix}Room ${i}`;
        rooms.push(roomName);
    }

    const ids = [];

    const existingRooms = await db.table(config.roomsTableName)
        .collect();

    for (let i = 0; i < existingRooms.length; i++) {
        if (existingRooms[i].name.startsWith(fractalPrefix)) {
            throw 'meeting already started';
        }
        await db.delete(existingRooms[i]._id);
    }

    const existingUsers = await db.table(config.usersTableName)
        .collect();

    for (let i = 0; i < existingUsers.length; i++) {
        await db.delete(existingUsers[i]._id);
    }
    
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