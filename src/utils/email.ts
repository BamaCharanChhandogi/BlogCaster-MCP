export async function sendLoginEmail(email: string, link: string, apiKey: string) {
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // NOTE: Replace this with a verified domain to send to others
            from: "BlogCaster <onboarding@resend.dev>",
            to: email,
            subject: "Log in to BlogCaster MCP",
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Log in to BlogCaster</h2>
          <p>Click the button below to log in to your dashboard.</p>
          <a href="${link}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px;">Log In</a>
          <p style="margin-top: 24px; color: #666; font-size: 14px;">If you didn't request this, you can ignore this email.</p>
        </div>
      `,
        }),
    });

    if (!res.ok) {
        // IMPROVED: Parse JSON error for clearer debugging
        const errorData = await res.json() as any;
        console.error("Resend API Error:", errorData);
        throw new Error(`Failed to send email: ${errorData.message || res.statusText}`);
    }

    return await res.json();
}
