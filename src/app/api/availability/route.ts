import { getAvailability } from "@/src/lib/mindbody";

export async function POST(request: Request) {
  try {
    const { date, sessionId, duration, siteId } = await request.json();

    if (!date || !sessionId || !siteId) {
      return new Response(
        JSON.stringify({ error: "Missing date, sessionId, or siteId" }),
        { status: 400 }
      );
    }

    const availabilities = await getAvailability(
      date,
      sessionId,
      duration,
      siteId
    );

    return new Response(JSON.stringify({ data: availabilities || [] }), {
      status: 200,
    });
  } catch (error) {
    console.log("API->availability request Error", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
