import { createReadStream } from "node:fs";
import path from "node:path";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { env } from "../env";
import type { SocialMediaConnection } from "./base";

export const YoutubeSocialConnection: SocialMediaConnection = {
	id: "youtube",
	providerId: env.GOOGLE_PROVIDER_ID,
	name: "Youtube",
	icon: "bi bi-youtube",
	url: "https://www.twitter.com",
	color: "#ff0000",
	upload: async (token, file) => {
		try {
			const authClient = new OAuth2Client({
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
				redirectUri: "https://local.fusionauth.io/oauth2/callback",
			});
			authClient.setCredentials({
				refresh_token: token,
			});

			google.options({ auth: authClient });

			const insert = await google.youtube("v3").videos.insert({
				part: ["snippet", "status"],
				requestBody: {
					snippet: {
						title: "Test Upload",
						description: "Test Description",
					},
					status: {
						privacyStatus: "private",
					},
				},
				media: {
					body: createReadStream(path.resolve(file)),
				},
			});

			return `https://www.youtube.com/watch?v=${insert.data.id}`;
		} catch (e) {
			console.error(e);
			throw e;
		}
	},
};
