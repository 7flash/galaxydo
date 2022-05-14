import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async (pussy, proposalId: string, authSignature: string) => {
    await pussy.db.delete(
        Id.fromString(proposalId)
    );

    return true;
});