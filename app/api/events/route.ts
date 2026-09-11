import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      category,
      date,
      time,
      location,
      businessName,
      email,
    } = body;

    const apiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.LOKLY_NOTIFICATION_EMAIL;

    if (!apiKey || !notificationEmail) {
      console.error("Missing Resend environment variables");
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Lokly <hello@lokly.live>",
        to: [notificationEmail],
        subject: `New event submitted: ${title || "New event"}`,
        html: `
          <h2>New Lokly event submitted</h2>

          <p><strong>Event:</strong> ${title || "Not provided"}</p>
          <p><strong>Category:</strong> ${category || "Not provided"}</p>
          <p><strong>Date:</strong> ${date || "Not provided"}</p>
          <p><strong>Time:</strong> ${time || "Not provided"}</p>
          <p><strong>Location:</strong> ${location || "Not provided"}</p>

          <hr />

          <p><strong>Business / organiser:</strong> ${
            businessName || "Not provided"
          }</p>
          <p><strong>Contact email:</strong> ${
            email || "Not provided"
          }</p>

          <p>
            This event is currently waiting for approval in Lokly.
          </p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend error:", errorText);

      return NextResponse.json(
        { error: "Could not send notification email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification error:", error);

    return NextResponse.json(
      { error: "Something went wrong sending the notification." },
      { status: 500 }
    );
  }
}
