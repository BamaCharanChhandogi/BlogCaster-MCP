import type { BlogPlatform, PostInput, PublishResult } from "../base/types.js";
import {
	createWpPost,
	deleteWpPost,
	listWpPosts,
	validateWpToken,
} from "./client.js";

export class WordpressPlatform implements BlogPlatform {
	async validateToken(token: string): Promise<boolean> {
		return validateWpToken(token);
	}

	async getAllBlogs(token: string): Promise<{ id?: string; url: string; slug?: string }[]> {
		return listWpPosts(token);
	}

	async publishPost(token: string, input: PostInput): Promise<PublishResult> {
		const data = await createWpPost(token, input.title, input.contentMarkdown, input.coverImageURL);
		return {
			id: data.id,
			title: data.title,
			slug: data.slug,
			url: data.url,
			publishedAt: data.publishedAt,
		};
	}

	async deletePost(token: string, postId: string): Promise<void> {
		await deleteWpPost(token, postId);
	}
}


