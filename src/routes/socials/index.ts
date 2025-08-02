import type { FastifyPluginAsync } from "fastify";
import { env } from "../../env";
import { faClient } from "../../fusionauth";

const socials: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get<{ Params: { id: string } }>(
		"/link/:id",
		{
			preValidation: (req, res, done) => {
				if (!req.isAuthenticated()) {
					res.redirect("/login");
				}
				done();
			},
		},
		async (req, rep) => {
			const url = new URL(`${env.FUSIONAUTH_URL}/oauth2/authorize`);
			url.searchParams.set("client_id", env.FUSIONAUTH_CLIENT_ID);

			url.searchParams.set("redirect_uri", env.FUSIONAUTH_REDIRECT_URI);
			url.searchParams.set("response_type", "code");
			url.searchParams.set("scope", "openid offline_access");

			url.searchParams.set(
				"state",
				btoa(
					JSON.stringify({
						c: env.FUSIONAUTH_CLIENT_ID,
						r: env.FUSIONAUTH_URL,
					}),
				),
			);

			url.searchParams.set("idp_hint", req.params.id);

			return rep.redirect(url.toString());
		},
	);

	fastify.get<{ Params: { id: string } }>(
		"/unlink/:id",
		{
			preValidation: (req, res, done) => {
				if (!req.isAuthenticated()) {
					res.redirect("/login");
				}
				done();
			},
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

export default socials;
