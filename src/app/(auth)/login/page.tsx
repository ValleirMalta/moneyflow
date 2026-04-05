
import styles from '../auth.module.css';

export default function Login() {
  return (
    <main>

      <form  className={styles.formAuth}>
        <div className={styles.inputGroup}>
          <input type="email" placeholder="Digite seu email" />
        </div>

        <div className={styles.inputGroup}>
          <input type="password" placeholder="Digite sua senha" />
        </div>

        <button type="submit" className="button">
          Entrar
        </button>
      </form>
    </main>
  );
}