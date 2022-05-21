import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async ({ db }, userId: string) => {
    if (!userId) return null;

    const account = await db.get(Id.fromString(userId));

    if (!account) {
        throw new Error("User not found");
    }

    return db.table('users').filter(
        (q) => q.and(
            q.eq(q.field('room'), account.room),
            q.neq(q.field('_id'), account._id)
        )
    ).collect();
});