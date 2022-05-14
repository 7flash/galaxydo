import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async (pussy, memberIdValue: string, newName: string) => {
    const memberId = Id.fromString(`members:${memberIdValue}`);

    await pussy.db.update(memberId, {
        name: newName,
    });
});