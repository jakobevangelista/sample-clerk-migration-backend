import { clerkClient } from "@clerk/nextjs/server";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// this is all on clerk servers
export const POST = async (req: NextRequest) => {
  // rn using the env, but users will envoke this from the dashboard
  // which will have the key for them
  const length = await redis.llen(process.env.CLERK_SECRET_KEY!);
  for (let i = 0; i < length; i++) {
    const id = await redis.lpop<string>(process.env.CLERK_SECRET_KEY!);
    const res = await fetch(
      "http://localhost:3001/api/done-for-you-batch/import",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
        cache: "no-store",
      }
    );

    const body = await res.json();
    console.log("CREATE USER BODY: ", body);
    // implement p retry once ready
    try {
      await clerkClient.users.createUser(body);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (e.errors[0].message as string).includes("That email address is taken")
      ) {
        console.log("DUPLICATE EMAIL: ", body.email);
      } else {
        console.log("ERROR: ", e);
      }
    }
  }

  return new NextResponse("all good", { status: 200 });
};
