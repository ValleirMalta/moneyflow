'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './auth.module.css';
import { ReactNode } from 'react';
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
console.log("pathname", pathname)
  let title = '';
  if (pathname?.includes('login')) {
    title = 'Login';
  } else if (pathname?.includes('register')) {
    title = 'Cadastro';
  } else {
    title = 'Bem-vindo';
  }
  return (
    <main className={styles.pageAuth}>
      <div className={styles.cardAuth}>
        <div className={styles.headerAuth}>
          <Image
              src="/moneyflow-logo-line.svg"
              alt="logo"
              width={300}
              height={300}
              className={styles.logoAuth}
          />
          <h1>{title}</h1>
        </div>
        {children}
      </div>
    </main>
  )
}