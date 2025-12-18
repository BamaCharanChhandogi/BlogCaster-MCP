
export async function generateKey(): Promise<CryptoKey> {
    const key = await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
    return key as CryptoKey;
}

export async function importKey(rawKey: string): Promise<CryptoKey> {
    // rawKey should be a hex string or base64. Let's assume hex for simplicity in env vars
    const buffer = hexToArrayBuffer(rawKey);
    return crypto.subtle.importKey(
        "raw",
        buffer,
        "AES-GCM",
        false,
        ["encrypt", "decrypt"]
    );
}

// Encrypts text and returns "iv:ciphertext" (hex encoded)
export async function encrypt(text: string, key: CryptoKey): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);

    const ciphertext = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encoded
    );

    return `${arrayBufferToHex(iv.buffer)}:${arrayBufferToHex(ciphertext)}`;
}

// Decrypts "iv:ciphertext" and returns text
export async function decrypt(encryptedText: string, key: CryptoKey): Promise<string> {
    const [ivHex, cipherHex] = encryptedText.split(':');
    if (!ivHex || !cipherHex) throw new Error("Invalid encrypted format");

    const iv = hexToArrayBuffer(ivHex);
    const ciphertext = hexToArrayBuffer(cipherHex);

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        ciphertext
    );

    return new TextDecoder().decode(decrypted);
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexToArrayBuffer(hexString: string): ArrayBuffer {
    const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }
    return bytes.buffer;
}
