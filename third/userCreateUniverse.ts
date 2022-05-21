import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

// TODO: groups can be of 5 either 6 members each!

export default mutation(async (pussy, universeName: string) => {
    const galaxies = await pussy.db.table("galaxies").collect();
    
    const universe = [];
    for (const galaxy of galaxies) {
        universe.push(galaxy.name);

        pussy.db.delete(galaxy._id);
    }

    if (universe.length != 6) {
        throw new Error("Not enough galaxies");
    }

    const universeId = await pussy.db.insert("universes", {
        name: universeName,
        galaxies: universe,
    });

    return universeId;
});