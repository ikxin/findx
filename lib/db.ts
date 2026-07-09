import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { cache } from "react";

export const getDb = cache(() => {
	return drizzle(env.DB);
});

export const getDbAsync = cache(async () => {
	return drizzle(env.DB);
});

export type Db = ReturnType<typeof getDb>;
