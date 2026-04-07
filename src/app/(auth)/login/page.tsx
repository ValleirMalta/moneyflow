"use client";

import { useState } from "react";
import Input, { IconEmail, IconLock } from "@/components/Input";
import styles from "../auth.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          onChange={e => setEmail(e.target.value)}
        />
        <div>
          <div className={styles.fieldRow}>
            <span className={styles.label}>Senha</span>
            {/* 
            Irei colocar mais pra frente:
            <a href="#" className={styles.forgot}>Esqueceu a senha?</a> */}
          </div>
          <Input
            isPassword
            placeholder="••••••••"
            leftIcon={<IconLock />}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className={styles.btnForm}>
          Entrar
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      <p className={styles.footerLink}>
        Não tem uma conta? <a href="/register">Criar conta</a>
      </p>
    </div>
  );
}