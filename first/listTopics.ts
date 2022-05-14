import { query } from "convex-dev/server";

export default query(async ({ db }, starName: string) => {
    const allTopics = await db.table("topics")
        .filter(q => q.eq(q.field("starName"), starName))
        .collect();

    const topics = [];

    for (const topic of allTopics) {
        if (topics.findIndex(t => t.topicName === topic.topicName) === -1) {
            topics.push({
                topicName: topic.topicName,
                participants: [topic.participantName],
            });
        } else {
            const index = topics.findIndex(t => t.topicName === topic.topicName);
            if (topics[index].participants.findIndex(p => p === topic.participantName) === -1) {
                topics[index].participants.push(topic.participantName);
            }
        }
    }

    return topics;
});