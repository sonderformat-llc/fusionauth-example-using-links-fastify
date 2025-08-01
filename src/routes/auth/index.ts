import type { FastifyPluginAsync } from "fastify";
import { env } from "../../env";
import { fastifyAuthenticator } from "../../plugins/auth";

const auth: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get(
		"/login",
		fastifyAuthenticator.authenticate("fusionauth", {
			authInfo: false,
			failWithError: true,
		}),
	);

	fastify.get("/logout", async (request, reply) => {
		await request.logOut();
		reply.redirect(
			`${env.FUSIONAUTH_URL}/oauth2/logout?client_id=${env.FUSIONAUTH_CLIENT_ID}`,
		);
	});

	fastify.get(
		"/callback",
		fastifyAuthenticator.authenticate("fusionauth", {
			authInfo: false,
			successRedirect: "/",
			failWithError: true,
		}),
	);
};

export default auth;
