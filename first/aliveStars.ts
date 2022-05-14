import { query } from "convex-dev/server";

export default query(async ({ db }) => {
    const stars = await db.table("stars").collect();
    return stars;
});