import { getAvailability } from "@/src/lib/mindbody";

export async function POST(request: Request) {
  try {
    const { date, sessionId, duration } = await request.json();

    if (!date || !sessionId) {
      return new Response(
        JSON.stringify({ error: "Missing date or sessionId" }),
        { status: 400 }
      );
    }

    const availabilities = await getAvailability(date, sessionId, duration);

    return new Response(JSON.stringify({ data: availabilities || [] }), {
      status: 200,
    });
  } catch (error) {
    console.log("API-.availability request Error", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
