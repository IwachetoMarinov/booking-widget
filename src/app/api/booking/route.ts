export async function POST(request: Request) {
  try {
    const { customerId, selectedSlot, treatmentId } = await request.json();

    if (!customerId || !selectedSlot || !treatmentId) {
      return new Response(
        JSON.stringify({
          error: "Missing customerId, selectedSlot, or treatmentId",
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ customerId, selectedSlot, treatmentId }),
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
