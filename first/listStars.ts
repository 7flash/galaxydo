import { query } from "convex-dev/server";

export default query(async ({ db }) => {
    const contributions = await db.table("contributions")
        .fullTableScan().collect();

    const stars: string[] = [];

    for (const contribution of contributions) {
        const star = stars.find(s => s === contribution.starName);

        if (!star) {
            stars.push(contribution.starName);
        }
    }

    return stars;
});