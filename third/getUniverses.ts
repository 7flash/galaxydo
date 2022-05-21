import { query } from "convex-dev/server";

export default query(async (pussy) => {
    return pussy.db.table("universes").collect();
});