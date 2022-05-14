import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async ({ db }, name: string, challenge: Id) => {
    db.insert("proposals", { name, challenge });
});