import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, phone, sacramentInterest, message, website } = await req.json();

    if (website) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!firstName || !lastName || !email || !sacramentInterest) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
    const fullName = `${firstName} ${lastName}`;
    const phoneText = phone || "Not provided";
    const messageText = message || "None";

    const staffHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2C3E6B; margin-bottom: 16px;">New Sacrament Inquiry</h2>
        <p style="color: #444; font-size: 15px; line-height: 1.6;">
          Someone has submitted a sacrament inquiry through the parish website.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #888; width: 160px;">Name</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #1C1C1E; font-weight: 600;">${fullName}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #888;">Email</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #1C1C1E;">${email}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #888;">Phone</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #1C1C1E;">${phoneText}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #888;">Sacrament</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #1C1C1E; font-weight: 600;">${sacramentInterest}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #888;">Message</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #1C1C1E;">${messageText}</td></tr>
        </table>
        <p style="color: #888; font-size: 13px;">This is an automated message from the Corpus Christi parish website.</p>
      </div>
    `;

    await Promise.all(
      ["office@cc-parish.org", "ministry@cc-parish.org"].map(async (recipient) => {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Corpus Christi Parish <no-reply@corpuschristipiedmont.com>",
            to: [recipient],
            subject: `Sacrament Inquiry: ${sacramentInterest} — ${fullName}`,
            html: staffHtml,
          }),
        });
        if (!res.ok) {
          const errBody = await res.text();
          console.error(`Email to ${recipient} failed:`, errBody);
        }
      })
    );

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to send notification" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
