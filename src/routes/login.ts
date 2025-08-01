import type { FastifyPluginAsync } from "fastify";

const login: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get(
		"/login",
		{
			preValidation: (req, res, done) => {
				if (req.user) {
					res.redirect("/");
				}
				done();
			},
		},
		async (_request, reply) => {
			return reply.view("login.ejs");
		},
	);
};

export default login;
