"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Input, { IconUser, IconEmail, IconLock } from "@/components/Input";
import styles from "../auth.module.css";

type Fields = "nickname" | "email" | "password" | "confirm";
type Errors = Partial<Record<Fields, string>>;
export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

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
 
  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);

     const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    });
 

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("user already exists")) {
        setErrors({ email: "Este e-mail já está cadastrado." });
      } else {
        setErrors({ email: "Erro ao criar conta. Tente novamente." });
      }
      setLoading(false);
      return;
    }
 
    router.push("/dashboard");
  }

  return (
    <div className={styles.formWrap}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Criar conta</h2>
        <p className={styles.formSub}>Preencha os dados para começar</p>
      </div>

      <div className={styles.fields}>
        <Input
          label="Nickname"
          type="text"
          placeholder="Nome"
          value={nickname}
          leftIcon={<IconUser />}
          onChange={e => { setNickname(e.target.value); clearError("nickname"); }}
          error={errors.nickname}
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          leftIcon={<IconEmail />}
          value={email}
          onChange={e => { setEmail(e.target.value); clearError("email"); }}
          error={errors.email}
        />

        <Input
          label="Senha"
          isPassword
          placeholder="Mínimo 6 caracteres"
          leftIcon={<IconLock />}
          value={password}
          onChange={e => { setPassword(e.target.value); clearError("password"); }}
          error={errors.password}
        />

        <Input
          label="Confirmar senha"
          isPassword
          placeholder="Repita a senha"
          leftIcon={<IconLock />}
          onChange={e => { setConfirm(e.target.value); clearError("confirm"); }}
          error={errors.confirm}
        />
        <button
          className={styles.btnForm}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Criando conta..." : "Criar conta"}
          {!loading && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          )}
        </button>
      </div>

      <p className={styles.footerLink}>
        Já tem uma conta? <a href="/login">Entrar</a>
      </p>
    </div>
  );
}