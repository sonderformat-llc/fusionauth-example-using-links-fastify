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
			const identityProviderLogin = await faClient.retrieveIdentityProvider(
				"45bb233c-0901-4236-b5ca-ac46e2e0a5a5",
			);
			console.log(identityProviderLogin);

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
			const url = new URL("http://localhost:9011/oauth2/authorize");
			url.searchParams.set("client_id", "1d3c2b11-05bf-46cd-a1e0-84ed965fe782");

			url.searchParams.set("redirect_uri", "/auth/callback");
			url.searchParams.set("response_type", "code");
			url.searchParams.set("scope", "openid offline_access");

			url.searchParams.set(
				"state",
				btoa(
					JSON.stringify({
						c: "1d3c2b11-05bf-46cd-a1e0-84ed965fe782",
						r: "https://app.fusionauth.io:3443/",
					}),
				),
			);

			url.searchParams.set("idp_hint", req.params.id);

			return rep.redirect(url.toString());
		},
	);
};

export default socials;
