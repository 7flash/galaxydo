import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async (pussy, authSignature: string) => {
    const account = await pussy.db.table("accounts").filter(
        q => q.eq(q.field("signature"), authSignature)
    ).unique();

    return pussy.db.table("galaxies").filter(
        q => q.eq(q.field("creator"), account._id)
    ).collect();
});