import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async (pussy, accountId: Id) => {
    return pussy.db.get(accountId);
});