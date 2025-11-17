export interface Config {
	tokens?: Record<string, string>; // platform → token
}

const CONFIG_KEY = "blog-mcp-config";

export async function loadConfig(kv: KVNamespace): Promise<Config> {
	try {
		const raw = await kv.get(CONFIG_KEY);
		if (!raw) {
			return { tokens: {} };
		}
		return JSON.parse(raw);
	} catch {
		return { tokens: {} };
	}
}

export async function saveConfig(config: Config, kv: KVNamespace): Promise<void> {
	const finalConfig: Config = {
		tokens: {
			...(config.tokens || {}),
		},
	};

	await kv.put(CONFIG_KEY, JSON.stringify(finalConfig, null, 2));
}

