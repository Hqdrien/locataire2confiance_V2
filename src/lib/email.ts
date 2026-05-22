export async function sendEmail(to: string, subject: string, html: string) {
    // In a real app, use Resend, SendGrid, or Nodemailer here.
    // For MVP/Dev, we log to console to simulate the email being sent.

    console.log("---------------------------------------------------");
    console.log(`[EMAIL MOCK] To: ${to}`);
    console.log(`[EMAIL MOCK] Subject: ${subject}`);
    console.log(`[EMAIL MOCK] Body Length: ${html.length} chars`);
    console.log("---------------------------------------------------");

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true };
}
