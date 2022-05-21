import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async (pussy, accountSignature) => {
    const account = await pussy.db.table("accounts").filter(
        q => q.eq(q.field("signature"), accountSignature)
    ).unique();

    // const myProposal = await pussy.db.table("proposals").filter(
    //     q => q.eq(q.field("account"), account._id)
    // ).first();

    const galaxies = await pussy.db.table("galaxies").collect();

    let accounts = await pussy.db.table("accounts").collect();

    return accounts.filter(account => !!account && account.name).filter(account => {
        let alreadyChosen = false;

        for (const galaxy of galaxies) {
            if (galaxy.name === account.name) {
                alreadyChosen = true;
            }
        }

        return !alreadyChosen;
    });

    // return accounts.filter(account => account != null).map(account => account.name);
});