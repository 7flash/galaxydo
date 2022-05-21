import { query } from "convex-dev/server";

export default query(async (pussy, fractalName: string) => {
    const rooms = await pussy.db.table("rooms").collect();

    return rooms;
});