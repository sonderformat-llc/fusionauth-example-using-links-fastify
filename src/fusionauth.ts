import { FusionAuthClient } from "@fusionauth/typescript-client";

export const faClient = new FusionAuthClient(
	"this_really_should_be_a_long_random_alphanumeric_value_but_this_still_works",
	"http://localhost:9011",
);
