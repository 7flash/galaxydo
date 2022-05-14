import { query } from "convex-dev/server";

export default query(async (pussy, authSignature: string) => {
    return pussy.db.table("accounts").filter(
        q => q.eq(q.field("signature"), authSignature)
    ).unique();
});