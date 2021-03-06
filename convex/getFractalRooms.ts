import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";
import config from "./config";

export default query(async ({ db }, userId: string) => {
    if (!userId) return null;

    const account = await db.get(Id.fromString(userId));

    if (!account) {
        throw new Error("User not found");
    }

    const rooms = await db.table(config.roomsTableName).filter(
        (q) => q.and(
            q.neq(q.field('name'), account.room),
            q.neq(q.field('locked'), true),
        ),
    ).collect();

    return rooms;
});