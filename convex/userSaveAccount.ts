import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import config from "./config";

export default mutation(async ({ db }, userId: string, userName: string) => {
    let verifiedUserName = '';

    let counter = 0;
    const originalUserName = userName;
    while (!verifiedUserName) {
        const existingName = await db.table(config.usersTableName).filter(
            (q) => q.eq(q.field("name"), userName)
        ).first();
        
        if (existingName) {
            userName = `${originalUserName} (${++counter})`;
        } else {
            verifiedUserName = userName;
        }
    }
    
    if (!userId || userId.length == 0) {
        return db.insert(config.usersTableName, {
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