import * as fs from "node:fs";
import { pipeline } from "node:stream/promises";
import type { FastifyPluginAsync } from "fastify";
import { faClient } from "../../fusionauth";
import { SOCIALS } from "../../socials";

const file: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.post(
		"/",
		{
			preValidation: (req, res, done) => {
				if (!req.isAuthenticated()) {
					res.redirect("/login");
				}
				done();
			},
		},
		async (req, rep) => {
			const data = await req.file({
				limits: {
					fileSize: 25 * 1024 * 1024,
				},
			});

			if (!data) {
				return rep.status(400).send({
					error: "No file provided",
				});
			}

			const newFileName = `${Date.now()}-${data.filename}`;

			await pipeline(data.file, fs.createWriteStream(`./files/${newFileName}`));

			req.session.set("file", `./files/${newFileName}`);

			rep.send({
				file: newFileName,
			});
		},
	);

	fastify.post<{ Body: { socials: string[] } }>(
		"/post",
		{
			schema: {
				body: {
					type: "object",
					properties: {
						socials: {
							type: "array",
							items: {
								type: "string",
							},
						},
					},
				},
			},
			preValidation: (req, res, done) => {
				if (!req.isAuthenticated()) {
					res.redirect("/login");
				}
				done();
			},
		},
		async (req, rep) => {
			const file = req.session.get("file") as string;

			if (!file) {
				return rep.status(400).send({
					message: "No file uploaded",
				});
			}

			const { socials } = req.body;

			if (!socials.length) {
				return rep.status(400).send({
					message: "No socials selected",
				});
			}

			const activeSocials = SOCIALS.filter((social) =>
				socials.includes(social.id),
			);

			const promises = activeSocials.map(async (social) => {
				return await faClient
					.retrieveUserLinksByUserId(social.providerId, req.user?.id ?? "")
					.then((response) => {
						if (!response.response.identityProviderLinks?.length) {
							return;
						}

						const { token } = response.response.identityProviderLinks[0];

						if (!token) {
							return;
						}

						return social.upload(token, file);
					});
			});

			rep.send(
				await Promise.allSettled(promises).then((results) => {
					return results.map((result, index) => {
						if (result.status === "fulfilled") {
							return {
								id: activeSocials[index].id,
								status: "success",
								url: result.value,
							};
						} else {
							return {
								id: activeSocials[index].id,
								status: "error",
								message: result.reason,
							};
						}
					});
				}),
			);
		},
	);
};

export default file;
