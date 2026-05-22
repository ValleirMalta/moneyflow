import styles from './auth.module.css';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      {/* LEFT PANEL */}
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <Image
            src="/logo.svg"
            width={500}
            height={500}
            alt="Picture of the author"
            className={styles.logoSvg}
          />

          <div className={styles.leftText}>
            <h1 className={styles.headline}>
              Controle seu<br />
              dinheiro com<br />
              com mais<br />
              <span className={styles.accent}>clareza.</span>
            </h1>
            <p className={styles.sub}>
              Visualize entradas, saídas e tendências em um só lugar.
            </p>
          </div>
        </div>

        <div className={styles.leftFooter}>
          © 2025 Desenvolvido por Valleir Malta
        </div>
      </div>
      <div className={styles.right}>
        {children}
      </div>
    </div>
  );
}