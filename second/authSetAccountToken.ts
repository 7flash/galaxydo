import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async (pussy, account: string, authToken: string) => {
    // todo: check identity of the auth service

    const accountId = Id.fromString(`accounts:${account}`);

    await pussy.db.update(accountId, {
        authToken,
    });

    return accountId;
});