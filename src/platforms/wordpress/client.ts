type WpAuthMode = "basic" | "bearer";

type WpTokenConfig =
	| {
			mode: "basic";
			siteBaseUrl: string;
			username: string;
			appPassword: string;
	  }
	| {
			mode: "bearer";
			site: string; // e.g. pujachhandogigroup.wordpress.com
			accessToken: string;
	  };

function parseTokenConfig(token: string): WpTokenConfig {
	try {
		const parsed = JSON.parse(token) as Record<string, string | undefined>;
		const siteBaseUrl = parsed.siteBaseUrl;
		const username = parsed.username;
		const appPassword = parsed.appPassword;
		const bearerToken = parsed.token || parsed.accessToken;
		const site = parsed.site || parsed.siteBaseUrl;

		const hasBasic = Boolean(siteBaseUrl && username && appPassword);
		if (hasBasic) {
			return {
				mode: "basic",
				siteBaseUrl: siteBaseUrl as string,
				username: username as string,
				appPassword: appPassword as string,
			};
		}

		const hasBearer = Boolean(site && bearerToken);
		if (hasBearer) {
			return {
				mode: "bearer",
				site: site as string,
				accessToken: bearerToken as string,
			};
		}

		throw new Error("Missing required WordPress token fields.");
	} catch (err: any) {
		throw new Error(
			"Invalid WordPress token. Use one of:\n" +
				'- Basic (self-hosted): {"siteBaseUrl":"https://your-site.com","username":"user","appPassword":"app-pass"}\n' +
				'- WordPress.com OAuth: {"site":"yoursite.wordpress.com","token":"<oauth_access_token>"}',
		);
	}
}

function buildBasicAuthHeader(username: string, appPassword: string): string {
	const raw = `${username}:${appPassword}`;
	const encoded = btoa(String.fromCharCode(...new TextEncoder().encode(raw)));
	return `Basic ${encoded}`;
}

async function callWp(cfg: WpTokenConfig, path: string, init?: RequestInit): Promise<Response> {
	const headers = new Headers(init?.headers || {});
	let base = "";

	if (cfg.mode === "basic") {
		base = cfg.siteBaseUrl.replace(/\/$/, "");
		headers.set("Authorization", buildBasicAuthHeader(cfg.username, cfg.appPassword));
	} else {
		base = `https://public-api.wordpress.com/wp/v2/sites/${cfg.site}`;
		headers.set("Authorization", `Bearer ${cfg.accessToken}`);
	}

	if (!headers.has("Content-Type") && !(init?.body instanceof FormData)) {
		headers.set("Content-Type", "application/json");
	}
	const url = `${base}${path}`;

	const res = await fetch(url, { ...init, headers });
	return res;
}

function markdownToHtml(markdown: string): string {
	// Minimal markdown-to-HTML: paragraphs + line breaks, without external deps.
	const escaped = markdown
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
	return escaped
		.split(/\n{2,}/)
		.map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
		.join("\n");
}

async function uploadWpMedia(token: string, imageUrl: string): Promise<number> {
	const cfg = parseTokenConfig(token);
	const imgRes = await fetch(imageUrl);
	if (!imgRes.ok) {
		const text = await imgRes.text();
		throw new Error(`Fetch cover image failed: ${imgRes.status} ${text}`);
	}
	const contentType = imgRes.headers.get("content-type") || "image/jpeg";
	const filename =
		imageUrl.split("/").pop() ||
		`cover-${Date.now()}.${contentType.split("/")[1] || "jpg"}`;
	const buffer = new Uint8Array(await imgRes.arrayBuffer());

	const res = await callWp(
		cfg,
		cfg.mode === "basic" ? "/wp-json/wp/v2/media" : "/media",
		{
			method: "POST",
			headers: {
				"Content-Type": contentType,
				"Content-Disposition": `attachment; filename="${filename}"`,
			},
			body: buffer,
		},
	);

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`WordPress media upload failed: ${res.status} ${errorText}`);
	}

	const data = (await res.json()) as { id?: number };
	if (!data.id) throw new Error("WordPress media upload returned no id");
	return data.id;
}

const WP_TOKEN_GUIDANCE =
	"Invalid WordPress token. Use JSON string: " +
	'Self-hosted: {"siteBaseUrl":"https://your-site.com","username":"user","appPassword":"app-pass"} ' +
	'WordPress.com: {"site":"yoursite.wordpress.com","token":"<oauth_access_token>"}';

export async function validateWpToken(token: string): Promise<boolean> {
	try {
		const cfg = parseTokenConfig(token);
		const path = cfg.mode === "basic" ? "/wp-json/wp/v2/users/me" : "/";
		const res = await callWp(cfg, path, { method: "GET" });
		if (!res.ok) {
			const txt = await res.text();
			throw new Error(`WordPress auth check failed: ${res.status} ${txt}`);
		}
		return true;
	} catch (err: any) {
		console.error("WordPress validateToken error:", err);
		throw new Error(`${WP_TOKEN_GUIDANCE} | ${err?.message || err}`);
	}
}

export async function listWpPosts(
	token: string,
	perPage = 50,
): Promise<{ id?: string; url: string; slug?: string }[]> {
	const cfg = parseTokenConfig(token);
	const res = await callWp(
		cfg,
		cfg.mode === "basic"
			? `/wp-json/wp/v2/posts?per_page=${perPage}&page=1&status=publish`
			: `/posts?per_page=${perPage}&page=1&status=publish`,
		{ method: "GET" },
	);

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`WordPress getAllBlogs failed: ${res.status} ${errorText}`);
	}

	const posts = (await res.json()) as { id?: number; link?: string; slug?: string }[];
	return posts
		.filter((p) => typeof p.link === "string")
		.map((p) => ({
			id: p.id !== undefined ? String(p.id) : undefined,
			url: p.link as string,
			slug: p.slug,
		}));
}

export async function createWpPost(
	token: string,
	title: string,
	contentMarkdown: string,
	coverImageURL?: string,
): Promise<{ id: string; title: string; slug?: string; url: string; publishedAt?: string }> {
	const cfg = parseTokenConfig(token);
	const html = markdownToHtml(contentMarkdown);

	let featuredMediaId: number | undefined;
	if (coverImageURL) {
		try {
			featuredMediaId = await uploadWpMedia(token, coverImageURL);
		} catch (err) {
			console.error("Cover image upload failed, continuing without it:", err);
		}
	}

	const body = {
		title,
		content: html,
		status: "publish",
		featured_media: featuredMediaId,
	};

	const res = await callWp(
		cfg,
		cfg.mode === "basic" ? "/wp-json/wp/v2/posts" : "/posts",
	{
		method: "POST",
		body: JSON.stringify(body),
	},
	);

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`WordPress publish failed: ${res.status} ${errorText}`);
	}

	const data = (await res.json()) as {
		id: number | string;
		title?: { rendered?: string };
		slug?: string;
		link?: string;
		date_gmt?: string;
	};

	return {
		id: String(data.id),
		title: data.title?.rendered || title,
		slug: data.slug,
		url: data.link || "",
		publishedAt: data.date_gmt,
	};
}

export async function deleteWpPost(token: string, postId: string): Promise<void> {
	const cfg = parseTokenConfig(token);
	const res = await callWp(
		cfg,
		cfg.mode === "basic"
			? `/wp-json/wp/v2/posts/${postId}?force=true`
			: `/posts/${postId}?force=true`,
		{
			method: "DELETE",
		},
	);

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`WordPress delete failed: ${res.status} ${errorText}`);
	}
}


