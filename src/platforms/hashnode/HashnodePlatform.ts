import type { BlogPlatform, PostInput, PublishResult } from "../base/types.js";
import {
	callHashnode,
	createDraft,
	publishDraft,
	getPublicationId,
	getAllBlogs,
	deletePublicationStory,
	updatePost as updateHashnodePost,
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

	async getAllBlogs(
		token: string,
	): Promise<{ id?: string; url: string; slug?: string; }[]> { 
		const fetchPublicationCountQueryLimit = 50;
		const posts = await getAllBlogs(token, fetchPublicationCountQueryLimit);
		return posts.map((p: { id: string; url: string; title: string; slug?: string; }) => ({
			id: p.id,
			url: p.url,
			slug: p.slug,
			title: p.title,
		}));
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

	async deletePost(token: string, postId: string): Promise<void> {
		// postId is expected to be the slug (preferred). Fall back to the provided value.
		const publicationId = await getPublicationId(token);
		if (!publicationId) throw new Error("No Hashnode publication found.");
		await deletePublicationStory(token, publicationId, postId);
	}

	async updatePost(
		token: string,
		postId: string,
		input: PostInput,
	): Promise<PublishResult> {
		const publicationId = await getPublicationId(token);
		if (!publicationId) throw new Error("No Hashnode publication found.");

		const post = await updateHashnodePost(
			token,
			publicationId,
			postId,
			input.title,
			input.contentMarkdown,
			input.coverImageURL
		);

		return {
			id: post.id,
			title: post.title,
			slug: post.slug,
			url: post.url,
			publishedAt: post.publishedAt,
		};
	}
}

