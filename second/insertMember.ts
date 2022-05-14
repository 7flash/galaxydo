import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async (pussy) => {
    const memberId: Id = await pussy.db.insert("members", {
        name: "Anonymous",
    });
    return memberId.toString().split(":").pop();
});