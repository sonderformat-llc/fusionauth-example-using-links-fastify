import type { FastifyPluginAsync } from "fastify";
import { fastifyAuthenticator } from "../../plugins/auth";

const example: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get(
		"/login",
		fastifyAuthenticator.authenticate("fusionauth", {
			authInfo: false,
			failWithError: true,
		}),
	);

	fastify.get(
		"/callback",
		fastifyAuthenticator.authenticate("fusionauth", {
			authInfo: false,
			successRedirect: "/",
			failWithError: true,
		}),
	);
};

export default example;
