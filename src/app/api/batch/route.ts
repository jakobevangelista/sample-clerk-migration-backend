import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { Redis } from "@upstash/redis";
import { Client } from "@upstash/qstash";
import { clerkClient } from "@clerk/nextjs/server";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  // sample code to get the toke and then feed it into clerk to access their information
  const header = headers();
  const key = header.get("authorization")?.split(" ")[1] as string;
  await redis.rpush(key, body.id.id);
  console.log("INSERTED: ", body.id.id);

  //   const id = await redis.lpop(key);

  //   const schedules = client.schedules;
  //   await schedules.create({
  //     destination: "https://b610-79-127-217-44.ngrok-free.app/api/batch",
  //     cron: "* * * * *",
  //   });

  return NextResponse.json({ message: "Hello from batch" });
};
