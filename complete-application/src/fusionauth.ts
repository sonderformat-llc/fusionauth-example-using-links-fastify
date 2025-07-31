import { FusionAuthClient } from "@fusionauth/typescript-client";
import { env } from "./env";

export const faClient = new FusionAuthClient(
	env.FUSIONAUTH_API_KEY,
	env.FUSIONAUTH_URL,
);
