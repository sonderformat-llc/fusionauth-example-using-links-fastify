export type SocialMediaConnection = {
	id: "twitter" | "youtube" | "instagram";
	providerId: string;
	name: string;
	icon: string;
	url: string;
	color: string;
	upload: (token: string, file: string) => Promise<string>;
};
