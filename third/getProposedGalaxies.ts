import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async (pussy, accountSignature) => {
    const account = await pussy.db.table("accounts").filter(
        q => q.eq(q.field("signature"), accountSignature)
    ).unique();

    const galaxies = await pussy.db.table("proposals").filter(
        q => q.neq(q.field("account"), account._id)
    ).collect();

    const proposalsWithAccountNames = await Promise.all(
        galaxies.map(async (galaxy) => {
            const account = await pussy.db.get(galaxy.account);
            const accountName = account ? account.name : "Unknown";
            return {
                ...galaxy,
                accountName,
            };
        })
    );

    return proposalsWithAccountNames;
});