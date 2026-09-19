import { NextResponse } from "next/server";

function normaliseLanguage(language: unknown): string {
  const value = String(language || "").trim();

  if (!value) {
    return "Other";
  }

  if (value.toLowerCase() === "portugese") {
    return "Portuguese";
  }

  if (value.toLowerCase() === "portuguese") {
    return "Portuguese";
  }

  if (value.toLowerCase() === "english") {
    return "English";
  }

  if (value.toLowerCase() === "spanish") {
    return "Spanish";
  }

  if (value.toLowerCase() === "french") {
    return "French";
  }

  if (value.toLowerCase() === "german") {
    return "German";
  }

  if (value.toLowerCase() === "italian") {
    return "Italian";
  }

  return value;
}

function extractOutputText(data: any): string {
  if (
    typeof data?.output_text === "string" &&
    data.output_text.trim()
  ) {
    return data.output_text.trim();
  }

  const outputText =
    data?.output
      ?.flatMap((item: any) => item?.content || [])
      ?.map((content: any) => {
        if (typeof content?.text === "string") {
          return content.text;
        }

        if (
          typeof content?.text?.value === "string"
        ) {
          return content.text.value;
        }

        return "";
      })
      ?.join("")
      ?.trim() || "";

  return outputText;
}

function cleanJsonText(text: string): string {
  let cleaned = text.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }

  return cleaned;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const action =
      body?.action === "translate"
        ? "translate"
        : "detect";

    const title = String(
      body?.title || ""
    ).trim();

    const description = String(
      body?.description || ""
    ).trim();

    const targetLanguage =
      body?.targetLanguage === "Portuguese"
        ? "Portuguese"
        : "English";

    if (!title && !description) {
      return NextResponse.json(
        {
          error:
            "No event content provided.",
        },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key is not configured.",
        },
        { status: 500 }
      );
    }

    let prompt = "";

    if (action === "detect") {
      prompt = `
Detect the language of this event.

Title:
${title}

Description:
${description}

Return ONLY valid JSON in this exact format:

{
  "sourceLanguage": "English"
}

The value of sourceLanguage must be exactly ONE of:

"English"
"Portuguese"
"Spanish"
"French"
"German"
"Italian"
"Other"

Important:
- Portuguese must always be written as "Portuguese".
- Do not use "Portugese".
- Do not translate anything.
- Do not add explanations.
- Do not use markdown.
`;
    } else {
      prompt = `
Translate this event into ${targetLanguage}.

Translate naturally and accurately.

Preserve:
- Event names
- People's names
- Organisation names
- Dates
- Times
- Places
- Prices
- URLs
- Proper nouns

Title:
${title}

Description:
${description}

Return ONLY valid JSON in this exact format:

{
  "sourceLanguage": "English",
  "translatedTitle": "translated title",
  "translatedDescription": "translated description"
}

The value of sourceLanguage must be exactly ONE of:

"English"
"Portuguese"
"Spanish"
"French"
"German"
"Italian"
"Other"

If the source is already in ${targetLanguage}, return the original text.

Important:
- Portuguese must always be written as "Portuguese".
- Do not use "Portugese".
- Do not add explanations.
- Do not use markdown.
`;
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5.6-luna",
          input: prompt,
          store: false,
        }),
      }
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "OpenAI translation error:",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Translation service failed.",
          details: errorText,
        },
        {
          status:
            response.status,
        }
      );
    }

    const data =
      await response.json();

    const rawOutput =
      extractOutputText(data);

    if (!rawOutput) {
      console.error(
        "No translation output:",
        data
      );

      return NextResponse.json(
        {
          error:
            "No translation response received.",
        },
        { status: 500 }
      );
    }

    const outputText =
      cleanJsonText(rawOutput);

    let result: any;

    try {
      result =
        JSON.parse(outputText);
    } catch {
      console.error(
        "Could not parse translation response:",
        outputText
      );

      return NextResponse.json(
        {
          error:
            "Invalid translation response.",
        },
        { status: 500 }
      );
    }

    if (action === "detect") {
      return NextResponse.json({
        sourceLanguage:
          normaliseLanguage(
            result?.sourceLanguage
          ),
      });
    }

    return NextResponse.json({
      sourceLanguage:
        normaliseLanguage(
          result?.sourceLanguage
        ),

      translatedTitle:
        typeof result?.translatedTitle ===
        "string"
          ? result.translatedTitle
          : title,

      translatedDescription:
        typeof result?.translatedDescription ===
        "string"
          ? result.translatedDescription
          : description,
    });
  } catch (error) {
    console.error(
      "Translate event error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong translating the event.",
      },
      { status: 500 }
    );
  }
}