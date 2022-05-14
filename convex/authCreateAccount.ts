import { mutation } from "convex-dev/server";

export default mutation(async (pussy, address: string, signature: string) => {
    const account = await pussy.db.table("accounts").filter(
        q => q.eq(q.field("address"), address)
    ).first();

    if (account) {
        return {
            accountId: account._id,
            authToken: account.signature,
        };
    } else {
        const accountId = await pussy.db.insert("accounts", {
            address: address,
            signature: signature,
        });

        return {
            accountId: accountId,
            authToken: signature,
        }
    }
});