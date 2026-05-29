"use client";
// import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
// interface UserMetadata {
//   nickname: string;
//   email?: string;
// }
export default function Dashboard() {
 
return (
    <main  className={styles.dashboard}>
      <header className={styles.title}>
        <h1>Dashbord</h1>
      </header>
      <div  className={styles.currentMonth}>
        <h2 className={styles.titleCurrentMonth}>Mês Atual</h2>
        <p className={styles.Month}>Abril 2025</p>
        <ul>
          <li>
            <span>Renda</span>
            <p>R$ 5.800</p>
          </li>
          <li>
            <span>Dívidas</span>
            <p>R$ 3.340</p>
          </li>
          <li>
            <span>Saldo</span>
            <p>R$ 6.700</p>
          </li>
          <li>
            <span>Progresso</span>
            <p>R44% Pago</p>
          </li>
        </ul>
      </div>
      <div>
        <h2>Historio de meses</h2>
      </div>
    </main>
  );
}