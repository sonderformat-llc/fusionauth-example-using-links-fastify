import { cleanEnv, port, str, url } from "envalid";

export const env = cleanEnv(process.env, {
	FUSIONAUTH_URL: url(),
	FUSIONAUTH_API_KEY: str(),
	FUSIONAUTH_CLIENT_ID: str(),
	FUSIONAUTH_CLIENT_SECRET: str(),
	FUSIONAUTH_REDIRECT_URI: url(),

	TWITTER_PROVIDER_ID: str(),
	TWITTER_API_KEY: str(),
	TWITTER_API_SECRET: str(),

	GOOGLE_PROVIDER_ID: str(),
	GOOGLE_CLIENT_ID: str(),
	GOOGLE_CLIENT_SECRET: str(),

	SESSION_SECRET: str({
		default: "this_should_be_at_least_32_chars_long_and_secure_random_string",
	}),

	PORT: port({ default: 3000 }),
});
