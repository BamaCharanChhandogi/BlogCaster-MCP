import type { BlogPlatform } from "../platforms/base/types.js";
import { DevToPlatform } from "../platforms/devto/DevToPlatform.js";
import { HashnodePlatform } from "../platforms/hashnode/HashnodePlatform.js";
import { WordpressPlatform } from "../platforms/wordpress/WordpressPlatform.js";
// future: MediumPlatform, DevToPlatform, etc.

export type SupportedPlatforms = "hashnode" | "medium" | "devto" | "wordpress";

export class PlatformManager {
	static getPlatform(name: SupportedPlatforms): BlogPlatform {
		switch (name) {
			case "hashnode":
				return new HashnodePlatform();
			case "devto":
				return new DevToPlatform();
			case "wordpress":
				return new WordpressPlatform();

			default:
				throw new Error(`Unsupported platform: ${name}`);
		}
	}
}

