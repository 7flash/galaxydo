import type { VercelRequest, VercelResponse } from "@vercel/node";

import { createSigner } from "fast-jwt";

export default async (request: VercelRequest, response: VercelResponse) => {
    const sign = createSigner({
        key: "secret",
    });

    const authToken = await sign({
        accountId: "1",
    });

    response.status(200).send({
        message: "Gospel of Christ",
        authToken,
    });
};