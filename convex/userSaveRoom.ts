import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async ({ db }, userId: string, roomName: string) => {
    return db.update(
        Id.fromString(userId),
        {
            room: roomName,
        }
    );
});