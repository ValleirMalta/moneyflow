"use client";

import { useState } from "react";
import Input, { IconUser, IconEmail, IconLock } from "@/components/Input";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className={styles.formWrap}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Criar conta</h2>
        <p className={styles.formSub}>Preencha os dados para começar</p>
      </div>

      <div className={styles.fields}>
        <Input
          label="Nome completo"
          type="text"
          placeholder="João Silva"
          leftIcon={<IconUser />}
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          leftIcon={<IconEmail />}
        />

        <Input
          label="Senha"
          isPassword
          placeholder="Mínimo 8 caracteres"
          leftIcon={<IconLock />}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <Input
          label="Confirmar senha"
          isPassword
          placeholder="Repita a senha"
          leftIcon={<IconLock />}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          error={mismatch ? "As senhas não coincidem" : undefined}
        />

        <button className={styles.btn}>
          Criar conta
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <p className={styles.footerLink}>
        Já tem uma conta? <a href="/login">Entrar</a>
      </p>
    </div>
  );
}