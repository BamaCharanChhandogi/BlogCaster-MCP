export interface PostInput {
	title: string;
	contentMarkdown: string;
	tags?: string[];
	coverImageURL?: string;
}

export interface PublishResult {
	id: string;
	title: string;
	slug?: string;
	url: string;
	publishedAt?: string;
}

export interface BlogPlatform {
	validateToken(token: string): Promise<boolean>;
	getAllBlogs(token: string): Promise<{ id?: string; url: string; slug?: string; }[]>;
	publishPost(token: string, input: PostInput): Promise<PublishResult>;
	updatePost(token: string, postId: string, input: PostInput): Promise<PublishResult>;
	deletePost(token: string, postId: string): Promise<void>;
}

