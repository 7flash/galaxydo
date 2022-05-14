import type { VercelRequest, VercelResponse } from "@vercel/node";

import { createSigner } from "fast-jwt";

import { ConvexHttpClient } from "convex-dev/browser";
import { Id } from "convex-dev/values";
// import convexConfig from "../convex.json";

// console.log(convexConfig)

const convex = new ConvexHttpClient("https://animated-loris-663.convex.cloud");

export default async (request: VercelRequest, response: VercelResponse) => {
    const sign = createSigner({
        key: "top-secret",
    });

    const accountId = await convex.mutation("authCreateNewAccount")();

    const authToken = await sign(accountId);

    await convex.mutation("authSetAccountToken", accountId, authToken);

    response.status(200).send({
        accountId,
        authToken,
    });
};