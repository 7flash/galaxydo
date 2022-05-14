import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async (pussy, proposedName: string, authSignature: string) => {
    const account = await pussy.db.table("accounts").filter(
        q => q.eq(q.field("signature"), authSignature)
    ).unique();

    const myProposal = await pussy.db.table("proposals").filter(
        q => q.eq(q.field("account"), account._id)
    ).first();

    if (myProposal) {
        pussy.db.update(myProposal._id, {
            name: proposedName,
        });
    } else {
        pussy.db.insert("proposals", {
            name: proposedName,
            account: account._id,
        });
    }

    // const otherProposals = await pussy.db.table("proposals").filter(
    //     q => q.neq(q.field("account"), account._id)
    // ).collect();

    // if (otherProposals.length >= 2) {
    //     let agreedNumber = 0;

    //     for (const proposal of otherProposals) {
    //         if (proposal.name === proposedName) {
    //             agreedNumber++;
    //         }
    //     }

    //     if (agreedNumber == otherProposals.length) {
    //         const newGalaxyId = pussy.db.insert("galaxies", {
    //             name: proposedName,
    //             creator: account._id, // TODO: should be original author of proposal
    //         });

    //         for (const proposal of otherProposals) {
    //             pussy.db.delete(proposal._id);
    //         }

    //         return newGalaxyId;
    //     }
    // }

    // return 0;
});