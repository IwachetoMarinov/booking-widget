import { createCustomer, findCustomerByEmail } from "@/src/lib/mindbody";

export async function POST(request: Request) {
  try {
    const {
      email,
      firstName,
      lastName,
      phone = "",
      siteId,
    } = await request.json();

    let customer = null;

    if (!email || !firstName || !lastName || !siteId) {
      return new Response(
        JSON.stringify({
          error: "Missing email, firstName, lastName, or siteId",
        }),
        { status: 400 }
      );
    }

    // Check for existing customer, create if not found
    customer = await findCustomerByEmail(email, siteId);

    if (!customer) {
      //  Create new customer
      const newCustomer = await createCustomer({
        email,
        firstName,
        lastName,
        phone,
        siteId,
      });
      customer = newCustomer;
    }

    return new Response(JSON.stringify({ customer }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
