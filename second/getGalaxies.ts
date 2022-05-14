import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async ({ db }, memberIdValue) => {
    const memberId = Id.fromString(`members:${memberIdValue}`);

    const galaxyIds = await db.table("galaxyToMember").filter(
        e => e.eq(e.field("memberId"), memberId)
    ).collect();

    const galaxies = await db.table("galaxies").filter(e =>
        e.or(
            galaxyIds.map(galaxyId =>
                e.eq(e.field("_id"), galaxyId)
            )
        )
    ).collect();
    
    return galaxies;
});