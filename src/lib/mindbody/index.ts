import {
  AvailabilityInterface,
  CreateBookingInterface,
  CustomerFormValues,
  SlotAvailability,
} from "@/src/app/types";
import { getMindbodyClient } from "@/src/services/auth";
import { caclulateSlotAvailabilities } from "@/src/services/availabilities";

const locationId = 1;

/**
 * date: "YYYY-MM-DD" (recommended) or any ISO date string
 * NOTE: you MUST set MINDBODY_SESSION_TYPE_ID (or pass it in) for this to return slots.
 */
export const getAvailability = async (
  date: string | null | undefined,
  sessionId: number,
  defaultTime: number = 90,
  siteId: number
): Promise<SlotAvailability[] | null> => {
  try {
    if (!date || !sessionId || !siteId) return null;

    const client = await getMindbodyClient(siteId);

    // client.interceptors.request.use((config) => {
    //   console.log("Mindbody request SiteId:", config.headers?.SiteId);
    //   return config;
    // });

    const start = `${date}T00:00:00`;
    const end = `${date}T23:59:59.999`;

    const res = await client.get("/appointment/bookableitems", {
      params: {
        sessionTypeIds: sessionId,
        startDate: start,
        endDate: end,
      },
    });

    console.log("Request params:", {
      sessionTypeIds: sessionId,
      startDate: start,
      endDate: end,
    });

    const availabilities: AvailabilityInterface[] =
      res.data?.Availabilities ?? [];

    console.log("availabilities:", availabilities?.length);

    if (availabilities.length === 0) return null;

    const filteredAvailabilities = availabilities.filter((a) =>
      a.StartDateTime.startsWith(date)
    );

    console.log("filteredAvailabilities:", filteredAvailabilities?.length);

    const slots = caclulateSlotAvailabilities(
      filteredAvailabilities,
      defaultTime
    );

    return slots;
  } catch (error) {
    console.log("getAvailability error:", error);
    return null;
  }
};

export const getSessionTypes = async () => {
  try {
    const client = await getMindbodyClient();

    const res = await client.get("/site/sessiontypes");

    return res.data ?? null;
  } catch (error) {
    console.log("getSessionTypes error:", error);
    return null;
  }
};

export const findCustomerByEmail = async (email: string, siteId: number) => {
  try {
    const client = await getMindbodyClient(siteId);

    const res = await client.get("/client/clients", {
      params: {
        "request.searchText": email,
        "request.includeInactive": true,
        "request.limit": 10,
        "request.offset": 0,
      },
    });

    const clients = res.data?.Clients ?? [];

    const normalizedEmail = email.trim().toLowerCase();

    const exactMatches = clients.filter(
      (c: any) =>
        typeof c.Email === "string" &&
        c.Email.trim().toLowerCase() === normalizedEmail
    );

    return exactMatches.length > 0 ? exactMatches[0] : null;
  } catch {
    return null;
  }
};

export const createCustomer = async (data: CustomerFormValues) => {
  try {
    if (!data.siteId) return null;
    const client = await getMindbodyClient(data?.siteId || 0);

    const payload = {
      FirstName: data.firstName.trim(),
      LastName: data.lastName.trim(),
      Email: data.email.trim(),
      MobilePhone: data.phone?.trim() || undefined,
    };

    const res = await client.post("/client/addclient", payload);

    return res?.data ?? null;
  } catch (error) {
    console.log(
      "createCustomer error:",
      (error as any)?.response?.data || error
    );
    return null;
  }
};

export const createBooking = async (data: CreateBookingInterface) => {
  try {
    const client = await getMindbodyClient(data.siteId);

    const payload = {
      ClientId: Number(data.customerId),
      BookOnline: true,
      StartDateTime: data?.selectedSlot.duration.start,
      EndDateTime: data?.selectedSlot.duration.end,
      SessionTypeID: data.treatmentId,
      LocationId: locationId,
      StaffId: data.selectedSlot.staffId,
    };

    const res = await client.post("/appointment/addappointment", payload);

    return res?.data ?? null;
  } catch (error) {
    console.log(
      "createBooking error:",
      (error as any)?.response?.data || error
    );
    return null;
  }
};
