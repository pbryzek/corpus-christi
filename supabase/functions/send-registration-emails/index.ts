import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STAFF_RECIPIENTS = [
  "annezehren@mac.com",
  "ministry@cc-parish.org",
  "office@cc-parish.org",
  "paul@lohrealty.com",
];

async function sendEmail(
  apiKey: string,
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Corpus Christi Parish <no-reply@corpuschristipiedmont.com>",
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Email to ${to} failed:`, body);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, phone, interests, message, website } =
      await req.json();

    if (website) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!firstName || !lastName || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
    const registrantName = `${firstName} ${lastName}`;
    const interestsText = interests || "None selected";
    const phoneText = phone || "Not provided";
    const messageText = message || "None";

    const staffHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2C3E6B; margin-bottom: 16px;">New Parish Registration</h2>
        <p style="color: #444; font-size: 15px; line-height: 1.6;">
          Someone new has registered through the website. Here are their details:
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #888; width: 120px;">Name</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #1C1C1E; font-weight: 600;">${registrantName}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #888;">Email</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #1C1C1E;">${email}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #888;">Phone</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #1C1C1E;">${phoneText}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #888;">Interests</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #1C1C1E;">${interestsText}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #888;">Message</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #1C1C1E;">${messageText}</td></tr>
        </table>
        <p style="color: #888; font-size: 13px;">This is an automated message from the Corpus Christi parish website.</p>
      </div>
    `;

    const confirmHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2C3E6B; margin-bottom: 16px;">Welcome to Corpus Christi!</h2>
        <p style="color: #444; font-size: 15px; line-height: 1.7;">Dear ${firstName},</p>
        <p style="color: #444; font-size: 15px; line-height: 1.7;">
          Thank you for reaching out to Corpus Christi Catholic Parish. We're so glad you found us! Someone from our welcome ministry will be in touch with you soon.
        </p>
        <p style="color: #444; font-size: 15px; line-height: 1.7;">
          In the meantime, we'd love to see you at Mass:
        </p>
        <ul style="color: #444; font-size: 15px; line-height: 1.9; padding-left: 20px;">
          <li>Saturday Vigil at 5:00 PM</li>
          <li>Sunday at 8:00 AM</li>
          <li>Sunday at 10:30 AM</li>
          <li>Daily Mass Mon&ndash;Fri at 8:00 AM</li>
        </ul>
        <p style="color: #444; font-size: 15px; line-height: 1.7;">
          We are located at <strong>322 St. James Drive, Piedmont, CA 94611</strong>.
        </p>
        <p style="color: #444; font-size: 15px; line-height: 1.7;">
          God bless,<br/>
          <em>The Corpus Christi Parish Team</em>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">
          Corpus Christi Catholic Church &middot; 322 St. James Drive, Piedmont, CA 94611 &middot; (510) 530-4343
        </p>
      </div>
    `;

    // Send one email per staff recipient independently
    await Promise.all(
      STAFF_RECIPIENTS.map((recipient) =>
        sendEmail(RESEND_API_KEY, recipient, `New Registration: ${registrantName}`, staffHtml)
      )
    );

    // Send confirmation to the registrant
    await sendEmail(RESEND_API_KEY, email, "Welcome to Corpus Christi Parish!", confirmHtml);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to send emails" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
