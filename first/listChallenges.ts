import { query } from "convex-dev/server";

export default query(async ({ db }) => {
    const challenges = await db.table("challenges").collect();
    return challenges;
});