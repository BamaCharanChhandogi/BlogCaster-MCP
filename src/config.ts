import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_PATH = path.join(os.homedir(), ".blog-mcp-config.json");

export interface Config {
	tokens?: Record<string, string>; // platform → token
}

export function loadConfig(): Config {
	try {
		const raw = fs.readFileSync(CONFIG_PATH, "utf8");
		return JSON.parse(raw);
	} catch {
		return { tokens: {} };
	}
}

export function saveConfig(config: Config) {
	const finalConfig: Config = {
		tokens: {
			...(config.tokens || {}),
		},
	};

	fs.writeFileSync(CONFIG_PATH, JSON.stringify(finalConfig, null, 2), "utf8");
}

