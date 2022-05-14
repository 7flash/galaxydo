import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async ({ db }, challenge: Id) => {
    const proposals = await db
        .table("proposals")
        .filter(q => q.eq(q.field("challenge"), challenge))
        .collect();
    return proposals;
});