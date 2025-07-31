import type { preValidationMetaHookHandler } from "fastify/types/hooks";

export const ALLOWED_MIME_TYPES = [
	"video/mp4",
	"video/webm",
	"video/ogg",
	"video/quicktime",
	"video/x-msvideo",
	"video/x-ms-wmv",
	"video/x-flv",
];

/**
 * Check if the user is authenticated
 */
export const checkAuthenticated: preValidationMetaHookHandler = (
	request,
	reply,
	done,
) => {
	if (!request.isAuthenticated()) {
		reply.redirect("/");
	}
	done();
};
