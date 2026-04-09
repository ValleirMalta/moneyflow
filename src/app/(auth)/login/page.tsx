"use client";
 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input, { IconEmail, IconLock } from "@/components/Input";
import { createClient } from "@/lib/supabase/client";
import styles from "../auth.module.css";
 
type Fields = "email" | "password";
type Errors = Partial<Record<Fields, string>>;

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });
  }, []);

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
    if (!email) next.email = "Informe seu e-mail.";
    else if (!emailRegex.test(email)) next.email = "Informe um e-mail válido.";
 
    if (!password) next.password = "Informe sua senha.";
 
    setErrors(next);
    return Object.keys(next).length === 0;
  }
 
  async function handleLogin() {
    if (!validate()) return;
 
    setLoading(true);
 
    const { error } = await supabase.auth.signInWithPassword({ email, password });
 
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
         setErrors({ 
          email: " ",
          password: "E-mail ou senha incorretos."
         });
      } else if (msg.includes("Email não confirmado")) {
        setErrors({ email: "Confirme seu e-mail antes de entrar." });
      } else {
        setErrors({ password: "Erro ao entrar. Tente novamente." });
      }
      setLoading(false);
      return;
    }
 
    router.push("/dashboard");
  }

  return (
     <div className={styles.formWrap}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Bem-vindo de volta</h2>
        <p className={styles.formSub}>Entre com sua conta para continuar</p>
      </div>
 
      <div className={styles.fields}>
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          leftIcon={<IconEmail />}
          value={email}
          onChange={e => { setEmail(e.target.value); clearError("email"); }}
          error={errors.email}
        />
 
        <div>
          {/* <div className={styles.fieldRow}>
            <span className={styles.label}>Senha</span>
            <a href="#" className={styles.forgot}>Esqueceu a senha?</a>
          </div> */}
          <Input
            isPassword
            placeholder="••••••••"
            leftIcon={<IconLock />}
            value={password}
            onChange={e => { setPassword(e.target.value); clearError("password"); }}
            error={errors.password}
          />
        </div>
 
        <button
          className={styles.btnForm}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
          {!loading && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          )}
        </button>
      </div>
 
      <p className={styles.footerLink}>
        Não tem uma conta? <a href="/register">Criar conta</a>
      </p>
    </div>
  );
}