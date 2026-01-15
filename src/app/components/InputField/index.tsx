import React from "react";
import { InputFieldProps } from "@/src/app/types";

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
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label} {required ? <span className="text-red-600">*</span> : null}
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
        className={[
          "mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900",
          "placeholder:text-slate-400 focus:outline-none focus:ring-2",
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-slate-300 focus:border-slate-400 focus:ring-slate-200",
        ].join(" ")}
      />

      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
};
