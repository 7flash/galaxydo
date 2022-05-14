import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ConvexHttpClient } from "convex-dev/browser";

const convex = new ConvexHttpClient("https://animated-loris-663.convex.cloud");

export default async (request: VercelRequest, response: VercelResponse) => {
    const {
        randomBytes
    } = await import("node:crypto");

    const ip = request.headers['x-forwarded-for'];

    if (!ip) {
        response.status(400).send({
            error: "No IP address found",
        });
        return;
    }

    const authToken = randomBytes(16).toString("base64");

    const account = await convex.mutation("authCreateAccount")(ip, authToken);

    response.status(200).send({
        accountId: account.accountId,
        authToken: account.authToken,
    });
};