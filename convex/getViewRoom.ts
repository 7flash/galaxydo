import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";
import config from "./config";

export default query(async ({ db }, roomName: string) => {
    return db.table(config.roomsTableName).filter(
        (q) => q.eq(q.field('name'), roomName),
    ).unique();
});