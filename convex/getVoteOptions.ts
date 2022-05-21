import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async ({ db }, userId: string) => {
    if (!userId) return null;

    const account = await db.get(Id.fromString(userId));

    return db.table('users').filter(
        (q) => q.and(
            q.eq(q.field('room'), account.room),
            q.not(
                q.gt(q.field('ranking'), 0)
            ),
            q.neq(q.field('name'), account.vote)
        )
    ).collect();
});