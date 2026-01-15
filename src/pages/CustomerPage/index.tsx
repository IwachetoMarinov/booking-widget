"use client";
import React, { useMemo, useState } from "react";
import { InputField } from "@/src/app/components/InputField";

type CustomerFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type CustomerFormErrors = Partial<Record<keyof CustomerFormValues, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CustomerPage = () => {
  const [values, setValues] = useState<CustomerFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [touched, setTouched] = useState<
    Partial<Record<keyof CustomerFormValues, boolean>>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const requiredFields = useMemo(
    () => ({
      firstName: true,
      lastName: true,
      email: true,
      phone: false,
    }),
    []
  );

  const validate = (v: CustomerFormValues): CustomerFormErrors => {
    const errors: CustomerFormErrors = {};

    if (requiredFields.firstName && v.firstName.trim().length === 0) {
      errors.firstName = "First name is required.";
    }

    if (requiredFields.lastName && v.lastName.trim().length === 0) {
      errors.lastName = "Last name is required.";
    }

    if (requiredFields.email && v.email.trim().length === 0) {
      errors.email = "Email is required.";
    } else if (v.email.trim().length > 0 && !emailRegex.test(v.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    // Phone is optional for now; keep validation minimal.
    // If you want: basic digits check when present.
    if (v.phone.trim().length > 0) {
      const digits = v.phone.replace(/[^\d+]/g, "");
      if (digits.length < 7) {
        errors.phone = "Phone number looks too short.";
      }
    }

    return errors;
  };

  const errors = useMemo(() => validate(values), [values, requiredFields]);

  const showError = (field: keyof CustomerFormValues) =>
    Boolean((touched[field] || submitted) && errors[field]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value } as CustomerFormValues));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const currentErrors = validate(values);
    if (Object.keys(currentErrors).length > 0) return;

    // Placeholder for next step:
    // 1) search client by email
    // 2) if not found => create client
    console.log("Customer form valid. Values:", values);
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 16 }}>
      <h2 style={{ marginBottom: 6 }}>Customer</h2>
      <p style={{ marginTop: 0, color: "#555" }}>
        Enter customer details. We’ll search first, and create the client if not
        found.
      </p>

      <form onSubmit={handleSubmit} noValidate>
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
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default CustomerPage;
