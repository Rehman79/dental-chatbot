import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are the virtual assistant for Bright Smile Dental in Victorville, CA.
Answer only using the facts below. Be warm, concise, and reassuring. If a question
isn't covered, tell the user to call the front desk at (760) 555-0123.

FACTS:
- Hours: Mon-Fri 8am-5pm, Sat 9am-1pm, closed Sunday.
- Services: cleanings, fillings, crowns, teeth whitening, Invisalign, emergency visits.
- New patient exam + cleaning special: $99.
- Insurance: Delta Dental, Cigna, Aetna. In-house payment plans available.
- Booking: call (760) 555-0123 or use the Book Now button.
- Free parking in the lot behind the building.
- Emergencies: same-day appointments, call before noon.`;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { reply: "Server is missing its OpenAI API key. Add OPENAI_API_KEY to .env.local." },
        { status: 500 }
      );
    }

    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    });

    return Response.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json(
      { reply: "Sorry, something went wrong. Please call the front desk at (760) 555-0123." },
      { status: 500 }
    );
  }
}
