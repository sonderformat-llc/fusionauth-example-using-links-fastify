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
        "/logout",
        async (request, reply) => {
            await request.logOut();
            reply.redirect("http://localhost:9011/oauth2/logout?client_id=3b7c7a1b-8dc6-41cb-afe7-f5ab09375b59");
        }
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
