"use client";

import * as React from "react";
import dayjs from "dayjs";
import Slots from "@/src/app/components/Slots";
import Calendar from "@/src/app/components/Calendar";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  resetSlice,
  setSiteId,
  setLoading,
  setAvailabilities,
  setSelectedSliceDate,
} from "@/src/store/slices/availabilitySlice";
import WidgetLoader from "@/src/app/components/WidgetLoader";

const siteOptions = [
  { id: 659302, name: "Mindbody Mexico" },
  { id: 788070, name: "Mindbody Mexico MX 147" },
];

const service = 178; // Yoga Session
const duration = 90;

interface IProps {}

export default function HomePage({}: IProps) {
  const dispatch = useAppDispatch();

  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  const { loading, siteId } = useAppSelector((state) => state.availability);

  const changeDate = async (date: Date, selectedSiteId?: number) => {
    dispatch(resetSlice());
    dispatch(setLoading(true));

    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    dispatch(setSelectedSliceDate(formattedDate));
    // Do POST request to fetch availability for selected date format "YYYY-MM-DD"
    const response = await fetch("/api/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: formattedDate,
        sessionId: service,
        duration,
        siteId: selectedSiteId || siteId,
      }),
    });

    if (!response.ok) {
      dispatch(setLoading(false));
      return;
    }

    const data = await response.json();

    console.log("Response data:", data?.data);

    dispatch(setAvailabilities(data?.data || []));
    setSelectedDate(date);
    dispatch(setLoading(false));
  };

  // Initial load
  React.useEffect(() => {
    changeDate(new Date());

    dispatch(setSelectedSliceDate(dayjs(new Date()).format("YYYY-MM-DD")));
  }, []);

  return (
    <main className="min-h-screen bg-white p-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-xl font-semibold">Elevatione</h1>

        {/* Select option with siteIds */}
        <select
          onChange={(e) => {
            const id = Number(e.target.value);

            dispatch(resetSlice());
            dispatch(setSiteId(id));
            changeDate(new Date(), id);
          }}
          defaultValue={siteOptions[0].id}
          className="mb-4 rounded border border-gray-300 p-2"
        >
          {siteOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        <div className="mt-6">
          <Calendar
            selectedDate={selectedDate}
            onChange={(date) => changeDate(date)}
          />

          {loading ? (
            <WidgetLoader />
          ) : (
            <Slots
              selectedSlotName={
                siteOptions.find((option) => option.id === siteId)?.name || ""
              }
            />
          )}
        </div>
      </div>
    </main>
  );
}
