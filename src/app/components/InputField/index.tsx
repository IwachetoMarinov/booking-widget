"use client";
import React from "react";

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  required,
  error,
  autoComplete,
  inputMode,
}) => {
  const id = `field-${name}`;

  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{ display: "block", fontWeight: 600 }}>
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </label>

      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: error ? "1px solid #d00" : "1px solid #ccc",
          outline: "none",
          marginTop: 6,
        }}
      />

      {error ? (
        <div
          id={`${id}-error`}
          style={{ marginTop: 6, color: "#d00", fontSize: 13 }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
};
