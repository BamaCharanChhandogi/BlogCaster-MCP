// src/platforms/devto/client.ts
const DEVTO_ENDPOINT = "https://dev.to/api/articles";

export async function postToDevto(
	apiKey: string,
	title: string,
	bodyMarkdown: string,
	tags: string[] = [],
) {
	const res = await fetch(DEVTO_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"api-key": apiKey,
		},
		body: JSON.stringify({
			article: {
				title,
				body_markdown: bodyMarkdown,
				published: true,
				tags,
			},
		}),
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`DEV.to publish failed: ${res.status} ${errorText}`);
	}

	const data = await res.json();
	return data; // contains id, url, slug etc
}

