import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

const rooms = [
    'May 21th.. Room 1',
    'May 21th.. Room 2',
    'May 21th.. Room 3',
    'May 21th.. Room 4',
    'May 21th.. Room 5',
]

export default query(async ({ db }, userId: string) => {
    const account = await db.get(Id.fromString(userId));

    return rooms.filter(
        room => room !== account.room
    );

    // const rooms = await db.table("users").filter(
    //     q => q.neq(q.field("room"), account.room)
    // ).collect();

    // return account;
});