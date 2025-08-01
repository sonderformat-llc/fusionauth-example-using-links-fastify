import type { FastifyPluginAsync } from "fastify";
import { faClient } from "../fusionauth";
import { SOCIALS } from "../socials";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get(
		"/",
		{
			preValidation: (req, res, done) => {
				if (!req.user) {
					res.redirect("/login");
				}
				done();
			},
		},
		async (request, reply) => {
			// Check if the user has any socials
			const identityProviderLinks = await faClient.retrieveUserLinksByUserId(
				"",
				request.user?.id ?? "",
			);
            console.log(JSON.stringify(identityProviderLinks, null, 2));

			const socials = SOCIALS.map((social) => ({
				...social,
				disabled: !identityProviderLinks.response.identityProviderLinks?.some(
					(link) => link.identityProviderId === social.providerId,
				),
			}));

			return reply.view("root.ejs", {
				user: request.user?.displayName,
				socials,
			});
		},
	);
};

export default root;
