import { Resend } from "resend";

export async function sendPasswordResetEmail(email, resetLink) {
  const key = process.env.RESEND_API_KEY || "re_ZbM4zqLP_KkassXK5v3DQtBbVEhRT5EQg";
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";

  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({
      from,
      to: [email],
      subject: "Reset Your Password - Buy GMB Reviews",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #0D3B66;">Reset Your Password</h2>
          <p>You requested a password reset for your Buy GMB Reviews account.</p>
          <p>Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetLink}" 
             style="display: inline-block; margin: 16px 0; padding: 12px 28px; 
                    background: linear-gradient(135deg, #0D3B66, #1B9AAA); color: white; 
                    text-decoration: none; border-radius: 12px; font-weight: bold;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", JSON.stringify(error, null, 2));
      const isTestModeRestricted = error.statusCode === 403 && error.message?.includes("testing emails");
      return {
        success: false,
        isTestModeRestricted,
        error: typeof error === "string" ? error : error.message || JSON.stringify(error),
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Resend exception:", err);
    return { success: false, error: err.message };
  }
}
