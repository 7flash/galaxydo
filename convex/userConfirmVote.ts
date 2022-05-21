import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import config from "./config";

export default mutation(async ({ db }, userId: string) => {
    if (!userId || userId.length == 0) return null;

    const account = await db.get(Id.fromString(userId));

    const consensusUsers = await db.table('users').filter(
        (q) => q.and(
            q.eq(q.field('room'), account.room),
            q.eq(q.field('vote'), account.vote),
        )
    ).collect();

    if (consensusUsers.length >= config.requiredConsensus) {
        const delegate = await db.table('users').filter(
            (q) => q.and(
                q.eq(q.field('room'), account.room),
                q.eq(q.field('name'), account.vote),
            ),
        ).unique();

        let delegateRanking = config.highestRanking;

        {
            const rankedUsers = await db.table('users').filter(
                (q) => q.and(
                    q.eq(q.field('room'), account.room),
                    q.gt(q.field('ranking'), 0),
                ),
            ).collect();    

            if (rankedUsers.length > 0) {
                const highestRanking = rankedUsers.sort((a, b) => {
                    if (a.ranking > b.ranking) return -1;
                    if (a.ranking < b.ranking) return 1;
                    return 0;
                }).pop().ranking;

                delegateRanking = highestRanking - 1;
            }
        }
        
        db.update(
            delegate._id,
            {
                ranking: delegateRanking,
            }
        )

        const users = await db.table('users').filter(
            (q) => q.eq(q.field('room'), account.room)
        ).collect();

        for (const user of users) {
            const value = {
                hasConfirmed: true,
                hasVoted: false,
                vote: ''
            };

            if (!user.ranking) {
                value.vote = user.name; 
            }

            db.update(
                user._id,
                value,
            )
        }

        {
            const room = await db.table(config.roomsTableName).filter(
                (q) => q.eq(q.field('name'), account.room),
            ).first();
            
            if (room) {
                let roomData = {
                    locked: true,
                    completed: false,
                    ranking: [''],
                };

                if (delegateRanking == 1) {
                    roomData.completed = true;

                    const rankedUsers = await db.table('users').filter(
                        (q) => q.and(
                            q.eq(q.field('room'), account.room),
                            q.gt(q.field('ranking'), 0),
                        ),
                    ).collect();    
        
                    const rankedUsersNames = rankedUsers.sort((a, b) => {
                            if (a.ranking > b.ranking) return -1;
                            if (a.ranking < b.ranking) return 1;
                            return 0;
                    }).map((user) => user.name);

                    roomData.ranking = rankedUsersNames;                    
                }

                db.update(
                    room._id,
                    roomData
                );
            }
        }
    }
});