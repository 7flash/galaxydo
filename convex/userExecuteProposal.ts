import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async (pussy, authSignature: string) => {
    const account = await pussy.db.table("accounts").filter(
        q => q.eq(q.field("signature"), authSignature)
    ).unique();

    const myProposal = await pussy.db.table("proposals").filter(
        q => q.eq(q.field("account"), account._id)
    ).unique();

    const galaxyId = await pussy.db.insert("galaxies", {
        name: myProposal.name,
        creator: account._id,
    });

    const proposals = await pussy.db.table("proposals").collect();

    for (const proposal of proposals) {
        pussy.db.delete(proposal._id);
    }

    return galaxyId;
});