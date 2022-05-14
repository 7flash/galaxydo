import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async (pussy) => {
    const identity = await pussy.auth.getUserIdentity();

    if (!identity) {
        return null;
    }

    const user = await pussy.db.table("accounts").filter(
        q => q.eq(q.field("authToken"), identity.tokenIdentifier)
    );

    return user;
});