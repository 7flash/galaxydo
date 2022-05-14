import { mutation } from "convex-dev/server";

export default mutation(async ({ db }, name, author) => {
    db.insert("solutions", { name, author });
});