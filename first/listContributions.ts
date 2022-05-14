import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async ({ db }, starName: string) => {
    const contributions = await db
        .table("contributions")
        .filter(q => q.eq(q.field("starName"), starName))
        .collect();
    return contributions;
});