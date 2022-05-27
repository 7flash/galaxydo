import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import config from "./config";

export default mutation(async ({ db }, userId: string) => {
    if (!userId || userId.length == 0) return null;

    const account = await db.get(Id.fromString(userId));

    const consensusUsers = await db.table(config.usersTableName).filter(
        (q) => q.and(
            q.eq(q.field('room'), account.room),
            q.eq(q.field('vote'), account.vote),
        )
    ).collect();

    const totalUsers = await db.table(config.usersTableName).filter(
        (q) => q.eq(q.field('room'), account.room),
    ).collect();

    let requiredConsensus = config.requiredConsensus;

    if (totalUsers.length == 5) {
        requiredConsensus -= 1;
    }

    if (consensusUsers.length >=requiredConsensus) {
        const delegate = await db.table(config.usersTableName).filter(
            (q) => q.and(
                q.eq(q.field('room'), account.room),
                q.eq(q.field('name'), account.vote),
            ),
        ).unique();

        let delegateRanking = config.maxRanking;

        {
            const rankedUsers = await db.table(config.usersTableName).filter(
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

        const users = await db.table(config.usersTableName).filter(
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

                let rankingCompleted = false;

                const rankedUsers = await db.table(config.usersTableName).filter(
                    (q) => q.and(
                        q.eq(q.field('room'), account.room),
                        q.gt(q.field('ranking'), 0),
                    ),
                ).collect();

                if (totalUsers.length == rankedUsers.length) {
                    rankingCompleted = true;
                }

                if (rankingCompleted) {
                    roomData.completed = true;

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