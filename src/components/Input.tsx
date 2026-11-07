"use client";
import { forwardRef, useState, InputHTMLAttributes, ReactNode } from "react";

import styles from "./Input.module.css";
export type IconName = "search" | "user" | "password" | "email";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: IconName;
  isPassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, isPassword = false, id, className, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const inputType = isPassword ? (showPassword ? "text" : "password") : props.type;

    return (
      <div className={styles.field}>
        {label && (
          <label htmlFor={inputId}  className={`${styles.label} ${error ? styles.error : ""}`} >
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={[
          styles["input-container"],
          error ? styles.error : "",
          disabled ? styles.disabled : "",
        ].filter(Boolean).join(" ")}>

          {leftIcon && (
            <span className={styles["left-icon"]}>
              {leftIcon === "user" && <IconUser />}
              {leftIcon === "search" && <IconSearch />}
              {leftIcon === "password" && <IconPassword />}
              {leftIcon === "email" && <IconEmail />}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={styles["input-form"]}
            {...props}
            type={inputType}
          />

          {isPassword && (
            <button
              type="button"
              className={styles["eye-btn"]}
              onClick={() => setShowPassword(p => !p)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOn /> : <EyeOff />}
            </button>
          )}
        </div>

        {error && error.trim() !== "" && (
          <p className={styles["error-msg"]}><IconWarn /> {error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

function EyeOn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOff() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function IconWarn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 7l10 7 10-7"/>
    </svg>
  );
}

function IconPassword() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  );
}
