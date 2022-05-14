import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async ({ db }, challenge: Id) => {
    return db.table("challenges").filter(q => q.eq(q.field("_id"), challenge)).first();
});