import type { BlogPlatform, PostInput, PublishResult } from "../base/types.js";
import {
	callHashnode,
	createDraft,
	publishDraft,
	getPublicationId,
} from "./client.js";

export class HashnodePlatform implements BlogPlatform {
	async validateToken(token: string): Promise<boolean> {
		const query = `query { me { id } }`;

		try {
			const data = await callHashnode(query, {}, token);
			return !!data.me?.id;
		} catch {
			return false;
		}
	}

	async publishPost(
		token: string,
		input: PostInput,
	): Promise<PublishResult> {
		const publicationId = await getPublicationId(token);
		if (!publicationId) throw new Error("No Hashnode publication found.");

		const draft = await createDraft(
			token,
			input.title,
			input.contentMarkdown,
			publicationId,
		);
		const post = await publishDraft(token, draft.id);

		return {
			id: post.id,
			title: post.title,
			slug: post.slug,
			url: post.url,
			publishedAt: post.publishedAt,
		};
	}
}

