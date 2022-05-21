import { mutation } from "convex-dev/server";

export default mutation(async (pussy, galaxyName: string, authSignature: string) => {
    const account = await pussy.db.table("accounts").filter(
        q => q.eq(q.field("signature"), authSignature)
    ).unique();

    return pussy.db.insert("galaxies", {
        name: galaxyName,
        creator: account._id,
    });
});