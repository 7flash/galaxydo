import { mutation } from "convex-dev/server";

export default mutation(async (pussy, roomName: string, fractalName: string) => {
    const existingRoom = await pussy.db.table("rooms").filter(
        q => q.eq(q.field("fractalName"), fractalName) && q.eq(q.field("roomName"), roomName)
    ).first();

    if (existingRoom) {
        throw 'Room already exists';
    }

    const roomId = await pussy.db.insert("rooms", {
        roomName, fractalName
    });

    return roomId;
});