"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import styles from "../auth.module.css";

type Fields = "nickname" | "email" | "password" | "confirm";
type Errors = Partial<Record<Fields, string>>;
export default function RegisterPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function clearError(field: Fields) {
    setErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }
  function validate(): boolean {
    const next: Errors = {};
 
    if (!nickname) next.nickname = "Informe seu nome de usuário.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) next.email = "Informe seu e-mail.";
    else if (!emailRegex.test(email)) next.email = "Informe um e-mail válido.";
    if (!password) next.password = "Informe sua senha.";
    else if (password.length < 6) next.password = "Mínimo 6 caracteres.";
    if (!confirm) next.confirm = "Confirme sua senha.";
    else if (password !== confirm) next.confirm = "As senhas não coincidem.";
 
    setErrors(next);
    return Object.keys(next).length === 0;
  }
 
  // async function handleRegister() {
  //   if (!validate()) return;
  //   setLoading(true);

 

  //   if (error) {
  //     const msg = error.message.toLowerCase();
  //     if (msg.includes("already registered") || msg.includes("user already exists")) {
  //       setErrors({ email: "Este e-mail já está cadastrado." });
  //     } else {
  //       setErrors({ email: "Erro ao criar conta. Tente novamente." });
  //     }
  //     setLoading(false);
  //     return;
  //   }
 
  //   router.push("/dashboard");
  // }

  return (
    <div className={styles["form-box"]}>
      <div className={styles["form-header"]}>
        <h2 className={styles["form-title"]}>Create account</h2>
        <p className={styles["form-subtitle"]}>Fill in the details to get started.</p>
      </div>

      <div className={styles["form-fields"]}>
        <Input
          label="Name"
          type="text"
          placeholder="Name"
          value={nickname}
          leftIcon="user"
          onChange={e => { setNickname(e.target.value); clearError("nickname"); }}
          error={errors.nickname}
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="your@email.com"
          leftIcon="email"
          value={email}
          onChange={e => { setEmail(e.target.value); clearError("email"); }}
          error={errors.email}
        />

        <Input
          label="Password"
          isPassword
          placeholder="Minimum 6 characters"
          leftIcon="password"
          value={password}
          onChange={e => { setPassword(e.target.value); clearError("password"); }}
          error={errors.password}
        />

        <Input
          label="Confirm password"
          isPassword
          placeholder="Repeat the password"
          leftIcon="password"
          onChange={e => { setConfirm(e.target.value); clearError("confirm"); }}
          error={errors.confirm}
        />
        <button
          className={styles["form-btn"]}
          // onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating an account..." : "Create account"}
          {!loading && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          )}
        </button>
      </div>

      <p className={styles["footer-link"]}>
        You already have an account.? <a href="/login">Login.</a>
      </p>
    </div>
  );
}