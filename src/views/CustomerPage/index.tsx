"use client";
import React from "react";
import { CustomerFormValues } from "@/src/app/types";
import useCustomer from "@/src/hooks/useCustomer";
import { InputField } from "@/src/app/components/InputField";
import WidgetLoader from "@/src/app/components/WidgetLoader";

export type CustomerFormErrors = Partial<
  Record<keyof CustomerFormValues, string>
>;

const CustomerPage = () => {
  const {
    errors,
    showError,
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    loading,
    requiredFields,
    bookingError,
    redirectToHomepage,
  } = useCustomer();

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 shadow-lg shadow-black/10 p-4">
      <div className="mx-auto w-full max-w-xl p-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Customer</h2>
          <p className="mt-1 text-sm text-slate-600">
            Enter customer details. We’ll search first, and create the client if
            not found.
          </p>
          {/* Back button can be added here if needed */}
          <div className="flex justify-end my-2">
            <button
              onClick={redirectToHomepage}
              className="flex items-center gap-.5 cursor-pointer text-gray-500 hover:text-black transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back</span>
            </button>
          </div>
        </div>

        {loading ? (
          <WidgetLoader />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-1">
            {bookingError && (
              <div className="mb-4 text-red-600 font-semibold text-center">
                {bookingError}
              </div>
            )}
            <InputField
              label="First name"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              required={requiredFields.firstName}
              error={showError("firstName") ? errors.firstName : undefined}
              autoComplete="given-name"
            />

            <InputField
              label="Last name"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              required={requiredFields.lastName}
              error={showError("lastName") ? errors.lastName : undefined}
              autoComplete="family-name"
            />

            <InputField
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              type="email"
              required={requiredFields.email}
              error={showError("email") ? errors.email : undefined}
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
            />

            <InputField
              label="Phone (optional)"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              type="tel"
              required={requiredFields.phone}
              error={showError("phone") ? errors.phone : undefined}
              autoComplete="tel"
              inputMode="tel"
              placeholder="+1 555 123 4567"
            />

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60 cursor-pointer"
            >
              Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
