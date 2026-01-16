"use client";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/store/hooks";

const ConfirmationPage = () => {
  const { bookingDetails } = useAppSelector((state) => state.availability);
  const router = useRouter();

  console.log(bookingDetails);
  useEffect(() => {
    if (!bookingDetails) {
      router.push("/");
    }
  }, [bookingDetails, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
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
            {dayjs(bookingDetails?.StartDateTime).format("dddd, MMMM D, YYYY")}
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

        {bookingDetails?.FirstAppointment && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
            This is your first appointment with us. Welcome!
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationPage;
