import https from "node:https";
import path from "node:path";
import qs from "qs";
import TwitterApi, { type TwitterApiTokens } from "twitter-api-v2";
import { env } from "../env";
import type { SocialMediaConnection } from "./base";

export const TwitterSocialConnection: SocialMediaConnection = {
	id: "twitter",
	providerId: env.TWITTER_PROVIDER_ID,
	name: "Twitter",
	icon: "bi bi-twitter",
	url: "https://twitter.com",
	color: "#1da1f2",
	upload: async (token, file) => {
        try {
            const {oauth_token, oauth_token_secret} = qs.parse(token);
            const twitterClient = new TwitterApi(
                {
                    appKey: env.TWITTER_API_KEY,
                    appSecret: env.TWITTER_API_SECRET,
                    accessToken: oauth_token,
                    accessSecret: oauth_token_secret,
                } as TwitterApiTokens,
                {httpAgent: new https.Agent({keepAlive: false})},
            );

            const mediaId = await twitterClient.v1.uploadMedia(path.resolve(file));

            const tweet = await twitterClient.v2.tweet("My tweet text with a movie!", {
                media: {
                    media_ids: [mediaId],
                },
            });

            return `https://twitter.com/i/statuses/${tweet.data.id}`;
        } catch(e) {
            console.error(e);
            throw e;
        }
	},
};
