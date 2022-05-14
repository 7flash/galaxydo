import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async (pussy, authSignature: string) => {
    if (!authSignature) return {};

    const account = await pussy.db.table("accounts").filter(
        q => q.eq(q.field("signature"), authSignature)
    ).unique();

    const proposal = await pussy.db.table("proposals").filter(
        q => q.eq(q.field("account"), account._id)
    ).first();

    return proposal;
});