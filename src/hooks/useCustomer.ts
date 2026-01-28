import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EMAIL_REGEX } from "@/src/constants";
import { CustomerFormValues } from "@/src/app/types";
import { CustomerFormErrors } from "@/src/views/CustomerPage";
import {
  setBookingDetails,
  setLoading,
} from "@/src/store/slices/availabilitySlice";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";

const requiredFields = {
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
} as const;

const useCustomer = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // State to track touched fields and submission status
  const { selectedSlot, treatmentId, siteId, loading, duration, selectedDate } =
    useAppSelector((state) => state.availability);

  const [touched, setTouched] = useState<
    Partial<Record<keyof CustomerFormValues, boolean>>
  >({});

  const [bookingError, setBookingError] = useState<string | null>(null);

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
      errors.firstName = "El nombre es obligatorio.";
    }
    if (requiredFields.lastName && v.lastName.trim().length === 0) {
      errors.lastName = "El apellido es obligatorio.";
    }
    if (requiredFields.email && v.email.trim().length === 0) {
      errors.email = "El correo electrónico es obligatorio.";
    } else if (v.email.trim().length > 0 && !EMAIL_REGEX.test(v.email.trim())) {
      errors.email = "Por favor, introduce una dirección de correo electrónico válida.";
    } 
    if(requiredFields.phone && v.phone.trim().length === 0) {
      errors.phone = "El número de teléfono es obligatorio.";
    }

    if (v.phone.trim().length > 0) {
      const digits = v.phone.replace(/[^\d+]/g, "");
      if (digits.length < 7) errors.phone = "El número de teléfono parece demasiado corto.";
    }

    return errors;
  };

  const errors = useMemo(() => validate(values), [values, requiredFields]);

  const showError = (field: keyof CustomerFormValues) =>
    Boolean((touched[field] || submitted) && errors[field]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }) as CustomerFormValues);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const redirectToHomepage = () => {
    setTimeout(() => {
      dispatch(setLoading(false));
      router.push("/");
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const currentErrors = validate(values);
    if (Object.keys(currentErrors).length > 0) return;

    // Next step: search client by email, create if missing
    dispatch(setLoading(true));

    const response = await fetch("/api/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      dispatch(setLoading(false));
      setBookingError("Error al obtener o crear los datos del cliente. Por favor, inténtalo de nuevo.");
      redirectToHomepage();
      return;
    }

    const data = await response.json();

    const customerId = data?.customer?.Id;

    if (customerId) {
      const bookingResponse = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          selectedSlot,
          treatmentId,
          siteId,
          selectedDate,
          duration,
        }),
      });

      const bookingData = await bookingResponse.json();

      if (bookingData?.error) {
        // Handle booking error if needed
        dispatch(setLoading(false));
        setBookingError("La reserva falló. Por favor, inténtalo de nuevo.");
        return redirectToHomepage();
      }

      // Redirect to homepage or confirmation page and set booking details in state
      dispatch(setBookingDetails(bookingData?.Appointment || null));
      router.push("/confirmation");

      dispatch(setLoading(false));
    } else {
      redirectToHomepage();
    }
  };

  return {
    bookingError,
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
