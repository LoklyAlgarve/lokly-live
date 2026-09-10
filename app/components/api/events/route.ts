const EVENTS_URL =
  "https://script.google.com/macros/s/AKfycbwCOnagvtUQWWTKjs56w6ZlrjRkceh0bnxRPN4Bn7VTukL55iLrNzObL44ZtcbLdH2o/exec";

export async function GET() {
  try {
    const response = await fetch(EVENTS_URL, {
      cache: "no-store",
      redirect: "follow",
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("Google events response:", response.status, text);

      return Response.json(
        { error: `Events request failed: ${response.status}` },
        { status: 500 }
      );
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Google returned non-JSON:", text);

      return Response.json(
        { error: "Google returned invalid event data" },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error("Events API error:", error);

    return Response.json(
      { error: "Could not load events" },
      { status: 500 }
    );
  }
}