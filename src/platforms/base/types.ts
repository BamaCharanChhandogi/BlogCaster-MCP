export interface PostInput {
	title: string;
	contentMarkdown: string;
	tags?: string[];
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
	publishPost(token: string, input: PostInput): Promise<PublishResult>;
}

