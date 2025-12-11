// src/platforms/devto/client.ts
const DEVTO_ENDPOINT = "https://dev.to/api/articles";

export async function postToDevto(
	apiKey: string,
	title: string,
	bodyMarkdown: string,
	tags: string[] = [],
	coverImageURL?: string,
) {
	const article: any = {
		title,
		body_markdown: bodyMarkdown,
		published: true,
		tags,
	};
	if (coverImageURL) {
		article.main_image = coverImageURL;
	}
	
	const res = await fetch(DEVTO_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"api-key": apiKey,
			"User-Agent": "MyApp/1.0"
		},
		body: JSON.stringify({ article }),
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`DEV.to publish failed: ${res.status} ${errorText}`);
	}

	const data = await res.json() as any;
	return data; // contains id, url, slug etc
}

export async function getBlogsFromDevto(apiKey: string, perPage = 30) {
	const res = await fetch(`${DEVTO_ENDPOINT}/me?per_page=${perPage}&page=1`, {
		method: "GET",
		headers: {
			"api-key": apiKey,
			Accept: "application/json",
			"User-Agent": "MyApp/1.0",
		},
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`DEV.to getBlogs failed: ${res.status} ${errorText}`);
	}

	const data = await res.json();
	return data as { id?: number; url?: string; canonical_url?: string }[];
}

export async function deleteFromDevto(apiKey: string, articleId: string) {
	// Dev.to requires unpublishing via PUT instead of DELETE
	const res = await fetch(`${DEVTO_ENDPOINT}/${articleId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"api-key": apiKey,
			Accept: "application/json",
			"User-Agent": "MyApp/1.0",
		},
		body: JSON.stringify({ article: { published: false } }),
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`DEV.to delete failed: ${res.status} ${errorText}`);
	}
}

