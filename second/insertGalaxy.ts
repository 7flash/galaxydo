import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async (pussy, memberIdValue: string, name: string) => {
    const memberId = Id.fromString(`members:${memberIdValue}`);

    const galaxyId = await pussy.db.insert("galaxies", {
        creatorId: memberId,
        name
    });

    await pussy.db.insert("galaxyToMember", {
        galaxyId,
        memberId,
    })
});