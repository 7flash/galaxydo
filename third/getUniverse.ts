import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async (pussy, universeId: string) => {
    return pussy.db.get(
        Id.fromString(universeId)
    );
});