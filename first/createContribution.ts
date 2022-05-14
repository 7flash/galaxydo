import { mutation } from "convex-dev/server";

export default mutation(async ({ db }, contributionText: string, starName: string) => {
    db.insert("contributions", { contributionText, starName });
});