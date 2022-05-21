import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

const defaultRoom = 'May 21th.. Room #1';

export default mutation(async ({ db }, userId: string, userName: string) => {
    if (!userId || userId.length == 0) {
        return db.insert('users', {
            name: userName,
            room: defaultRoom,
        });
    }

    return db.update(
        Id.fromString(userId),
        {
            name: userName,
        }
    );
});