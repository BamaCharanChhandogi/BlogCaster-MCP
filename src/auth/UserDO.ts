// src/auth/UserDO.ts
import { DurableObject } from "cloudflare:workers";
import { encrypt, decrypt, importKey } from "../utils/crypto.js";

interface EncryptedTokens {
    [platform: string]: string; // iv:ciphertext
}

interface UserProfile {
    id: string; // email for now, or UUID
    email: string;
    createdAt: number;
    plan: string; // 'free' or 'pro'
}

export class UserDO extends DurableObject {
    private state: DurableObjectState;
    // Base class has 'env', so we don't declare it as private property to avoid conflict
    // We can access this.env typed as any or cast it

    // In-memory cache
    private tokens: EncryptedTokens | null = null;
    private profile: UserProfile | null = null;
    private sessions: Set<string> = new Set();
    private encryptionKey: CryptoKey | null = null;

    constructor(state: DurableObjectState, env: any) {
        super(state, env);
        this.state = state;
    }

    async getKey(): Promise<CryptoKey> {
        if (this.encryptionKey) return this.encryptionKey;

        // Access env from this.env or the typed version we might want
        const env = this.env as any;
        const secret = env.ENCRYPTION_KEY;
        if (!secret) throw new Error("ENCRYPTION_KEY secret is missing");

        this.encryptionKey = await importKey(secret);
        return this.encryptionKey;
    }

    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);

        // Internal endpoints (called by Worker, not directly by public)

        // 1. Link a session to this user
        if (url.pathname === "/internal/link-session") {
            const { sessionId } = await request.json() as { sessionId: string };
            this.sessions.add(sessionId);
            await this.state.storage.put("sessions", Array.from(this.sessions));
            return new Response("OK");
        }

        // 2. Save a token (Ecrypts it)
        if (url.pathname === "/internal/save-token") {
            const { platform, token } = await request.json() as { platform: string, token: string };
            const key = await this.getKey();
            const encrypted = await encrypt(token, key);

            this.tokens = this.tokens || await this.state.storage.get("tokens") || {};
            if (!this.tokens) this.tokens = {}; // TS check

            this.tokens[platform] = encrypted;
            await this.state.storage.put("tokens", this.tokens);
            return new Response("Saved");
        }

        // 3. Get all tokens (Decrypted) - CAREFUL: Only return to trusted internal caller
        if (url.pathname === "/internal/get-tokens") {
            this.tokens = (await this.state.storage.get<EncryptedTokens>("tokens")) || {};

            if (!this.tokens || Object.keys(this.tokens).length === 0) return new Response(JSON.stringify({}));

            const key = await this.getKey();
            const decrypted: Record<string, string> = {};

            for (const [platform, enc] of Object.entries(this.tokens)) {
                try {
                    decrypted[platform] = await decrypt(enc, key);
                } catch (e) {
                    console.error(`Failed to decrypt ${platform} token`, e);
                }
            }
            return new Response(JSON.stringify(decrypted), { headers: { 'Content-Type': 'application/json' } });
        }

        // 4. Get Profile
        if (url.pathname === "/internal/get-profile") {
            if (!this.profile) {
                this.profile = (await this.state.storage.get<UserProfile>("profile")) || null;
            }
            return new Response(JSON.stringify(this.profile), { headers: { 'Content-Type': 'application/json' } });
        }

        // 5. Initialize/Create User
        if (url.pathname === "/internal/init") {
            const { email, id } = await request.json() as { email: string, id: string };
            if (!this.profile) {
                this.profile = { id, email, createdAt: Date.now(), plan: 'free' };
                await this.state.storage.put("profile", this.profile);
            }
            return new Response(JSON.stringify(this.profile), { headers: { 'Content-Type': 'application/json' } });
        }

        // 6. Delete Token
        if (url.pathname === "/internal/delete-token") {
            const { platform } = await request.json() as { platform: string };
            this.tokens = (await this.state.storage.get<EncryptedTokens>("tokens")) || {};

            if (this.tokens[platform]) {
                delete this.tokens[platform];
                await this.state.storage.put("tokens", this.tokens);
            }
            return new Response("Deleted");
        }

        // 7. Set Plan
        if (url.pathname === "/internal/set-plan") {
            const { plan } = await request.json() as { plan: string };
            this.profile = (await this.state.storage.get<UserProfile>("profile")) || null;
            if (this.profile) {
                this.profile.plan = plan;
                await this.state.storage.put("profile", this.profile);
            }
            return new Response(JSON.stringify(this.profile), { headers: { 'Content-Type': 'application/json' } });
        }

        return new Response("Not Found", { status: 404 });
    }
}
