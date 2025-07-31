import fastifyCookie from "@fastify/cookie";
import { Authenticator } from "@fastify/passport";
import fastifySession from "@fastify/session";
import fp from "fastify-plugin";
import { decodeJwt } from "jose";
import OAuth2Strategy, { type VerifyCallback } from "passport-oauth2";

export const fastifyAuthenticator = new Authenticator();

export default fp(async (fastify) => {
	fastify.register(fastifyCookie);
	fastify.register(fastifySession, {
		secret: "secret with minimum length of 32 characters",
		cookieName: "user-session",
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 604_800_000,
		},
	});

	fastify.register(fastifyAuthenticator.initialize());
	fastify.register(fastifyAuthenticator.secureSession());

	fastifyAuthenticator.registerUserSerializer<
		{
			sub: string;
			given_name: string;
			family_name: string;
		},
		{ id: string; displayName: string }
	>(async (user) => {
		const { sub, given_name, family_name } = user;
		return { id: sub, displayName: `${given_name} ${family_name}` };
	});

	fastifyAuthenticator.registerUserDeserializer(async (userFromSession) => {
		return userFromSession;
	});

	fastifyAuthenticator.use(
		"fusionauth",
		new OAuth2Strategy(
			{
				authorizationURL: "http://localhost:9011/oauth2/authorize",
				tokenURL: "http://localhost:9011/oauth2/token",
				clientID: "3b7c7a1b-8dc6-41cb-afe7-f5ab09375b59",
				clientSecret: "tJqz9LOkpa5ystDXnm_o2yugjLMgKP-zpiJjRetYItY",
				callbackURL: "http://localhost:3000/auth/callback",
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
