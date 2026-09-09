const EVENTS_URL =
  "https://script.google.com/macros/s/AKfycbwCOnagvtUqWWTKjs56w6ZlrjRkceh0bnxRPN4Bn7VTukL55iLrNzObL44ZtcbLdH2o/exec";

export async function GET() {
  try {
    const response = await fetch(EVENTS_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json(
        { error: `Events request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error("Events API error:", error);

    return Response.json(
      { error: "Could not load events" },
      { status: 500 }
    );
  }
}