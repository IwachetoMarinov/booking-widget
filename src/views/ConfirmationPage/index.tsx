"use client";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/store/hooks";

const ConfirmationPage = () => {
  const { bookingDetails } = useAppSelector((state) => state.availability);
  const router = useRouter();

  useEffect(() => {
    // if (!bookingDetails) router.push("/");
  }, [bookingDetails, router]);

  const redirectParrentPage = () => {
    window.parent.postMessage(
      {
        type: "WIDGET_REDIRECT",
        url: "http://localhost:3001/booking-confirmed?id=123",
      },
      "*"
    );
    window.close();
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 shadow-lg shadow-black/10 p-4">
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h1 className="text-2xl font-semibold text-green-600">
            Booking Confirmed
          </h1>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Status:</strong> {bookingDetails?.Status}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {dayjs(bookingDetails?.StartDateTime).format(
                "dddd, MMMM D, YYYY"
              )}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {dayjs(bookingDetails?.StartDateTime).format("HH:mm")} –{" "}
              {dayjs(bookingDetails?.EndDateTime).format("HH:mm")}
            </p>
            <p>
              <strong>Duration:</strong> {bookingDetails?.Duration} minutes
            </p>
            <p>
              <strong>Session Type ID:</strong> {bookingDetails?.SessionTypeId}
            </p>
            <p>
              <strong>Location ID:</strong> {bookingDetails?.LocationId}
            </p>
            <p>
              <strong>Staff ID:</strong> {bookingDetails?.StaffId}
            </p>
            <p>
              <strong>Client ID:</strong> {bookingDetails?.ClientId}
            </p>
          </div>

          {/* Button to send to parent page Message */}
          <button
            onClick={redirectParrentPage}
            className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60 cursor-pointer"
          >
            Redirect Parent
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
