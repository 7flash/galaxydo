import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async ({ db }, memberIdValue) => {
    const memberId = Id.fromString(`members:${memberIdValue}`);
    const member = await db.get(memberId);
    return member;
});