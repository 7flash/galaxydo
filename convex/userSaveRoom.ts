import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async ({ db }, userId: string, roomName: string) => {
    const user = await db.get(Id.fromString(userId));
    
    if (user.hasConfirmed) {
        throw new Error("User has already confirmed ranking vote");
    }

    return db.update(
        Id.fromString(userId),
        {
            room: roomName,
            vote: user.name,
        }
    );
});