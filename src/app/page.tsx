import HomePage from "@/src/views/Homepage";
// import { getMindbodyClient } from "@/src/services/auth";
// import { getAvailability, getSessionTypes } from "@/src/lib/mindbody";

export default async function Page() {
  // Get session types (optional)
  // const sessions = await getSessionTypes();
  // console.log("sessions", sessions);

  // GET availability for a specific date (optional) with session type filter
  // const availabilities = await getAvailability("2025-01-14", 178, 90);
  // console.log("availabilities", availabilities?.length);

  return <HomePage />;
}
