import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async ({ db }, userId: string) => {
    console.log({ userId })

    if (!userId || userId.length == 0) return null;

    const account = await db.get(Id.fromString(userId));

    console.log("account", account);

    return account;
});