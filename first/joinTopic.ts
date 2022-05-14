import { mutation } from "convex-dev/server";

export default mutation(async ({ db }, starName, topicName, participantName) => {
    db.insert("topics", { starName, topicName, participantName });

    db.update
});