"use client";

import * as React from "react";
import dayjs from "dayjs";
import Slots from "@/src/app/components/Slots";
import Calendar from "@/src/app/components/Calendar";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  setAvailabilities,
  setSelectedSlot,
  resetSlice,
} from "@/src/store/slices/availabilitySlice";
import WidgetLoader from "@/src/app/components/WidgetLoader";

// type Slot = { time: string; title: string };

// function formatDateKey(d: Date) {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

const service = 178; // Yoga Session
const duration = 90;

interface IProps {}

export default function HomePage({}: IProps) {
  const dispatch = useAppDispatch();

  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  const { loading } = useAppSelector((state) => state.availability);

  const changeDate = async (date: Date) => {
    console.log("changeDate", date);

    dispatch(resetSlice());
    // Do POST request to fetch availability for selected date format "YYYY-MM-DD"
    const response = await fetch("/api/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: dayjs(date).format("YYYY-MM-DD"),
        sessionId: service,
        duration: duration,
      }),
    });

    if (!response.ok) return;

    // const response = await fetch(`/api/availability?date=${date.toISOString().split('T')[0]}&sessionId=${service}&duration=${duration}`);
    const data = await response.json();

    console.log("Response data:", data?.data);

    dispatch(setAvailabilities(data?.data || []));
    setSelectedDate(date);
  };

  return (
    <main className="min-h-screen bg-white p-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-xl font-semibold">Elevatione</h1>

        <div className="mt-6">
          <Calendar
            selectedDate={selectedDate}
            onChange={(date) => changeDate(date)}
          />

          {loading ? <WidgetLoader /> : <Slots />}
        </div>
      </div>
    </main>
  );
}
