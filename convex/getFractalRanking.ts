import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async ({ db }, userId: string) => {
    if (!userId) return null;

    const account = await db.get(Id.fromString(userId));

    if (!account) {
        throw new Error("User not found");
    }

    const rankedUsers = await db.table('users').filter(
        (q) => q.and(
            q.eq(q.field('room'), account.room),
            q.gt(q.field('ranking'), 0)
        )
    ).collect();

    return rankedUsers.sort((a, b) => {
        if (a.ranking > b.ranking) return -1;
        if (a.ranking < b.ranking) return 1;
        return 0;
    });
});