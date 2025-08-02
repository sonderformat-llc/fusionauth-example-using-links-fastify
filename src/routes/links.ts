import type { FastifyPluginAsync } from "fastify";
import { env } from "../env";
import { faClient } from "../fusionauth";
import { checkAuthenticated } from "../utils";

const links: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get<{ Params: { id: string } }>(
		"/links/:id/link",
		{
			preValidation: checkAuthenticated,
		},
		async (req, rep) => {
			const url = new URL(`${env.FUSIONAUTH_URL}/oauth2/authorize`);
			url.searchParams.set("client_id", env.FUSIONAUTH_CLIENT_ID);

			url.searchParams.set("redirect_uri", env.FUSIONAUTH_REDIRECT_URI);
			url.searchParams.set("response_type", "code");
			url.searchParams.set("scope", "openid offline_access");

			// Generate a secure random state with necessary data and store in session
			const randomBytes = new Uint8Array(16);
			crypto.getRandomValues(randomBytes);
			const randomState = Array.from(randomBytes)
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");

			// Store the state in the session for verification when the user returns
			req.session.set("oauth_state", randomState);

			// Include both the random state and the necessary data
			const stateData = {
				c: env.FUSIONAUTH_CLIENT_ID,
				r: env.FUSIONAUTH_URL,
				s: randomState, // Random state for verification
			};

			// Use Buffer for proper encoding instead of btoa
			url.searchParams.set(
				"state",
				Buffer.from(JSON.stringify(stateData)).toString("base64url"),
			);

			url.searchParams.set("idp_hint", req.params.id);

			return rep.redirect(url.toString());
		},
	);

	fastify.get<{ Params: { id: string } }>(
		"/links/:id/unlink",
		{
			preValidation: checkAuthenticated,
		},
		async (req, rep) => {
			const { id } = req.params;

			const link = await faClient.retrieveUserLinksByUserId(
				id,
				req.user?.id ?? "",
			);

			if (link.response.identityProviderLinks?.length) {
				const { identityProviderId, identityProviderUserId, userId } =
					link.response.identityProviderLinks[0];

				if (identityProviderId && identityProviderUserId && userId) {
					await faClient.deleteUserLink(
						identityProviderId,
						identityProviderUserId,
						userId,
					);
				}
			}
			return rep.redirect("/");
		},
	);
};

export default links;
