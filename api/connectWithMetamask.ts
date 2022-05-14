import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ConvexHttpClient } from "convex-dev/browser";
import { verify } from "web3-token";

const convex = new ConvexHttpClient("https://animated-loris-663.convex.cloud");

export default async (request: VercelRequest, response: VercelResponse) => {
    const signature = request.body.signature;

    const { address, body } = await verify(signature);

    const account = await convex.mutation("authCreateAccount")(address, signature);

    response.status(200).send({
        accountId: account.accountId,
        authToken: account.authToken,
    });
};