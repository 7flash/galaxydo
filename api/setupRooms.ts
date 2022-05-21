import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ConvexHttpClient } from "convex-dev/browser";

const convex = new ConvexHttpClient("https://giddy-shrew-41.convex.cloud");

export default async (request: VercelRequest, response: VercelResponse) => {
    const result = await convex.mutation("apiSetupRooms")();

    response.status(200).send(result);
};