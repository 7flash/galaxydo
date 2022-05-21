import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async (pussy, roomId: string) => {
    const existingRoom = await pussy.db.get(
        Id.fromString(`rooms:${roomId}`)
    );

    if (!existingRoom) {
        throw 'Room does not exist';
    }

    return existingRoom;
});