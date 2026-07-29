"use client";

import styles from "./Form.module.css";
import { TypeBase } from "@/components/type";

/**
 * Bashir&Co — Form.Field (MVP fidelity).
 *
 * Real associated <label>, input or textarea mode, inline error text.
 * Error is communicated by color + border weight + text together —
 * never color alone. Controlled by the parent.
 */

interface FormFieldProps {
  id: string;
  label: string;
  mode?: "input" | "textarea";
  value: string;
  onChange: (value: string) => void;
  note?: string;
  error?: string;
}

export function FormField({
  id,
  label,
  mode = "input",
  value,
  onChange,
  note,
  error,
}: FormFieldProps) {
  const describedBy = error ? `${id}-error` : note ? `${id}-note` : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        <TypeBase variant="formLabel" as="span">
          {label}
        </TypeBase>
      </label>
      {mode === "textarea" ? (
        <textarea
          id={id}
          className={[styles.textarea, error ? styles.hasError : ""].join(" ")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      ) : (
        <input
          id={id}
          type="text"
          className={[styles.input, error ? styles.hasError : ""].join(" ")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : note ? (
        <p id={`${id}-note`}>
          <TypeBase variant="caption" as="span">
            {note}
          </TypeBase>
        </p>
      ) : null}
    </div>
  );
}
