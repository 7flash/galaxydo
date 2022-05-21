import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async (pussy, fractalName: string, roomId: string, authSignature: string) => {
    const existingRoom = await pussy.db.get(
        Id.fromString(`rooms:${roomId}`)
    );

    if (!existingRoom) {
        throw 'Room does not exist';
    }

    const account = await pussy.db.table("accounts").filter(
        q => q.eq(q.field("signature"), authSignature)
    ).unique();

    await pussy.db.update(account._id, {
        room: roomId,
    });
});