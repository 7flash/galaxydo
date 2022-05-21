import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import config from "./config";

export default mutation(async ({ db }, userId: string, userName: string) => {
    let verifiedUserName = '';

    let counter = 0;
    while (!verifiedUserName) {
        const existingName = await db.table("users").filter(
            (q) => q.eq(q.field("name"), userName)
        ).first();
        
        if (existingName) {
            userName = `${userName} (${++counter})`;
        } else {
            verifiedUserName = userName;
        }
    }
    
    if (!userId || userId.length == 0) {
        return db.insert('users', {
            name: verifiedUserName,
            room: config.defaultRoom,
            vote: verifiedUserName,            
        });
    }

    return db.update(
        Id.fromString(userId),
        {
            name: verifiedUserName,
            vote: verifiedUserName,        
        }
    );
});