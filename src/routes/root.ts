import type { FastifyPluginAsync } from "fastify";

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
			return reply.view("root.ejs", { user: request.user?.displayName });
		},
	);
};

export default root;
