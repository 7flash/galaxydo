import { query } from "convex-dev/server";

export default query(async (pussy) => {
    const galaxies = await pussy.db.table("galaxies").collect();

    const galaxiesWithAccountNames = await Promise.all(galaxies.map(async (galaxy) => {
        const account = await pussy.db.get(galaxy.creator);
        const accountName = account ? account.name : "Unknown";
        return {
            ...galaxy,
            accountName,
        };
    }));

    return galaxiesWithAccountNames;
});