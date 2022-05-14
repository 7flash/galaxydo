import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async ({ db }, topic: Id, user: string, proposal: string) => {
    db.insert("discussions", { topic, user, proposal });
});