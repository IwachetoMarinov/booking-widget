import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EMAIL_REGEX } from "@/src/constants";
import { CustomerFormValues } from "@/src/app/types";
import { CustomerFormErrors } from "@/src/pages/CustomerPage";
import { setLoading } from "@/src/store/slices/availabilitySlice";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";

const requiredFields = {
  firstName: true,
  lastName: true,
  email: true,
  phone: false,
} as const;

const useCustomer = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // State to track touched fields and submission status
  const { selectedSlot, treatmentId, siteId, loading } = useAppSelector(
    (state) => state.availability
  );

  const [touched, setTouched] = useState<
    Partial<Record<keyof CustomerFormValues, boolean>>
  >({});

  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<CustomerFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    siteId,
  });

  useEffect(() => {
    if (!selectedSlot) router.push("/");
  }, [selectedSlot]);

  // Functions to manage touched and submitted states can be added here
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
    } else if (v.email.trim().length > 0 && !EMAIL_REGEX.test(v.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (v.phone.trim().length > 0) {
      const digits = v.phone.replace(/[^\d+]/g, "");
      if (digits.length < 7) errors.phone = "Phone number looks too short.";
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

  const redirectToHomepage = () => {
    dispatch(setLoading(false));
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(setLoading(true));

    const currentErrors = validate(values);
    if (Object.keys(currentErrors).length > 0) return;

    // Next step: search client by email, create if missing
    console.log("Customer form valid. Values:", values);

    const response = await fetch("/api/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      redirectToHomepage();
      return;
    }

    const data = await response.json();
    console.log("Customer API response data:", data);

    const customerId = data?.customer?.Id;

    if (customerId) {
      console.log("Customer found/created:", customerId);
      // TODO  - Create booking with customerId
      const bookingResponse = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId, selectedSlot, treatmentId, siteId }),
      });

      dispatch(setLoading(false));
    } else {
      redirectToHomepage();
    }
  };

  return {
    requiredFields,
    touched,
    setTouched,
    submitted,
    setSubmitted,
    validate,
    errors,
    showError,
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    setValues,
    loading,
    redirectToHomepage,
  };
};

export default useCustomer;
