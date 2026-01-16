import { createBooking } from "@/src/lib/mindbody";

export async function POST(request: Request) {
  try {
    const {
      customerId,
      selectedSlot,
      treatmentId,
      siteId,
      selectedDate,
      duration,
    } = await request.json();

    if (
      !customerId ||
      !selectedSlot ||
      !treatmentId ||
      !siteId ||
      !selectedDate ||
      !duration
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Missing customerId, selectedSlot, treatmentId, siteId, selectedDate, or duration",
        }),
        { status: 400 }
      );
    }

    const response = await createBooking({
      customerId,
      selectedSlot,
      treatmentId,
      siteId,
      selectedDate,
      duration,
    });

    return new Response(
      JSON.stringify(
        response || {
          error: "Failed to create booking",
        }
      ),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("API-booking request Error", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
