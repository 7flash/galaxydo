import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default query(async ({ db }, topicId: Id) => {
    const topic = await db
        .table("topics")
        .filter(q => q.eq(q.field("id"), topicId))
        .unique();

    const discussions = await db
        .table("discussions")
        .filter(q => q.eq(q.field("topic"), topicId))
        .collect();

    const lastProposal = discussions[discussions.length - 1];

    const previousProposal = discussions[discussions.length - 2];

    const postPreProposal = discussions[discussions.length - 3];

    const firstProposal = discussions[0]; 

    return {
        topicName: topic.topicName,
        participants: topic.participants,
        moderatorStar: firstProposal.user,
        currentProposer: lastProposal.user,
        nextProposer: postPreProposal.user,
        currentProposal: lastProposal.proposal,
    }
});