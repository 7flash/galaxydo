import { query } from "convex-dev/server";

export default query(async (pussy, accountSignature: string) => {
    const account = await pussy.db.table("accounts").filter(
        q => q.eq(q.field("signature"), accountSignature)
    ).unique();

    const myProposal = await pussy.db.table("proposals").filter(
        q => q.eq(q.field("account"), account._id)
    ).first();

    const otherProposals = await pussy.db.table("proposals").filter(
        q => q.neq(q.field("account"), account._id)
    ).collect();

    const totalNumber = otherProposals.length;
    let consensysNumber = 0;

    for (const proposal of otherProposals) {
        if (proposal.name === myProposal.name) {
            consensysNumber++;
        }
    }

    return { totalNumber, consensysNumber };
});