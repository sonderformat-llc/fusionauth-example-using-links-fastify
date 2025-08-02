import fastifyCookie from "@fastify/cookie";
import { Authenticator } from "@fastify/passport";
import fastifySession from "@fastify/session";
import fp from "fastify-plugin";
import { decodeJwt } from "jose";
import OAuth2Strategy, { type VerifyCallback } from "passport-oauth2";
import { env } from "../env";

export const fastifyAuthenticator = new Authenticator();

export default fp(async (fastify) => {
	fastify.register(fastifyCookie);
	fastify.register(fastifySession, {
		secret: env.SESSION_SECRET,
		cookieName: "user-session",
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production", // true in production, false in development
			httpOnly: true, // Prevents JavaScript access to the cookie
			sameSite: "lax", // Protects against CSRF attacks
			maxAge: 604_800_000, // 7 days
		},
	});

	fastify.register(fastifyAuthenticator.initialize());
	fastify.register(fastifyAuthenticator.secureSession());

	fastifyAuthenticator.registerUserSerializer<
		{
			sub: string;
			given_name: string;
			family_name: string;
			email: string;
		},
		{ id: string; displayName: string }
	>(async (user) => {
		const { sub, given_name, family_name, email } = user;
		return {
			id: sub,
			displayName:
				given_name || family_name
					? `${given_name ?? ""} ${family_name ?? ""}`
					: email,
		};
	});

	fastifyAuthenticator.registerUserDeserializer(async (userFromSession) => {
		return userFromSession;
	});

	fastifyAuthenticator.use(
		"fusionauth",
		new OAuth2Strategy(
			{
				authorizationURL: `${env.FUSIONAUTH_URL}/oauth2/authorize`,
				tokenURL: `${env.FUSIONAUTH_URL}/oauth2/token`,
				clientID: env.FUSIONAUTH_CLIENT_ID,
				clientSecret: env.FUSIONAUTH_CLIENT_SECRET,
				callbackURL: env.FUSIONAUTH_REDIRECT_URI,
				scope: "openid profile email offline_access",
				pkce: true,
				state: true,
			},
			(
				_accessToken: string,
				_refreshToken: string,
				results: {
					id_token: string;
				},
				_profile: object,
				cb: VerifyCallback,
			) => {
				const { id_token } = results;

				return cb(null, decodeJwt(id_token));
			},
		),
	);
});

declare module "fastify" {
	interface PassportUser {
		id: string;
		displayName: string;
	}
}
