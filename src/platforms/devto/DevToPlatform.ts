import type { BlogPlatform, PostInput, PublishResult } from "../base/types.js";
import { deleteFromDevto, getBlogsFromDevto, postToDevto, updateToDevto } from "./client.js";

export class DevToPlatform implements BlogPlatform {
	async validateToken(token: string): Promise<boolean> {
    try {
        const res = await fetch("https://dev.to/api/articles/me", {
            method: "GET",
            headers: {
                "api-key": token,
                "Accept": "application/json",
                "User-Agent": "MyApp/1.0"
            },
        });
        return res.ok;
    } catch (err) {
        console.error("Validate token error:", err);
        return false;
    }
}

	async getAllBlogs(token: string): Promise<{ id?: string; url: string; slug?: string; }[]> {
		const articles = await getBlogsFromDevto(token);
		const mapped: { id?: string; url?: string; }[] = articles.map((a) => ({
			id: a.id !== undefined ? String(a.id) : undefined,
			url: a.url || a.canonical_url,
		}));

		return mapped
			.filter((a): a is { id?: string; url: string; } => typeof a.url === "string")
			.map((a) => ({ id: a.id, url: a.url }));
	}


	async publishPost(token: string, input: PostInput): Promise<PublishResult> {
		const data = await postToDevto(
			token,
			input.title,
			input.contentMarkdown,
			input.tags || [],
			input.coverImageURL,
		);
		return {
			id: String(data.id),
			title: data.title,
			slug: data.slug,
			url: data.url,
			publishedAt: data.published_at,
		};
	}

	async updatePost(token: string, postId: string, input: PostInput): Promise<PublishResult> {
		const data = await updateToDevto(
			token,
			postId,
			input.title,
			input.contentMarkdown,
			input.tags || [],
			input.coverImageURL,
		);
		return {
			id: String(data.id),
			title: data.title,
			slug: data.slug,
			url: data.url,
			publishedAt: data.published_at,
		};
	}

	async deletePost(token: string, postId: string): Promise<void> {
		await deleteFromDevto(token, postId);
	}
}

