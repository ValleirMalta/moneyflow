import styles from './auth.module.css';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Image
          src="/logo.svg"
          width={500}
          height={500}
          alt="Picture of the author"
          className={styles.logoSvg}
        />
        {children}
      </div>
    </div>
  );
}