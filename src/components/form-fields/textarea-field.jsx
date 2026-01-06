import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TextareaField({
  label,
  name,
  placeholder,
  register,
  errors,
  validation = {},
  rows = 4,
  className,
  ...props
}) {
  const defaultPlaceholder =
    placeholder || `Enter ${label?.toLowerCase() || "text"}`;

  return (
    <div className="mb-4">
      <Label className="mb-2" htmlFor={name}>
        {label}
        {validation?.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={name}
        rows={rows}
        placeholder={defaultPlaceholder}
        className={className}
        {...register(name, validation)}
        {...props}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}
