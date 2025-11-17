import type { BlogPlatform, PostInput, PublishResult } from "../base/types.js";
import { postToDevto } from "./client.js";

export class DevToPlatform implements BlogPlatform {
	async validateToken(token: string): Promise<boolean> {
		// We can call a simple endpoint to verify token
		try {
			const res = await fetch("https://dev.to/api/articles/me", {
				method: "GET",
				headers: {
					"api-key": token,
				},
			});
			return res.ok;
		} catch {
			return false;
		}
	}

	async publishPost(token: string, input: PostInput): Promise<PublishResult> {
		const data = await postToDevto(
			token,
			input.title,
			input.contentMarkdown,
			input.tags || [],
		);
		return {
			id: String(data.id),
			title: data.title,
			slug: data.slug,
			url: data.url,
			publishedAt: data.published_at,
		};
	}
}

