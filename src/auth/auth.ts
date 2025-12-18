// src/auth/auth.ts

export async function signLoginToken(email: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    // Payload: email + timestamp
    const payload = JSON.stringify({ email, exp: Date.now() + 15 * 60 * 1000 });
    const payloadB64 = btoa(payload);

    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

    return `${payloadB64}.${signatureB64}`;
}

export async function verifyLoginToken(token: string, secret: string): Promise<string | null> {
    try {
        const [payloadB64, signatureB64] = token.split('.');
        if (!payloadB64 || !signatureB64) return null;

        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const key = await crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        );

        const signature = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0));
        const valid = await crypto.subtle.verify(
            "HMAC",
            key,
            signature,
            encoder.encode(payloadB64)
        );

        if (!valid) return null;

        const payload = JSON.parse(atob(payloadB64));
        if (Date.now() > payload.exp) return null;

        return payload.email;
    } catch (e) {
        return null;
    }
}
