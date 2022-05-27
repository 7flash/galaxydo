import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";
import config from "./config";

export default query(async ({ db }, userId: string) => {
    if (!userId) return null;

    const account = await db.get(Id.fromString(userId));

    if (!account) {
        throw new Error("User not found");
    }

    let consensusReached = 0;

    if (account.vote && account.vote.length > 0) {
        const consensusUsers = await db.table(config.usersTableName).filter(
            (q) => q.and(
                q.eq(q.field('vote'), account.vote),
                q.eq(q.field('room'), account.room),
            )
        ).collect();
        
        consensusReached = consensusUsers.length;
    }

    const totalUsers = await db.table(config.usersTableName).filter(
        (q) => q.eq(q.field('room'), account.room),
    ).collect();

    let requiredConsensus = config.requiredConsensus;

    if (totalUsers.length == 5) {
        requiredConsensus -= 1;
    }

    return {
        consensusReached: consensusReached,
        requiredConsensus: requiredConsensus,
    }
});