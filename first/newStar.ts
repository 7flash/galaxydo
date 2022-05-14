import { mutation } from "convex-dev/server";

export default mutation(async ({ db }, name, aliveAt) => {
    db.insert("stars", { name, aliveAt });
});