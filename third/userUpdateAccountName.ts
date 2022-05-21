import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async (pussy, newName: string, signature: string) => {
    const account = await pussy.db.table("accounts").filter(
        q => q.eq(q.field("signature"), signature)    
    ).unique();

    await pussy.db.update(account._id, {
        name: newName,
    });

    const proposal = await pussy.db.table("proposals").filter(
        q => q.eq(q.field("account"), account._id)
    ).first();

    // automatically create proposal where user choose himself
    if (!proposal) {
        await pussy.db.insert("proposals", {
            account: account._id,
            name: newName,
        });
    }

    // using account name as identifier.. instead of ip address.. perform authorization once account name entered..
    // but check this account name not used yet.. otherwise show an error.. name already taken..
    // the same with rooms..

    // check existing account name - not allow to use the one already in use recently..

    // all existing proposals showing new name (because its dinamically fetched)

    // only allow to choose another user name from popup

    // when I change my chosen one.. those who choose me.. should automatically switch to him
});